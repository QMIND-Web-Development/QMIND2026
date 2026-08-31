"use client";

import { cloneElement, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CAREERS_CONFIG, DEMOGRAPHIC_QUESTIONS, getVideoPrompt, REFERRAL_OPTIONS } from "./config";
import { submitApplication } from "./actions";
import type { HiringProject } from "./types";
import styles from "./careers.module.scss";

const optionalUrl = z.union([z.literal(""), z.string().url("Enter a complete URL.")]);
const words = (value = "") => value.trim().split(/\s+/).filter(Boolean).length;

const formSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    pronouns: z.string().max(60),
    queensEmail: z
      .string()
      .email("Enter a valid email.")
      .refine((value) => value.toLowerCase().endsWith("@queensu.ca"), "Use your Queen's email."),
    preferredEmail: z.string().email("Enter a valid email."),
    graduationYear: z.string().regex(/^20\d{2}$/, "Enter a four-digit graduation year."),
    faculty: z.string().trim().min(2, "Enter your faculty."),
    major: z.string().trim().min(2, "Enter your major."),
    resume: z
      .any()
      .refine((files) => files?.length === 1, "Upload your resume.")
      .refine((files) => !files?.[0] || files[0].size <= CAREERS_CONFIG.resumeMaxBytes, "Resume must be 8 MB or less.")
      .refine((files) => {
        if (!files?.[0]) return true;
        const extension = files[0].name.split(".").pop()?.toLowerCase();
        return extension === "pdf" || extension === "docx";
      }, "Upload a PDF or DOCX file."),
    linkedIn: optionalUrl,
    github: optionalUrl,
    additionalProjects: z.string().max(500),
    videoUrl: z.string().url("Enter a shareable video URL."),
    whyQmind: z
      .string()
      .trim()
      .min(20, "Tell us a little more.")
      .refine((value) => words(value) <= 200, "Keep your response to 200 words."),
    skillsExperience: z
      .string()
      .trim()
      .min(20, "Tell us a little more.")
      .refine((value) => words(value) <= 200, "Keep your response to 200 words."),
    funFact: z.string().trim().min(2, "Share a fun fact."),
    referralSource: z.string().min(1, "Choose an option."),
    referralOther: z.string().max(120),
    socialConfirmed: z.boolean().refine(Boolean, "Please confirm that you have followed QMIND on Instagram and joined the Discord."),
    demographicResponses: z.record(z.string()),
    consent: z.boolean().refine(Boolean, "Consent is required to submit."),
  })
  .refine((data) => data.referralSource !== "Other" || data.referralOther.trim().length > 0, {
    path: ["referralOther"],
    message: "Tell us how you heard about QMIND.",
  });

type FormValues = z.infer<typeof formSchema>;
type CategoryFilter = "All" | "Consulting" | "Research";

const sections = [
  "Choose projects",
  "Your information",
  "Application questions",
  "Demographic survey",
  "Review and submit",
];

const fieldsByStep: Array<Array<keyof FormValues>> = [
  [],
  ["fullName", "pronouns", "queensEmail", "preferredEmail", "graduationYear", "faculty", "major", "resume"],
  [
    "linkedIn",
    "github",
    "additionalProjects",
    "videoUrl",
    "whyQmind",
    "skillsExperience",
    "funFact",
    "referralSource",
    "referralOther",
    "socialConfirmed",
  ],
  [],
  ["consent"],
];

