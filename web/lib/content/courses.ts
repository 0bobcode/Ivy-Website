export type Course = {
  slug: string;
  grade: string;
  provider: string;
  title: string;
  description: string;
};

export const courses: Course[] = [
  {
    slug: "intro-ai-python",
    grade: "Grades 4–6",
    provider: "HarvardX",
    title: "Introduction to Artificial Intelligence with Python",
    description: "Learn the fundamentals of AI and Python programming",
  },
  {
    slug: "ai-coding-cursor-claude-middle",
    grade: "Grades 6–8",
    provider: "HarvardX",
    title: "AI Coding with Cursor + Claude",
    description: "Learn the fundamentals of AI and Python programming",
  },
  {
    slug: "ai-coding-mastery",
    grade: "Grades 9–12",
    provider: "HarvardX",
    title: "AI Coding Mastery (Cursor + Claude)",
    description:
      "Advanced program focused on building full-stack applications, debugging complex systems.",
  },
  {
    slug: "ai-developer-grant-program",
    grade: "Grades 10-12",
    provider: "HarvardX",
    title: "AI Developer (Cursor + Claude) Grant Program for Colleges & Universities",
    description:
      "Equip students with in-demand AI development skills using Cursor and Claude.",
  },
  {
    slug: "llmops-specialization",
    grade: "AI Engineer",
    provider: "Duke University",
    title: "Large Language Model Operations (LLMOps) Specialization",
    description:
      "Master LLMOps and the practical deployment of large language models.",
  },
  {
    slug: "ai-coding-cursor-claude-entrepreneur",
    grade: "Entrepreneur",
    provider: "HarvardX",
    title: "AI Coding with Cursor + Claude",
    description:
      "Learn to build, debug, and ship software 10x faster using Cursor and Claude.",
  },
];
