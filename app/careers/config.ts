import type { HiringProject } from "./types";

function projectText(project: HiringProject) {
  return [
    project.projectTitle,
    project.shortDescription,
    project.impactDescription,
    ...(project.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Prompts are derived from the published listing so new projects receive a
 * relevant prompt automatically, without requiring a schema change.
 */
export function getVideoPrompt(project: HiringProject) {
  const text = projectText(project);
  const title = project.projectTitle;

  if (/website|web app|frontend|front-end|ui|ux|design system|platform/.test(text)) {
    return `What steps would you take to design and build ${title}? Walk us through how you would move from the initial idea and user needs to a functioning website or digital product.`;
  }

  if (/health|medical|clinical|patient|hospital|disease|biomedical/.test(text)) {
    return `How would you approach building ${title} responsibly? Tell us how you would understand the healthcare problem, work with stakeholders, validate your solution, and account for safety or accessibility.`;
  }

  if (/language|nlp|text|speech|chatbot|conversation|llm|linguistic/.test(text)) {
    return `How would you approach the language or communication challenge at the centre of ${title}? Describe the data, methods, and evaluation you would use, including how you would handle ambiguity or imperfect results.`;
  }

  if (/machine learning|\bml\b|artificial intelligence|\bai\b|model|prediction|classification|computer vision|neural/.test(text)) {
    return `How would you develop and evaluate a solution for ${title}? Walk us through how you would frame the problem, work with data, choose an approach, and determine whether the result is useful in practice.`;
  }

  if (/robot|hardware|sensor|embedded|drone|autonomous|device|prototype/.test(text)) {
    return `How would you turn the concept behind ${title} into a working prototype? Tell us how you would make design decisions, test your assumptions, and iterate when the system does not behave as expected.`;
  }

  if (/client|business|industry|organization|consult|market|strategy|recommendation/.test(text) || project.category === "Consulting") {
    return `How would you approach solving the real-world problem described by ${title}? Walk us through how you would clarify the client’s needs, communicate your thinking, and turn your analysis into a practical recommendation.`;
  }

  return `What interests you about ${title}, and how would you approach contributing to it? Describe how you would investigate the problem, make progress through uncertainty, and evaluate whether your work is having the intended impact.`;
}

export const CAREERS_CONFIG = {
  opensOn: "September 4, 2026",
  closesOn: "To be announced",
  resumeMaxBytes: 8 * 1024 * 1024,
  resumeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

export const REFERRAL_OPTIONS = [
  "Social Media",
  "Word of Mouth",
  "Through Queen's",
  "Google",
  "Other",
] as const;

// Provisional questions. Leadership can revise these options without changing the form flow.
export const DEMOGRAPHIC_QUESTIONS: Array<{
  id: string;
  label: string;
  options: string[];
}> = [
  {
    id: "genderIdentity",
    label: "How do you describe your gender identity?",
    options: ["Woman", "Man", "Non-binary", "Two-Spirit", "Prefer to self-describe"],
  },
  {
    id: "racializedCommunity",
    label: "Do you identify as a member of a racialized community?",
    options: ["Yes", "No", "Unsure"],
  },
  {
    id: "firstGeneration",
    label: "Are you a first-generation university student?",
    options: ["Yes", "No", "Unsure"],
  },
  {
    id: "disabilityOrNeurodivergence",
    label: "Do you identify as a person with a disability or as neurodivergent?",
    options: ["Yes", "No", "Unsure"],
  },
];