export default function CareersApplication({
  projects,
  projectsUnavailable,
}: {
  projects: HiringProject[];
  projectsUnavailable: boolean;
}) {
  const [step, setStep] = useState(0);
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [ranked, setRanked] = useState<HiringProject[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const completionRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      pronouns: "",
      queensEmail: "",
      preferredEmail: "",
      graduationYear: "",
      faculty: "",
      major: "",
      linkedIn: "",
      github: "",
      additionalProjects: "",
      videoUrl: "",
      whyQmind: "",
      skillsExperience: "",
      funFact: "",
      referralSource: "",
      referralOther: "",
      socialConfirmed: false,
      demographicResponses: Object.fromEntries(
        DEMOGRAPHIC_QUESTIONS.map((question) => [question.id, "Prefer not to answer"])
      ),
      consent: false,
    },
  });

  const values = useWatch({ control });
  const filteredProjects = useMemo(
    () => projects.filter((project) => filter === "All" || project.category === filter),
    [filter, projects]
  );
  const topChoice = ranked[0];
  const videoPrompt = topChoice ? getVideoPrompt(topChoice) : "Select your top project to reveal your prompt.";

  useEffect(() => {
    if (ranked.length !== 3) return;
    completionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    completionRef.current?.focus({ preventScroll: true });
  }, [ranked.length]);

  function selectProject(project: HiringProject) {
    setRanked((current) => {
      if (current.some((item) => item.id === project.id)) {
        return current.filter((item) => item.id !== project.id);
      }
      return current.length < 3 ? [...current, project] : current;
    });
  }

  function moveProject(index: number, direction: -1 | 1) {
    setRanked((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.length) return current;
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }

  async function nextStep() {
    setSubmissionError("");
    if (step === 0 && ranked.length !== 3) {
      setSubmissionError("Select exactly three projects before continuing.");
      return;
    }
    const valid = await trigger(fieldsByStep[step]);
    if (!valid) return;
    setStep((current) => Math.min(current + 1, sections.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(data: FormValues) {
    if (ranked.length !== 3) {
      setStep(0);
      setSubmissionError("Select exactly three projects before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmissionError("");
    const body = new FormData();
    body.set("resume", data.resume[0]);
    body.set(
      "application",
      JSON.stringify({
        ...data,
        resume: undefined,
        rankedProjectIds: ranked.map((project) => project.id),
        rankedProjectTitles: ranked.map((project) => project.projectTitle),
      })
    );
    const result = await submitApplication(body);
    setSubmitting(false);
    if (!result.ok) {
      setSubmissionError(result.message);
      return;
    }
    setApplicationId(result.applicationId);
    window.localStorage.removeItem("qmind-careers-draft");
  }

  if (applicationId) {
    return (
      <section className={styles.success} aria-labelledby="success-title">
        <p className={styles.kicker}>Application received</p>
        <h1 id="success-title">Thank you for applying.</h1>
        <p>
          Your application was received and we're excited to meet you! If you have any questions or concerns,
          please send an email to <a href="mailto:design@qmind.ca">design@qmind.ca</a>
        </p>
      </section>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroTitle}>
          <p className={styles.kicker}>QMIND Careers</p>
          <h1>Build what comes next.</h1>
        </div>
        <div className={styles.heroMark}>
          <Image
            src="/icons/qmind_logo.png"
            alt="QMIND"
            width={394}
            height={690}
            priority
          />
        </div>
        <div className={styles.heroDetails}>
          <p>Join a team of Queen's students applying AI to research questions and real client problems.</p>
          <dl>
            <div><dt>Applications open</dt><dd>{CAREERS_CONFIG.opensOn}</dd></div>
            <div><dt>Applications close</dt><dd>{CAREERS_CONFIG.closesOn}</dd></div>
          </dl>
        </div>
      </header>

      <div className={styles.applicationLayout}>
        <aside className={styles.progress} aria-label="Application progress">
          <p>Your application</p>
          <ol>
            {sections.map((section, index) => (
              <li key={section} className={index === step ? styles.activeStep : index < step ? styles.completeStep : ""}>
                <span>{index < step ? "✓" : index + 1}</span>{section}
              </li>
            ))}
          </ol>
          <p className={styles.progressNote}>Your application cannot be edited after submission.</p>
        </aside>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 0 && (
            <section aria-labelledby="projects-heading">
              <div className={styles.sectionIntro}>
                <h2 id="projects-heading">Choose your top three</h2>
                <p>Select three distinct projects. Your selection order determines your video prompt.</p>
              </div>

              <div className={styles.ranking} aria-label="Ranked project choices">
                {[0, 1, 2].map((index) => {
                  const project = ranked[index];
                  return (
                    <div className={styles.rankSlot} key={index}>
                      <span>{["Top choice", "Second choice", "Third choice"][index]}</span>
                      {project ? (
                        <div>
                          <strong>{project.projectTitle}</strong>
                          <small className={styles.rankCategory}>{project.category}</small>
                          <div className={styles.rankActions}>
                            <button type="button" onClick={() => moveProject(index, -1)} disabled={index === 0}>Move up</button>
                            <button type="button" onClick={() => moveProject(index, 1)} disabled={index === ranked.length - 1}>Move down</button>
                            <button type="button" onClick={() => selectProject(project)}>Remove</button>
                          </div>
                        </div>
                      ) : <em>Not selected</em>}
                    </div>
                  );
                })}
              </div>

              {ranked.length === 3 ? (
                <div className={styles.selectionComplete} ref={completionRef} tabIndex={-1}>
                  <div>
                    <span>Your project ranking is complete</span>
                    <strong>Continue to your applicant information.</strong>
                  </div>
                  <button type="button" className={styles.primaryButton} onClick={nextStep}>Next section</button>
                </div>
              ) : (
                <>
                  <div className={styles.filters} aria-label="Filter projects">
                    {(["All", "Consulting", "Research"] as CategoryFilter[]).map((item) => (
                      <button type="button" key={item} className={filter === item ? styles.activeFilter : ""} onClick={() => setFilter(item)}>
                        {item}
                      </button>
                    ))}
                  </div>

                  {projectsUnavailable ? (
                    <div className={styles.stateMessage}>Projects could not be loaded. Refresh the page to try again.</div>
                  ) : filteredProjects.length === 0 ? (
                    <div className={styles.stateMessage}>No projects match this filter.</div>
                  ) : (
                    <div className={styles.projectList}>
                      {filteredProjects.map((project) => {
                    const rank = ranked.findIndex((item) => item.id === project.id);
                    const isExpanded = expanded.has(project.id);
                    return (
                      <article className={`${styles.project} ${rank >= 0 ? styles.selectedProject : ""}`} key={project.id}>
                        <div className={styles.projectHeading}>
                          <div>
                            <span>{project.category}</span>
                            <h3>{project.projectTitle}</h3>
                          </div>
                          <button type="button" className={styles.selectButton} disabled={rank < 0 && ranked.length === 3} onClick={() => selectProject(project)}>
                            {rank >= 0 ? `${["Top", "Second", "Third"][rank]} choice` : "Select project"}
                          </button>
                        </div>
                        <p>{project.shortDescription}</p>
                        {isExpanded && project.impactDescription && <p className={styles.impact}>{project.impactDescription}</p>}
                        {project.impactDescription && (
                          <button
                            type="button"
                            className={styles.readMore}
                            aria-expanded={isExpanded}
                            onClick={() => setExpanded((current) => {
                              const next = new Set(current);
                              next.has(project.id) ? next.delete(project.id) : next.add(project.id);
                              return next;
                            })}
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </article>
                    );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="information-heading">
              <div className={styles.sectionIntro}>
                <h2 id="information-heading">Your information</h2>
                <p>Tell us how to contact you and where you are in your studies.</p>
              </div>
              <div className={styles.fieldGrid}>
                <Field label="Full name" error={errors.fullName?.message}><input {...register("fullName")} autoComplete="name" /></Field>
                <Field label="Pronouns (optional)" error={errors.pronouns?.message}><input {...register("pronouns")} /></Field>
                <Field label="Queen's email" error={errors.queensEmail?.message}><input {...register("queensEmail")} type="email" autoComplete="email" /></Field>
                <Field label="Preferred email" error={errors.preferredEmail?.message}><input {...register("preferredEmail")} type="email" /></Field>
                <Field label="Graduation year" error={errors.graduationYear?.message}><input {...register("graduationYear")} inputMode="numeric" placeholder="2028" /></Field>
                <Field label="Faculty" error={errors.faculty?.message}><input {...register("faculty")} /></Field>
                <Field label="Major" error={errors.major?.message}><input {...register("major")} /></Field>
                <Field label="Resume" error={errors.resume?.message as string} hint="PDF or DOCX, maximum 8 MB">
                  <input {...register("resume")} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                </Field>
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="questions-heading">
              <div className={styles.sectionIntro}>
                <h2 id="questions-heading">Application questions</h2>
                <p>We value thoughtful, specific answers. Technical experience is not the only experience that matters.</p>
                <p><strong>Please do not use Generative AI in these responses. This is our opportunity to get to know YOU!</strong></p>
              </div>
              <div className={styles.fieldGrid}>
                <Field label="LinkedIn profile (optional)" error={errors.linkedIn?.message}><input {...register("linkedIn")} type="url" placeholder="https://linkedin.com/in/..." /></Field>
                <Field label="GitHub profile (optional)" error={errors.github?.message}><input {...register("github")} type="url" placeholder="https://github.com/..." /></Field>
              </div>
              <Field label="Other projects you are interested in (optional)" error={errors.additionalProjects?.message}>
                <textarea {...register("additionalProjects")} rows={3} />
              </Field>
              <div className={styles.prompt}>
                <span>Video prompt for {topChoice?.projectTitle || "your top choice"}</span>
                <strong>{videoPrompt}</strong>
              </div>
              <Field label="Shareable video link" error={errors.videoUrl?.message} hint="Set Google Drive permissions to Anyone with the link can view.">
                <input {...register("videoUrl")} type="url" placeholder="https://drive.google.com/..." />
              </Field>
              <Field label="Why do you want to join QMIND?" error={errors.whyQmind?.message} hint={`${words(values.whyQmind)} / 200 words`}>
                <textarea {...register("whyQmind")} rows={7} />
              </Field>
              <Field label="What skills and experiences will help you excel as a QMIND Design Team Member?" error={errors.skillsExperience?.message} hint={`${words(values.skillsExperience)} / 200 words`}>
                <textarea {...register("skillsExperience")} rows={7} />
              </Field>
              <Field label="What is a fun fact about you?" error={errors.funFact?.message}>
                <textarea {...register("funFact")} rows={3} />
              </Field>
              <div className={styles.fieldGrid}>
                <Field label="How did you hear about QMIND?" error={errors.referralSource?.message}>
                  <select {...register("referralSource")}>
                    <option value="">Select one</option>
                    {REFERRAL_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </Field>
                {values.referralSource === "Other" && (
                  <Field label="Please specify" error={errors.referralOther?.message}><input {...register("referralOther")} /></Field>
                )}
              </div>
              <label className={styles.checkbox}>
                <input
                  id="social-confirmed"
                  type="checkbox"
                  {...register("socialConfirmed")}
                  aria-invalid={Boolean(errors.socialConfirmed)}
                  aria-describedby={errors.socialConfirmed ? "social-confirmed-error" : undefined}
                />
                <span>
                  I have followed QMIND on{" "}
                  <a href="https://instagram.com/qmind.ai/" target="_blank" rel="noreferrer">Instagram</a>
                  {" "}and joined the{" "}
                  <a href="https://discord.gg/U3KueACtJe" target="_blank" rel="noreferrer">Discord</a>.
                </span>
              </label>
              {errors.socialConfirmed?.message && (
                <p id="social-confirmed-error" className={styles.errorText}>{errors.socialConfirmed.message}</p>
              )}
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="demographics-heading">
              <div className={styles.sectionIntro}>
                <h2 id="demographics-heading">Demographic survey</h2>
                <p>
                  These questions are optional and are not used to evaluate your application.
                  They help QMIND understand who its recruitment process is reaching.
                </p>
              </div>
              <div className={styles.demographicNotice}>
                <strong>Your choice</strong>
                <p>You may select Prefer not to answer for any or all questions.</p>
              </div>
              <div className={styles.demographicFields}>
                {DEMOGRAPHIC_QUESTIONS.map((question) => (
                  <Field key={question.id} label={`${question.label} (optional)`}>
                    <select {...register(`demographicResponses.${question.id}`)}>
                      <option value="Prefer not to answer">Prefer not to answer</option>
                      {question.options.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </Field>
                ))}
              </div>
            </section>
          )}

          {step === 4 && (
            <section aria-labelledby="review-heading">
              <div className={styles.sectionIntro}>
                <h2 id="review-heading">Review and submit</h2>
                <p>Check your choices carefully. You will not be able to edit your application after submitting.</p>
              </div>
              <div className={styles.reviewBlock}>
                <h3>Project ranking</h3>
                <ol>{ranked.map((project) => <li key={project.id}>{project.projectTitle} <span>{project.category}</span></li>)}</ol>
              </div>
              <div className={styles.reviewBlock}>
                <h3>Applicant</h3>
                <p>{values.fullName}</p><p>{values.preferredEmail}</p><p>{values.faculty}, {values.major}, {values.graduationYear}</p>
              </div>
              <div className={styles.demographics}>
                <h3>Demographic survey</h3>
                <p>Your optional demographic responses have been recorded. Return to the previous section if you want to review them.</p>
              </div>
              <label className={styles.consent}>
                <input type="checkbox" {...register("consent")} />
                <span>I consent to QMIND collecting and using my application information for recruitment and selection.</span>
              </label>
              {errors.consent?.message && <p className={styles.errorText}>{errors.consent.message}</p>}
            </section>
          )}

          {submissionError && <div className={styles.formError} role="alert">{submissionError}</div>}
          {!(step === 0 && ranked.length === 3) && (
            <div className={styles.navigationButtons}>
              {step > 0 && <button type="button" className={styles.secondaryButton} onClick={() => setStep((current) => current - 1)}>Previous section</button>}
              {step < sections.length - 1 ? (
                <button type="button" className={styles.primaryButton} onClick={nextStep}>Next section</button>
              ) : (
                <button type="submit" className={styles.primaryButton} disabled={submitting}>{submitting ? "Submitting application" : "Submit application"}</button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactElement;
}) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      {cloneElement(children, { id } as React.HTMLAttributes<HTMLElement>)}
      <small className={error ? styles.errorText : ""}>{error || hint}</small>
    </label>
  );
}
