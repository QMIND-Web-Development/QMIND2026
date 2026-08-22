export type HiringProject = {
  id: number;
  projectTitle: string;
  category: "Consulting" | "Research";
  shortDescription: string;
  impactDescription?: string | null;
  tags?: string[] | null;
};

export type ApplicationPayload = {
  fullName: string;
  pronouns?: string;
  queensEmail: string;
  preferredEmail: string;
  graduationYear: string;
  faculty: string;
  major: string;
  linkedIn?: string;
  github?: string;
  additionalProjects?: string;
  videoUrl: string;
  whyQmind: string;
  skillsExperience: string;
  funFact: string;
  referralSource: string;
  referralOther?: string;
  socialConfirmed: boolean;
  demographicResponses: Record<string, string>;
  consent: boolean;
  rankedProjectIds: number[];
  rankedProjectTitles: string[];
};
