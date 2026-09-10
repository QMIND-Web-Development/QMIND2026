"use client";

import { cloneElement, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CAREERS_CONFIG, DEMOGRAPHIC_QUESTIONS, getVideoPrompt, REFERRAL_OPTIONS } from "./config";
import { submitApplication } from "./actions";
import type { HiringProject } from "./types";
import { applicationDetailsSchema, hasValidReferralOther } from "./validation";
import styles from "./careers.module.scss";

const words = (value = "") => value.trim().split(/\s+/).filter(Boolean).length;
const getResumeFile = (value: unknown): File | null => {
  if (typeof File !== "undefined" && value instanceof File) return value;
  if (typeof FileList !== "undefined" && value instanceof FileList) return value.item(0);
  return null;
};

const resumeSchema = z
  .unknown()
  .refine((value) => Boolean(getResumeFile(value)), "Upload your resume.")
  .refine((value) => {
    const file = getResumeFile(value);
    return !file || file.size <= CAREERS_CONFIG.resumeMaxBytes;
  }, "Resume must be 8 MB or less.")
  .refine((value) => {
    const file = getResumeFile(value);
    if (!file) return true;
    const extension = file.name.split(".").pop()?.toLowerCase();
    return extension === "pdf" || extension === "docx";
  }, "Upload a PDF or DOCX file.");

const formSchema = applicationDetailsSchema
  .extend({
    resume: resumeSchema,
  })
  .refine(hasValidReferralOther, {
    path: ["referralOther"],
    message: "Tell us how you heard about QMIND.",
  });

type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;
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
  ["demographicResponses"],
  ["consent"],
];

