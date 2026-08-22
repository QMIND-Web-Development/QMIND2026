export const CAREERS_CONFIG = {
  opensOn: "September 4, 2026",
  closesOn: "To be announced",
  resumeMaxBytes: 8 * 1024 * 1024,
  resumeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  videoPrompts: {
    Consulting:
      "Tell us about a time you communicated a complex idea or solved an ambiguous problem.",
    Research:
      "Tell us about a technical or research question you explored beyond the classroom.",
  },
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
