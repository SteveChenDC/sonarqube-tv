import { Category } from "@/types";

/**
 * Standalone categories file — kept separate from videos.ts so that
 * client components (Header, VideoCard) can import ONLY the 11-entry
 * categories array without pulling the full 228-video array into the
 * initial client bundle.
 */
export const categories: Category[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description: "Installation, setup, first scan tutorials, and introductory guides for new users.",
  },
  {
    slug: "sonar-summit",
    title: "Sonar Summit",
    description: "Keynotes, sessions, and demos from the annual Sonar Summit conference.",
  },
  {
    slug: "ai-code-quality",
    title: "AI & Code Verification",
    description: "Verifying AI-generated code, MCP Server integrations, agentic workflows, LLM benchmarks, AI CodeFix, and remediation.",
  },
  {
    slug: "code-security",
    title: "Code Security",
    description: "SAST, taint analysis, secrets detection, SCA, vulnerability research, and secure coding practices.",
  },
  {
    slug: "code-quality",
    title: "Code Quality",
    description: "Code quality philosophy, language-specific best practices, and code quality fundamentals.",
  },
  {
    slug: "product-updates",
    title: "Product Updates",
    description: "Release announcements, new feature demos, version upgrade guides, and what's new in SonarQube.",
  },
  {
    slug: "sonarqube-cloud",
    title: "SonarQube Cloud",
    description: "SonarQube Cloud features, setup, dashboards, and enterprise capabilities.",
  },
  {
    slug: "devops-cicd",
    title: "DevOps & CI/CD",
    description: "CI/CD pipeline integration, PR decoration, GitHub, GitLab, Azure DevOps, Bitbucket, and Jenkins workflows.",
  },
  {
    slug: "sonarqube-for-ide",
    title: "SonarQube for IDE",
    description: "SonarQube for IDE extensions for VS Code, IntelliJ, Eclipse, Visual Studio, and CLion.",
  },
  {
    slug: "architecture-governance",
    title: "Architecture & Governance",
    description: "Software architecture management, portfolio reporting, enterprise deployment, governance, quality gates, and compliance.",
  },
  {
    slug: "customer-stories",
    title: "Customer Stories",
    description: "How organizations use SonarQube to improve code quality and security at scale.",
  },
];