function findInvalidStep(fieldNames: string[]) {
  return fieldsByStep.findIndex((fields) =>
    fields.some((field) => fieldNames.includes(String(field)))
  );
}

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
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(() => new Set());
  const [projectImageSizes, setProjectImageSizes] = useState<Record<string, { width: number; height: number }>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const completionRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
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

  const resumeRegistration = register("resume");

  const values = useWatch({ control });
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(
      (project) => filter === "All" || project.category === filter
    );
    if (filter !== "All") return filtered;

    const consulting = filtered.filter((project) => project.category === "Consulting");
    const research = filtered.filter((project) => project.category === "Research");
    const alternating: HiringProject[] = [];

    for (let index = 0; index < Math.max(consulting.length, research.length); index += 1) {
      if (consulting[index]) alternating.push(consulting[index]);
      if (research[index]) alternating.push(research[index]);
    }

    return alternating;
  }, [filter, projects]);
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

  function toggleDescription(projectId: number) {
    setExpandedDescriptions((current) => {
      const next = new Set(current);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
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

  function onInvalid(validationErrors: FieldErrors<FormValues>) {
    const invalidStep = findInvalidStep(Object.keys(validationErrors));

    setStep(invalidStep === -1 ? sections.length - 1 : invalidStep);
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    if (step !== sections.length - 1) {
      event.preventDefault();
      return;
    }
    void handleSubmit(onSubmit, onInvalid)(event);
  }

  async function onSubmit(data: FormValues) {
    if (ranked.length !== 3) {
      setStep(0);
      setSubmissionError("Select exactly three projects before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmissionError("");
    const resume = getResumeFile(data.resume) || resumeFile;
    if (!resume) {
      setError("resume", { type: "required", message: "Upload your resume." });
      setStep(1);
      setSubmissionError("Upload your resume before submitting.");
      setSubmitting(false);
      return;
    }
    const body = new FormData();
    body.set("resume", resume);
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
      const serverFields = Object.entries(result.fieldErrors || {});
      for (const [field, messages] of serverFields) {
        const message = messages[0];
        if (message) setError(field as keyof FormValues, { type: "server", message });
      }
      const invalidServerStep = findInvalidStep(serverFields.map(([field]) => field));
      if (invalidServerStep !== -1) setStep(invalidServerStep);
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

        <form className={styles.form} onSubmit={onFormSubmit} noValidate>
          {step === 0 && (
            <section aria-labelledby="projects-heading">
              <div className={styles.sectionIntro}>
                <h2 id="projects-heading">Choose your top three</h2>
                <p>Select three distinct projects. Your top choice determines your application prompt.</p>
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
                        const description = project.fullDescription || project.shortDescription;
                        const canExpandDescription = description.length > 280;
                        const isDescriptionExpanded = expandedDescriptions.has(project.id);
                        const descriptionId = `project-description-${project.id}`;
                        const imageSize = projectImageSizes[String(project.id)];
                        return (
                          <article className={`${styles.project} ${rank >= 0 ? styles.selectedProject : ""}`} key={project.id}>
                            {project.projectImageUrl && (
                              <div
                                className={styles.projectImage}
                                style={imageSize ? {
                                  width: `min(${imageSize.width}px, 22rem, 100%)`,
                                  aspectRatio: `${imageSize.width} / ${imageSize.height}`,
                                } : undefined}
                              >
                                <Image
                                  src={project.projectImageUrl}
                                  alt={`${project.projectTitle} project photo`}
                                  fill
                                  sizes="(max-width: 640px) 100vw, 22rem"
                                  unoptimized
                                  onLoad={(event) => {
                                    const image = event.currentTarget;
                                    if (!image.naturalWidth || !image.naturalHeight) return;
                                    setProjectImageSizes((current) => {
                                      const key = String(project.id);
                                      const nextSize = {
                                        width: image.naturalWidth,
                                        height: image.naturalHeight,
                                      };
                                      const previousSize = current[key];
                                      if (
                                        previousSize?.width === nextSize.width &&
                                        previousSize?.height === nextSize.height
                                      ) {
                                        return current;
                                      }
                                      return { ...current, [key]: nextSize };
                                    });
                                  }}
                                />
                              </div>
                            )}
                            <div className={styles.projectHeading}>
                              <div>
                                <span>{project.category}</span>
                                <h3>{project.projectTitle}</h3>
                              </div>
                              <button type="button" className={styles.selectButton} disabled={rank < 0 && ranked.length === 3} onClick={() => selectProject(project)}>
                                {rank >= 0 ? `${["Top", "Second", "Third"][rank]} choice` : "Select project"}
                              </button>
                            </div>
                            <div className={styles.projectDescription}>
                              <p
                                id={descriptionId}
                                className={canExpandDescription && !isDescriptionExpanded ? styles.descriptionPreview : undefined}
                              >
                                {description}
                              </p>
                              {canExpandDescription && (
                                <button
                                  type="button"
                                  className={styles.readMoreButton}
                                  aria-controls={descriptionId}
                                  aria-expanded={isDescriptionExpanded}
                                  onClick={() => toggleDescription(project.id)}
                                >
                                  {isDescriptionExpanded ? "Read Less" : "Read More"}
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          <section hidden={step !== 1} aria-labelledby="information-heading">
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
              <Field
                label="Resume"
                error={errors.resume?.message as string}
                hint={resumeFile ? `Selected: ${resumeFile.name}` : "PDF or DOCX, maximum 8 MB"}
              >
                <input
                  {...resumeRegistration}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => {
                    const selectedFile = event.currentTarget.files?.[0] || null;
                    setResumeFile(selectedFile);
                    // Keep the native file selection visible while storing a File for validation.
                    resumeRegistration.onChange({
                      target: { name: resumeRegistration.name, value: selectedFile },
                      type: "change",
                    });
                  }}
                />
              </Field>
            </div>
          </section>

          <section hidden={step !== 2} aria-labelledby="questions-heading">
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
                <span>Submit a 1 minute video response</span>
                {topChoice?.promptVideoUrl && (
                  <PromptVideo key={`${topChoice.id}:${topChoice.promptVideoUrl}`} url={topChoice.promptVideoUrl} title={topChoice.projectTitle} />
                )}
                {videoPrompt && <strong className={styles.promptText}>{videoPrompt}</strong>}
              </div>
              <Field label="Shareable video link" error={errors.videoUrl?.message} hint="Set Google Drive permissions to Anyone with the link can view.">
                <input {...register("videoUrl")} type="url" placeholder="https://drive.google.com/..." />
              </Field>
              <Field label="Why do you want to join QMIND?" error={errors.whyQmind?.message} hint={`${words(values.whyQmind)} / 200 words`}>
                <textarea {...register("whyQmind")} rows={7} />
              </Field>
              <Field inputId="field-what-skills-and-experiences-will-help-you-excel-as-a-qmind-design-team-member-" label="What skills and experiences will help you excel as a QMIND member?" error={errors.skillsExperience?.message} hint={`${words(values.skillsExperience)} / 200 words`}>
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

          <section hidden={step !== 3} aria-labelledby="demographics-heading">
              <div className={styles.sectionIntro}>
                <h2 id="demographics-heading">Demographic survey</h2>
                <p>
                  These questions are optional and are not used to evaluate your application.
                  They help QMIND understand who its recruitment process is reaching.
                  Individual responses are stored separately and are not included in the reviewer spreadsheet.
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

          <section hidden={step !== 4} aria-labelledby="review-heading">
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

function PromptVideo({ url, title }: { url: string; title: string }) {
  return (
    <div>
      <iframe
        className={styles.promptVideo}
        src={url}
        title={`Project manager's prompt for ${title}`}
        allow="autoplay; fullscreen"
        allowFullScreen
        loading="lazy"
      />
      <p><a href={url} target="_blank" rel="noreferrer">Open video in Google Drive</a></p>
    </div>
  );
}

function Field({
  label,
  inputId,
  hint,
  error,
  children,
}: {
  label: string;
  inputId?: string;
  hint?: string;
  error?: string;
  children: React.ReactElement;
}) {
  const id = inputId || `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      {cloneElement(children, { id } as React.HTMLAttributes<HTMLElement>)}
      <small className={error ? styles.errorText : ""}>{error || hint}</small>
    </label>
  );
}
