import { Course, Video } from "@/types";
import { getVideoById } from "./videos";

export const courses: Course[] = [
  {
    id: "scd",
    slug: "sonarqube-certified-developer",
    title: "SonarQube Certified Developer",
    shortTitle: "SCD",
    description:
      "Master the fundamentals of SonarQube — from installation to your first scan, Clean Code methodology, and IDE integration.",
    difficulty: "beginner",
    targetAudience: "Developers adopting SonarQube for the first time",
    learningOutcomes: [
      "Install and configure SonarQube Server from scratch",
      "Run your first static analysis scan on a real project",
      "Apply Clean as You Code methodology to stop new debt",
      "Integrate SonarQube for IDE into VS Code and IntelliJ",
      "Interpret quality gate results and fix reported issues",
    ],
    accentColor: "qube-blue",
    modules: [
      {
        id: "scd-m1",
        title: "What is Sonar?",
        description: "Introduction and overview of the Sonar ecosystem",
        videoIds: ["v177", "v194", "v188", "v192"],
      },
      {
        id: "scd-m2",
        title: "Installation & First Scan",
        description: "Get SonarQube running and scan your first project",
        videoIds: ["v159", "v94", "v138"],
      },
      {
        id: "scd-m3",
        title: "Clean Code Fundamentals",
        description:
          "Learn Clean as You Code methodology and cognitive complexity",
        videoIds: ["v163", "v98", "v212", "v202"],
      },
      {
        id: "scd-m4",
        title: "SonarQube for IDE",
        description: "IDE integration with VS Code, IntelliJ, and connected mode",
        videoIds: ["v191", "v158", "v145", "v127"],
      },
    ],
  },
  {
    id: "scse",
    slug: "sonarqube-certified-security-engineer",
    title: "SonarQube Certified Security Engineer",
    shortTitle: "SCSE",
    description:
      "Deep-dive into SonarQube's security analysis — SAST, secrets detection, taint analysis, and vulnerability remediation workflows.",
    difficulty: "intermediate",
    targetAudience: "AppSec engineers and security-focused developers",
    learningOutcomes: [
      "Configure SAST rules and security hotspot detection",
      "Use taint analysis to trace injection vulnerabilities end-to-end",
      "Detect hardcoded secrets and credentials with CLI scanning",
      "Triage CVEs and assess real-world exploitability",
      "Build security review workflows around hotspot status",
    ],
    accentColor: "sonar-red",
    modules: [
      {
        id: "scse-m1",
        title: "SAST Foundations",
        description: "Security hotspots, static analysis, and taint overview",
        videoIds: ["v228", "v214", "v153"],
      },
      {
        id: "scse-m2",
        title: "Secrets Detection",
        description: "CLI scanning and secrets detection features",
        videoIds: ["v2", "v70", "v155"],
      },
      {
        id: "scse-m3",
        title: "Vulnerability Research",
        description: "CVE walkthroughs and real-world vulnerability demos",
        videoIds: ["v96", "v107", "v119", "v124", "v129"],
      },
      {
        id: "scse-m4",
        title: "Advanced Security Analysis",
        description: "Taint analysis deep dives and injection detection",
        videoIds: ["v83", "v93", "v122"],
      },
      {
        id: "scse-m5",
        title: "Security in Practice",
        description: "Hotspot review workflows and security reports",
        videoIds: ["v95", "v149", "v229"],
      },
    ],
  },
  {
    id: "scde",
    slug: "sonarqube-certified-devops-engineer",
    title: "SonarQube Certified DevOps Engineer",
    shortTitle: "SCDE",
    description:
      "Integrate SonarQube into CI/CD pipelines — GitHub, GitLab, Azure DevOps, Jenkins, and SonarQube Cloud configuration.",
    difficulty: "intermediate",
    targetAudience: "DevOps/platform engineers and CI/CD admins",
    learningOutcomes: [
      "Integrate SonarQube into GitHub, GitLab, Bitbucket, and Azure DevOps",
      "Configure PR decoration and Quality Gate merge blocking",
      "Set up Jenkins pipelines with SonarQube analysis",
      "Deploy SonarQube Cloud with auto-import and Slack notifications",
      "Enforce quality gates as CI/CD pipeline gates",
    ],
    accentColor: "qube-blue",
    modules: [
      {
        id: "scde-m1",
        title: "DevOps Integration Overview",
        description: "Fundamentals of embedding static analysis in CI/CD",
        videoIds: ["v101", "v201"],
      },
      {
        id: "scde-m2",
        title: "GitHub Integration",
        description: "PR decoration, Quality Gate blocking, and setup",
        videoIds: ["v69", "v172", "v227", "v216"],
      },
      {
        id: "scde-m3",
        title: "GitLab & Bitbucket Setup",
        description: "Merge request decoration and pipeline integration",
        videoIds: ["v167", "v226", "v225"],
      },
      {
        id: "scde-m4",
        title: "Azure DevOps & Jenkins Pipelines",
        description: "Azure DevOps integration and Jenkins analysis",
        videoIds: ["v150", "v224", "v221", "v220"],
      },
      {
        id: "scde-m5",
        title: "SonarQube Cloud",
        description: "Auto-import, Slack integration, and cloud features",
        videoIds: ["v4", "v1", "v80", "v59"],
      },
    ],
  },
  {
    id: "scai",
    slug: "sonarqube-certified-ai-code-verification",
    title: "SonarQube Certified AI Code Verification Specialist",
    shortTitle: "SCAI",
    description:
      "Verify AI-generated code quality — MCP Server integrations, Copilot workflows, LLM benchmarking, and AI coding best practices.",
    difficulty: "intermediate",
    targetAudience:
      "Developers using AI coding assistants (Copilot, Cursor, Claude Code)",
    learningOutcomes: [
      "Set up SonarQube MCP Server in Cursor, Claude Code, and Gemini CLI",
      "Verify AI-generated code meets quality and security standards",
      "Integrate GitHub Copilot with SonarQube for real-time AI code review",
      "Benchmark LLM code quality across models",
      "Apply the 7 habits of effective AI-assisted development",
    ],
    accentColor: "sonar-purple",
    modules: [
      {
        id: "scai-m1",
        title: "AI Code Verification Foundations",
        description: "Why AI-generated code needs verification",
        videoIds: ["v75", "v108", "v40", "v24"],
      },
      {
        id: "scai-m2",
        title: "MCP Server Integrations",
        description: "Cursor, Claude Code, Gemini CLI, and Windsurf setup",
        videoIds: ["v71", "v79", "v3", "v82", "v81"],
      },
      {
        id: "scai-m3",
        title: "Copilot + Sonar Workflows",
        description: "GitHub Copilot integration and AI code review",
        videoIds: ["v100", "v116", "v28"],
      },
      {
        id: "scai-m4",
        title: "AI Code Quality Best Practices",
        description: "7 habits, LLM benchmarking, and quality strategies",
        videoIds: ["v67", "v66", "v41"],
      },
    ],
  },
  {
    id: "scea",
    slug: "sonarqube-certified-enterprise-architect",
    title: "SonarQube Certified Enterprise Architect",
    shortTitle: "SCEA",
    description:
      "Enterprise deployment, portfolio governance, quality gates at scale, and compliance — for architects and engineering leaders.",
    difficulty: "advanced",
    targetAudience: "Engineering managers, architects, and governance leads",
    learningOutcomes: [
      "Plan and execute a Community-to-Enterprise SonarQube upgrade",
      "Configure portfolio-level quality gates and aggregate reporting",
      "Apply governance patterns from Cisco and Wolters Kluwer case studies",
      "Set up FedRAMP-compliant audit logging and access controls",
      "Design multi-instance architecture for large organizations",
    ],
    accentColor: "sonar-red",
    modules: [
      {
        id: "scea-m1",
        title: "Enterprise Deployment",
        description: "Community to Enterprise upgrade and architecture",
        videoIds: ["v97", "v18", "v131"],
      },
      {
        id: "scea-m2",
        title: "Portfolio & Governance",
        description: "Quality gates, aggregate views, and portfolio reporting",
        videoIds: ["v110", "v31", "v25", "v39"],
      },
      {
        id: "scea-m3",
        title: "Scaling Quality",
        description: "Enterprise case studies from Cisco, Wolters Kluwer, and more",
        videoIds: ["v10", "v90", "v180"],
      },
      {
        id: "scea-m4",
        title: "Compliance & Federal",
        description: "FedRAMP, audit logging, and regulatory compliance",
        videoIds: ["v104", "v68", "v50"],
      },
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesForVideo(videoId: string): Course[] {
  return courses.filter((c) =>
    c.modules.some((m) => m.videoIds.includes(videoId))
  );
}

export function getCourseVideos(course: Course): Video[] {
  const vids: Video[] = [];
  for (const mod of course.modules) {
    for (const vid of mod.videoIds) {
      const v = getVideoById(vid);
      if (v) vids.push(v);
    }
  }
  return vids;
}

function parseDuration(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

export function getCourseTotalDuration(course: Course): string {
  const videos = getCourseVideos(course);
  const totalSeconds = videos.reduce(
    (sum, v) => sum + parseDuration(v.duration),
    0
  );
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.round((totalSeconds % 3600) / 60);
  if (hours === 0) return `${mins}m`;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getVideoPositionInCourse(
  course: Course,
  videoId: string
): { step: number; total: number; moduleIndex: number } | null {
  let step = 0;
  const allVideos = getCourseVideos(course);
  for (let mi = 0; mi < course.modules.length; mi++) {
    for (const vid of course.modules[mi].videoIds) {
      step++;
      if (vid === videoId) {
        return { step, total: allVideos.length, moduleIndex: mi };
      }
    }
  }
  return null;
}
