module.exports = [
"[project]/Desktop/workspace/sonarqube-tv/src/data/videos.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "getCategoryBySlug",
    ()=>getCategoryBySlug,
    "getFeaturedVideo",
    ()=>getFeaturedVideo,
    "getVideoById",
    ()=>getVideoById,
    "getVideosByCategory",
    ()=>getVideosByCategory,
    "videos",
    ()=>videos
]);
const categories = [
    {
        slug: "getting-started",
        title: "Getting Started",
        description: "Installation, setup, first scan tutorials, and introductory guides for new users."
    },
    {
        slug: "sonar-summit",
        title: "Sonar Summit",
        description: "Keynotes, sessions, and demos from the annual Sonar Summit conference."
    },
    {
        slug: "ai-code-quality",
        title: "AI & Code Verification",
        description: "Verifying AI-generated code, MCP Server integrations, agentic workflows, LLM benchmarks, AI CodeFix, and remediation."
    },
    {
        slug: "code-security",
        title: "Code Security",
        description: "SAST, taint analysis, secrets detection, SCA, vulnerability research, and secure coding practices."
    },
    {
        slug: "clean-code",
        title: "Clean Code",
        description: "Clean Code philosophy, Clean as You Code methodology, language-specific best practices, and code quality fundamentals."
    },
    {
        slug: "product-updates",
        title: "Product Updates",
        description: "Release announcements, new feature demos, version upgrade guides, and what\x27s new in SonarQube."
    },
    {
        slug: "sonarqube-cloud",
        title: "SonarQube Cloud",
        description: "SonarQube Cloud (formerly SonarCloud) features, setup, dashboards, and enterprise capabilities."
    },
    {
        slug: "devops-cicd",
        title: "DevOps & CI/CD",
        description: "CI/CD pipeline integration, PR decoration, GitHub, GitLab, Azure DevOps, Bitbucket, and Jenkins workflows."
    },
    {
        slug: "sonarqube-for-ide",
        title: "SonarQube for IDE",
        description: "SonarQube for IDE (formerly SonarLint) extensions for VS Code, IntelliJ, Eclipse, Visual Studio, and CLion."
    },
    {
        slug: "architecture-governance",
        title: "Architecture & Governance",
        description: "Software architecture management, portfolio reporting, enterprise deployment, governance, quality gates, and compliance."
    },
    {
        slug: "customer-stories",
        title: "Customer Stories",
        description: "How organizations use Sonar to improve code quality and security at scale."
    }
];
const videos = [
    {
        id: "v1",
        title: "Auto import of GitHub repos to SonarQube Cloud in action.",
        description: "Auto import of GitHub repos to SonarQube Cloud in action.",
        youtubeId: "BNvEWvFeKEs",
        thumbnail: "/thumbnails/BNvEWvFeKEs.jpg",
        category: "sonarqube-cloud",
        duration: "0:41",
        publishedAt: "2026-03-12"
    },
    {
        id: "v2",
        title: "SonarQube CLI scanning for secrets",
        description: "SonarQube CLI scanning for secrets",
        youtubeId: "3kcshDYJAEg",
        thumbnail: "/thumbnails/3kcshDYJAEg.jpg",
        category: "code-security",
        duration: "3:31",
        publishedAt: "2026-03-12"
    },
    {
        id: "v3",
        title: "Claude Code & SonarQube MCP: Building an autonomous code review workflow",
        description: "Claude Code & SonarQube MCP: Building an autonomous code review workflow",
        youtubeId: "OZLWa6qeO3A",
        thumbnail: "/thumbnails/OZLWa6qeO3A.jpg",
        category: "ai-code-quality",
        duration: "6:19",
        publishedAt: "2026-03-06"
    },
    {
        id: "v4",
        title: "Automate your code analysis: Auto-import GitHub repos in SonarQube Cloud",
        description: "Automate your code analysis: Auto-import GitHub repos in SonarQube Cloud",
        youtubeId: "g-7lMtcj98I",
        thumbnail: "/thumbnails/g-7lMtcj98I.jpg",
        category: "sonarqube-cloud",
        duration: "0:59",
        publishedAt: "2026-03-05"
    },
    {
        id: "v5",
        title: "Sonar Summit 2026 | The self-healing applications decade is here",
        description: "Sonar Summit 2026 | The self-healing applications decade is here",
        youtubeId: "y7RrpkZTml8",
        thumbnail: "/thumbnails/y7RrpkZTml8.jpg",
        category: "sonar-summit",
        duration: "21:50",
        publishedAt: "2026-03-04"
    },
    {
        id: "v6",
        title: "Sonar Summit 2026 | When AI writes code, who owns the bug?",
        description: "Sonar Summit 2026 | When AI writes code, who owns the bug?",
        youtubeId: "wOLAZY6hYQg",
        thumbnail: "/thumbnails/wOLAZY6hYQg.jpg",
        category: "sonar-summit",
        duration: "22:30",
        publishedAt: "2026-03-04"
    },
    {
        id: "v7",
        title: "Sonar Summit 2026 | How Sonar keeps its culture of innovation, experimentation, and accountability",
        description: "Sonar Summit 2026 | How Sonar keeps its culture of innovation, experimentation, and accountability",
        youtubeId: "y1CVkN6aLLE",
        thumbnail: "/thumbnails/y1CVkN6aLLE.jpg",
        category: "sonar-summit",
        duration: "5:45",
        publishedAt: "2026-03-04"
    },
    {
        id: "v8",
        title: "Sonar Summit 2026 | Software Engineering + AI = ?",
        description: "Sonar Summit 2026 | Software Engineering + AI = ?",
        youtubeId: "ubrfeaLEVVA",
        thumbnail: "/thumbnails/ubrfeaLEVVA.jpg",
        category: "sonar-summit",
        duration: "36:51",
        publishedAt: "2026-03-04"
    },
    {
        id: "v9",
        title: "Sonar Summit 2026 | Sonar-powered LLM context augmentation",
        description: "Sonar Summit 2026 | Sonar-powered LLM context augmentation",
        youtubeId: "p4hVlXCD6Lg",
        thumbnail: "/thumbnails/p4hVlXCD6Lg.jpg",
        category: "sonar-summit",
        duration: "14:57",
        publishedAt: "2026-03-04"
    },
    {
        id: "v10",
        title: "Sonar Summit 2026 | The evolved SDLC: How Cisco scales quality for thousands of developers",
        description: "Sonar Summit 2026 | The evolved SDLC: How Cisco scales quality for thousands of developers",
        youtubeId: "ge15fXD2rNQ",
        thumbnail: "/thumbnails/ge15fXD2rNQ.jpg",
        category: "sonar-summit",
        duration: "37:57",
        publishedAt: "2026-03-04"
    },
    {
        id: "v11",
        title: "Sonar Summit 2026 | The quality debt of AI code: What strong engineering teams do differently",
        description: "Sonar Summit 2026 | The quality debt of AI code: What strong engineering teams do differently",
        youtubeId: "aT0wquYXQF8",
        thumbnail: "/thumbnails/aT0wquYXQF8.jpg",
        category: "sonar-summit",
        duration: "21:15",
        publishedAt: "2026-03-04"
    },
    {
        id: "v12",
        title: "AI-Powered Security in GitLab | Sonar Integration Demo | Sonar Summit 2026",
        description: "AI-Powered Security in GitLab | Sonar Integration Demo | Sonar Summit 2026",
        youtubeId: "Y9nPB0FCIe0",
        thumbnail: "/thumbnails/Y9nPB0FCIe0.jpg",
        category: "sonar-summit",
        duration: "25:48",
        publishedAt: "2026-03-04"
    },
    {
        id: "v13",
        title: "Which Code Issues Actually Matter? | Prioritizing SonarQube Findings | Sonar Summit 2026",
        description: "Which Code Issues Actually Matter? | Prioritizing SonarQube Findings | Sonar Summit 2026",
        youtubeId: "nX9ZleJMMyk",
        thumbnail: "/thumbnails/nX9ZleJMMyk.jpg",
        category: "sonar-summit",
        duration: "13:36",
        publishedAt: "2026-03-04"
    },
    {
        id: "v14",
        title: "Streaming Code Quality and Security in Healthcare | Sonar Summit 2026",
        description: "Streaming Code Quality and Security in Healthcare | Sonar Summit 2026",
        youtubeId: "frHiiHAmLuQ",
        thumbnail: "/thumbnails/frHiiHAmLuQ.jpg",
        category: "sonar-summit",
        duration: "22:05",
        publishedAt: "2026-03-04"
    },
    {
        id: "v15",
        title: "Achieving Trusted Code in the Agentic SDLC | Sonar Summit 2026",
        description: "Achieving Trusted Code in the Agentic SDLC | Sonar Summit 2026",
        youtubeId: "UaMzytVdo0o",
        thumbnail: "/thumbnails/UaMzytVdo0o.jpg",
        category: "sonar-summit",
        duration: "18:45",
        publishedAt: "2026-03-04"
    },
    {
        id: "v16",
        title: "Building Guardrails for AI Coding Systems | Sonar Summit 2026",
        description: "Building Guardrails for AI Coding Systems | Sonar Summit 2026",
        youtubeId: "UJjRyCQdPWc",
        thumbnail: "/thumbnails/UJjRyCQdPWc.jpg",
        category: "sonar-summit",
        duration: "34:04",
        publishedAt: "2026-03-04"
    },
    {
        id: "v17",
        title: "Code Security and Verification in the AI-Centric SDLC | Sonar Summit 2026",
        description: "Code Security and Verification in the AI-Centric SDLC | Sonar Summit 2026",
        youtubeId: "TTotAh3yI18",
        thumbnail: "/thumbnails/TTotAh3yI18.jpg",
        category: "sonar-summit",
        duration: "15:33",
        publishedAt: "2026-03-04"
    },
    {
        id: "v18",
        title: "SonarQube Enterprise Architecture | Deploying SonarQube at Scale | Sonar Summit 2026",
        description: "SonarQube Enterprise Architecture | Deploying SonarQube at Scale | Sonar Summit 2026",
        youtubeId: "QevvNlv35PU",
        thumbnail: "/thumbnails/QevvNlv35PU.jpg",
        category: "sonar-summit",
        duration: "15:20",
        publishedAt: "2026-03-04"
    },
    {
        id: "v19",
        title: "The AI Code Review Bottleneck: Escaping the Velocity Trap | Sonar Summit 2026",
        description: "The AI Code Review Bottleneck: Escaping the Velocity Trap | Sonar Summit 2026",
        youtubeId: "5bhZUYW9dTM",
        thumbnail: "/thumbnails/5bhZUYW9dTM.jpg",
        category: "sonar-summit",
        duration: "18:37",
        publishedAt: "2026-03-04"
    },
    {
        id: "v20",
        title: "Why AI Code Passes OWASP but Fails MISRA | Sonar Summit 2026",
        description: "Why AI Code Passes OWASP but Fails MISRA | Sonar Summit 2026",
        youtubeId: "PYazHOcZyXA",
        thumbnail: "/thumbnails/PYazHOcZyXA.jpg",
        category: "sonar-summit",
        duration: "18:41",
        publishedAt: "2026-03-04"
    },
    {
        id: "v21",
        title: "Code Security in the AI Era | SAST, SCA & Secrets Detection | Sonar Summit 2026",
        description: "Code Security in the AI Era | SAST, SCA & Secrets Detection | Sonar Summit 2026",
        youtubeId: "P-y8kBGxO9M",
        thumbnail: "/thumbnails/P-y8kBGxO9M.jpg",
        category: "sonar-summit",
        duration: "22:07",
        publishedAt: "2026-03-04"
    },
    {
        id: "v22",
        title: "Learning in the AI Era | Future of Software Development | Sonar Summit 2026",
        description: "Learning in the AI Era | Future of Software Development | Sonar Summit 2026",
        youtubeId: "LReljR7vfe0",
        thumbnail: "/thumbnails/LReljR7vfe0.jpg",
        category: "sonar-summit",
        duration: "28:51",
        publishedAt: "2026-03-04"
    },
    {
        id: "v23",
        title: "SonarQube MCP Server Demo | Secure AI Coding Workflows | Sonar Summit 2026",
        description: "SonarQube MCP Server Demo | Secure AI Coding Workflows | Sonar Summit 2026",
        youtubeId: "Eq9L4xBthXc",
        thumbnail: "/thumbnails/Eq9L4xBthXc.jpg",
        category: "sonar-summit",
        duration: "15:14",
        publishedAt: "2026-03-04"
    },
    {
        id: "v24",
        title: "The Reality of Developers Using AI | State of Code Research | Sonar Summit 2026",
        description: "The Reality of Developers Using AI | State of Code Research | Sonar Summit 2026",
        youtubeId: "EexnHAruBEA",
        thumbnail: "/thumbnails/EexnHAruBEA.jpg",
        category: "sonar-summit",
        duration: "14:41",
        publishedAt: "2026-03-04"
    },
    {
        id: "v25",
        title: "Software Architecture Management in SonarQube | Sonar Summit 2026",
        description: "Software Architecture Management in SonarQube | Sonar Summit 2026",
        youtubeId: "6mpmaOOYIYo",
        thumbnail: "/thumbnails/6mpmaOOYIYo.jpg",
        category: "sonar-summit",
        duration: "18:01",
        publishedAt: "2026-03-04"
    },
    {
        id: "v26",
        title: "Automating Code Fixes with SonarQube Remediation Agent | Sonar Summit 2026",
        description: "Automating Code Fixes with SonarQube Remediation Agent | Sonar Summit 2026",
        youtubeId: "5_6QTa0BMXE",
        thumbnail: "/thumbnails/5_6QTa0BMXE.jpg",
        category: "sonar-summit",
        duration: "11:59",
        publishedAt: "2026-03-04"
    },
    {
        id: "v27",
        title: "The AI Productivity Paradox in Engineering | Sonar Summit 2026",
        description: "The AI Productivity Paradox in Engineering | Sonar Summit 2026",
        youtubeId: "4DTYuQTguV0",
        thumbnail: "/thumbnails/4DTYuQTguV0.jpg",
        category: "sonar-summit",
        duration: "21:56",
        publishedAt: "2026-03-04"
    },
    {
        id: "v28",
        title: "GitHub Copilot Agents + Sonar | The Blueprint for Agentic Development | Sonar Summit 2026",
        description: "GitHub Copilot Agents + Sonar | The Blueprint for Agentic Development | Sonar Summit 2026",
        youtubeId: "pq8uotTlJd4",
        thumbnail: "/thumbnails/pq8uotTlJd4.jpg",
        category: "sonar-summit",
        duration: "24:14",
        publishedAt: "2026-03-04"
    },
    {
        id: "v29",
        title: "The AI Accountability Mandate: Securing the Software Supply Chain | Sonar Summit 2026",
        description: "The AI Accountability Mandate: Securing the Software Supply Chain | Sonar Summit 2026",
        youtubeId: "zsKjywc0Mjw",
        thumbnail: "/thumbnails/zsKjywc0Mjw.jpg",
        category: "sonar-summit",
        duration: "22:18",
        publishedAt: "2026-03-04"
    },
    {
        id: "v30",
        title: "How TD Bank Scaled Code Quality & Security with SonarQube | Sonar Summit 2026",
        description: "How TD Bank Scaled Code Quality & Security with SonarQube | Sonar Summit 2026",
        youtubeId: "zi-ujR4FxJ0",
        thumbnail: "/thumbnails/zi-ujR4FxJ0.jpg",
        category: "sonar-summit",
        duration: "10:01",
        publishedAt: "2026-03-04"
    },
    {
        id: "v31",
        title: "What's New in SonarQube | Governance and Quality Gates at Scale | Sonar Summit 2026",
        description: "What's New in SonarQube | Governance and Quality Gates at Scale | Sonar Summit 2026",
        youtubeId: "uiFSzDAKsn8",
        thumbnail: "/thumbnails/uiFSzDAKsn8.jpg",
        category: "sonar-summit",
        duration: "15:30",
        publishedAt: "2026-03-04"
    },
    {
        id: "v32",
        title: "Humans + AI: The Future of Software Development Teams | Sonar Summit 2026",
        description: "Humans + AI: The Future of Software Development Teams | Sonar Summit 2026",
        youtubeId: "rtmBZJLmbSg",
        thumbnail: "/thumbnails/rtmBZJLmbSg.jpg",
        category: "sonar-summit",
        duration: "18:08",
        publishedAt: "2026-03-04"
    },
    {
        id: "v33",
        title: "Symbolic Execution Explained: Finding Bugs in Complex Code Paths | Sonar Summit 2026",
        description: "Symbolic Execution Explained: Finding Bugs in Complex Code Paths | Sonar Summit 2026",
        youtubeId: "qoYaBSAsOys",
        thumbnail: "/thumbnails/qoYaBSAsOys.jpg",
        category: "sonar-summit",
        duration: "18:04",
        publishedAt: "2026-03-04"
    },
    {
        id: "v34",
        title: "I'm Not Writing Code Anymore—Now What? | The 7-Step Workflow | Sonar Summit 2026",
        description: "I'm Not Writing Code Anymore—Now What? | The 7-Step Workflow | Sonar Summit 2026",
        youtubeId: "oEXWxZpi-_0",
        thumbnail: "/thumbnails/oEXWxZpi-_0.jpg",
        category: "sonar-summit",
        duration: "26:20",
        publishedAt: "2026-03-04"
    },
    {
        id: "v35",
        title: "Why Software Quality Is the Key to Scaling AI Development | Sonar Summit 2026",
        description: "Why Software Quality Is the Key to Scaling AI Development | Sonar Summit 2026",
        youtubeId: "oAGt7vJeOh4",
        thumbnail: "/thumbnails/oAGt7vJeOh4.jpg",
        category: "sonar-summit",
        duration: "28:20",
        publishedAt: "2026-03-04"
    },
    {
        id: "v36",
        title: "Engineering Intelligence & Developer Productivity in the AI Era | Sonar Summit 2026",
        description: "Engineering Intelligence & Developer Productivity in the AI Era | Sonar Summit 2026",
        youtubeId: "o3_zN4U-1a8",
        thumbnail: "/thumbnails/o3_zN4U-1a8.jpg",
        category: "sonar-summit",
        duration: "15:46",
        publishedAt: "2026-03-04"
    },
    {
        id: "v37",
        title: "Escape the Try-Again Loop: Verifying AI-Generated Code | Sonar Summit 2026",
        description: "Escape the Try-Again Loop: Verifying AI-Generated Code | Sonar Summit 2026",
        youtubeId: "nyfsmd9I-dw",
        thumbnail: "/thumbnails/nyfsmd9I-dw.jpg",
        category: "sonar-summit",
        duration: "32:13",
        publishedAt: "2026-03-04"
    },
    {
        id: "v38",
        title: "How to Verify AI-Generated Code with Codex | Sonar Summit 2026",
        description: "How to Verify AI-Generated Code with Codex | Sonar Summit 2026",
        youtubeId: "m3NFhJTTMdc",
        thumbnail: "/thumbnails/m3NFhJTTMdc.jpg",
        category: "sonar-summit",
        duration: "47:59",
        publishedAt: "2026-03-04"
    },
    {
        id: "v39",
        title: "How to Manage Software Architecture with SonarQube | Sonar Summit 2026",
        description: "How to Manage Software Architecture with SonarQube | Sonar Summit 2026",
        youtubeId: "dk2VBYzBkvs",
        thumbnail: "/thumbnails/dk2VBYzBkvs.jpg",
        category: "sonar-summit",
        duration: "20:15",
        publishedAt: "2026-03-04"
    },
    {
        id: "v40",
        title: "Developing with AI: Balancing Speed and Code Quality | Sonar Summit 2026",
        description: "Developing with AI: Balancing Speed and Code Quality | Sonar Summit 2026",
        youtubeId: "dWwFZ3AHFUU",
        thumbnail: "/thumbnails/dWwFZ3AHFUU.jpg",
        category: "sonar-summit",
        duration: "12:36",
        publishedAt: "2026-03-04"
    },
    {
        id: "v41",
        title: "The LLM Leaderboard: Benchmarking AI Coding Models | Sonar Summit 2026",
        description: "The LLM Leaderboard: Benchmarking AI Coding Models | Sonar Summit 2026",
        youtubeId: "aId-UDaJSXg",
        thumbnail: "/thumbnails/aId-UDaJSXg.jpg",
        category: "sonar-summit",
        duration: "16:28",
        publishedAt: "2026-03-04"
    },
    {
        id: "v42",
        title: "How to Verify AI-Generated Code with AI Coding Agents | Sonar Summit 2026",
        description: "How to Verify AI-Generated Code with AI Coding Agents | Sonar Summit 2026",
        youtubeId: "ZKjTmw4IehE",
        thumbnail: "/thumbnails/ZKjTmw4IehE.jpg",
        category: "sonar-summit",
        duration: "16:00",
        publishedAt: "2026-03-04"
    },
    {
        id: "v43",
        title: "Solving the AI Accountability Crisis in the Software Supply Chain | Sonar Summit 2026",
        description: "Solving the AI Accountability Crisis in the Software Supply Chain | Sonar Summit 2026",
        youtubeId: "YqwHYJjtXcM",
        thumbnail: "/thumbnails/YqwHYJjtXcM.jpg",
        category: "sonar-summit",
        duration: "11:46",
        publishedAt: "2026-03-04"
    },
    {
        id: "v44",
        title: "The Future of Engineering Teams in an AI-Native World | Sonar Summit 2026",
        description: "The Future of Engineering Teams in an AI-Native World | Sonar Summit 2026",
        youtubeId: "Vf5FPseN9e0",
        thumbnail: "/thumbnails/Vf5FPseN9e0.jpg",
        category: "sonar-summit",
        duration: "43:32",
        publishedAt: "2026-03-04"
    },
    {
        id: "v45",
        title: "Advanced SAST: How to Secure AI-Generated Code | Sonar Summit 2026",
        description: "Advanced SAST: How to Secure AI-Generated Code | Sonar Summit 2026",
        youtubeId: "VecMTZMmhEg",
        thumbnail: "/thumbnails/VecMTZMmhEg.jpg",
        category: "sonar-summit",
        duration: "15:42",
        publishedAt: "2026-03-04"
    },
    {
        id: "v46",
        title: "The Context Flywheel for AI Coding Teams | Sonar Summit 2026",
        description: "The Context Flywheel for AI Coding Teams | Sonar Summit 2026",
        youtubeId: "SLKWTGJEjNU",
        thumbnail: "/thumbnails/SLKWTGJEjNU.jpg",
        category: "sonar-summit",
        duration: "37:09",
        publishedAt: "2026-03-04"
    },
    {
        id: "v47",
        title: "Building Better Software: A New Blueprint for the Agentic SDLC | Sonar Summit 2026",
        description: "Building Better Software: A New Blueprint for the Agentic SDLC | Sonar Summit 2026",
        youtubeId: "RFb_BZ-GXiw",
        thumbnail: "/thumbnails/RFb_BZ-GXiw.jpg",
        category: "sonar-summit",
        duration: "22:07",
        publishedAt: "2026-03-04"
    },
    {
        id: "v48",
        title: "How to Secure the AI Stack from Code to Runtime | Sonar Summit 2026",
        description: "How to Secure the AI Stack from Code to Runtime | Sonar Summit 2026",
        youtubeId: "6LyTT4ugtb4",
        thumbnail: "/thumbnails/6LyTT4ugtb4.jpg",
        category: "sonar-summit",
        duration: "24:45",
        publishedAt: "2026-03-04"
    },
    {
        id: "v49",
        title: "SonarQube & Dynatrace Integration: Enrich Security Findings | Sonar Summit 2026",
        description: "SonarQube & Dynatrace Integration: Enrich Security Findings | Sonar Summit 2026",
        youtubeId: "O0yd2bRD4S8",
        thumbnail: "/thumbnails/O0yd2bRD4S8.jpg",
        category: "sonar-summit",
        duration: "14:11",
        publishedAt: "2026-03-04"
    },
    {
        id: "v50",
        title: "Shifting security left: Scaling code quality in a regulated landscape | Sonar Summit 2026",
        description: "Shifting security left: Scaling code quality in a regulated landscape | Sonar Summit 2026",
        youtubeId: "I588Z-fuVw0",
        thumbnail: "/thumbnails/I588Z-fuVw0.jpg",
        category: "sonar-summit",
        duration: "32:38",
        publishedAt: "2026-03-04"
    },
    {
        id: "v51",
        title: "How Freshworks Scales Shift-Left Security with SonarQube | Sonar Summit 2026",
        description: "How Freshworks Scales Shift-Left Security with SonarQube | Sonar Summit 2026",
        youtubeId: "Ejn7yaFYHUA",
        thumbnail: "/thumbnails/Ejn7yaFYHUA.jpg",
        category: "sonar-summit",
        duration: "22:13",
        publishedAt: "2026-03-04"
    },
    {
        id: "v52",
        title: "How to Scale AI Coding for Real Business Outcomes | Jellyfish Use Case | Sonar Summit 2026",
        description: "How to Scale AI Coding for Real Business Outcomes | Jellyfish Use Case | Sonar Summit 2026",
        youtubeId: "9Lsi5vEzTb0",
        thumbnail: "/thumbnails/9Lsi5vEzTb0.jpg",
        category: "sonar-summit",
        duration: "27:07",
        publishedAt: "2026-03-04"
    },
    {
        id: "v53",
        title: "How to Improve AI-Generated Code with SonarSweep | Sonar Summit 2026",
        description: "How to Improve AI-Generated Code with SonarSweep | Sonar Summit 2026",
        youtubeId: "-u2uSqxiB4Q",
        thumbnail: "/thumbnails/-u2uSqxiB4Q.jpg",
        category: "sonar-summit",
        duration: "13:27",
        publishedAt: "2026-03-04"
    },
    {
        id: "v54",
        title: "Scaling Software Integrity with Automated Code Verification | Sonar Summit 2026",
        description: "Scaling Software Integrity with Automated Code Verification | Sonar Summit 2026",
        youtubeId: "ONcLyOlK2lE",
        thumbnail: "/thumbnails/ONcLyOlK2lE.jpg",
        category: "sonar-summit",
        duration: "26:40",
        publishedAt: "2026-03-04"
    },
    {
        id: "v55",
        title: "Scaling Software Quality at Xero with SonarQube Cloud | Sonar Summit 2026",
        description: "Scaling Software Quality at Xero with SonarQube Cloud | Sonar Summit 2026",
        youtubeId: "Mc05XFKewWM",
        thumbnail: "/thumbnails/Mc05XFKewWM.jpg",
        category: "sonar-summit",
        duration: "16:00",
        publishedAt: "2026-03-04"
    },
    {
        id: "v56",
        title: "Automated Code Review for AI Agents | Sonar Summit 2026",
        description: "Automated Code Review for AI Agents | Sonar Summit 2026",
        youtubeId: "B2oLNixFoo8",
        thumbnail: "/thumbnails/B2oLNixFoo8.jpg",
        category: "sonar-summit",
        duration: "11:22",
        publishedAt: "2026-03-04"
    },
    {
        id: "v57",
        title: "Building the Trust Layer for the Agentic Era | Sonar Summit 2026",
        description: "Building the Trust Layer for the Agentic Era | Sonar Summit 2026",
        youtubeId: "ARpFNp96jN4",
        thumbnail: "/thumbnails/ARpFNp96jN4.jpg",
        category: "sonar-summit",
        duration: "20:53",
        publishedAt: "2026-03-04"
    },
    {
        id: "v58",
        title: "SonarQube Notification Bell Demo | New Feature in 2026.1 LTA",
        description: "SonarQube Notification Bell Demo | New Feature in 2026.1 LTA",
        youtubeId: "uCVs_jJMtW4",
        thumbnail: "/thumbnails/uCVs_jJMtW4.jpg",
        category: "product-updates",
        duration: "0:50",
        publishedAt: "2026-02-20"
    },
    {
        id: "v59",
        title: "SonarQube Server Slack Integration Demo",
        description: "SonarQube Server Slack Integration Demo",
        youtubeId: "ofBkv-jH33I",
        thumbnail: "/thumbnails/ofBkv-jH33I.jpg",
        category: "devops-cicd",
        duration: "1:57",
        publishedAt: "2026-02-20"
    },
    {
        id: "v60",
        title: "SonarQube Issue Sandbox Explained | SonarQube Server 2026.1 LTA Demo",
        description: "SonarQube Issue Sandbox Explained | SonarQube Server 2026.1 LTA Demo",
        youtubeId: "3ghmJPBVBgU",
        thumbnail: "/thumbnails/3ghmJPBVBgU.jpg",
        category: "product-updates",
        duration: "2:03",
        publishedAt: "2026-02-20"
    },
    {
        id: "v61",
        title: "How to Integrate SonarQube Server with Cursor (MCP Server Demo)",
        description: "How to Integrate SonarQube Server with Cursor (MCP Server Demo)",
        youtubeId: "ZQ3rZFDLibc",
        thumbnail: "/thumbnails/ZQ3rZFDLibc.jpg",
        category: "ai-code-quality",
        duration: "4:15",
        publishedAt: "2026-02-20"
    },
    {
        id: "v62",
        title: "How to enable architecture in SonarQube Cloud",
        description: "How to enable architecture in SonarQube Cloud",
        youtubeId: "4_60LxvWow4",
        thumbnail: "/thumbnails/4_60LxvWow4.jpg",
        category: "sonarqube-cloud",
        duration: "0:36",
        publishedAt: "2026-02-20"
    },
    {
        id: "v63",
        title: "Inside the latest SonarQube Server 2026 1 LTA release our most significant ever",
        description: "Inside the latest SonarQube Server 2026 1 LTA release our most significant ever",
        youtubeId: "RvJjXARvtxs",
        thumbnail: "/thumbnails/RvJjXARvtxs.jpg",
        category: "product-updates",
        duration: "47:18",
        publishedAt: "2026-02-20"
    },
    {
        id: "v64",
        title: "Ace your SonarQube version update 2026.1 LTA",
        description: "Ace your SonarQube version update 2026.1 LTA",
        youtubeId: "7_ZWlTmpjeM",
        thumbnail: "/thumbnails/7_ZWlTmpjeM.jpg",
        category: "product-updates",
        duration: "12:54",
        publishedAt: "2026-02-13"
    },
    {
        id: "v65",
        title: "Introducing SonarQube MCP Server: Bring code quality & security into your AI workflow",
        description: "Introducing SonarQube MCP Server: Bring code quality & security into your AI workflow",
        youtubeId: "ZoayHEiXrZY",
        thumbnail: "/thumbnails/ZoayHEiXrZY.jpg",
        category: "ai-code-quality",
        duration: "39:15",
        publishedAt: "2026-02-13"
    },
    {
        id: "v66",
        title: "A qualitative analysis of six leading LLMs",
        description: "A qualitative analysis of six leading LLMs",
        youtubeId: "3eHXBgaDs60",
        thumbnail: "/thumbnails/3eHXBgaDs60.jpg",
        category: "ai-code-quality",
        duration: "25:24",
        publishedAt: "2026-02-13"
    },
    {
        id: "v67",
        title: "Seven habits of highly effective AI coding",
        description: "Seven habits of highly effective AI coding",
        youtubeId: "F1F_CVD33WI",
        thumbnail: "/thumbnails/F1F_CVD33WI.jpg",
        category: "ai-code-quality",
        duration: "45:10",
        publishedAt: "2026-02-13"
    },
    {
        id: "v68",
        title: "How to import Audit Logs from SonarQube Cloud to Splunk SIEM",
        description: "How to import Audit Logs from SonarQube Cloud to Splunk SIEM",
        youtubeId: "_-oYSf8qoUY",
        thumbnail: "/thumbnails/_-oYSf8qoUY.jpg",
        category: "sonarqube-cloud",
        duration: "7:24",
        publishedAt: "2026-01-13"
    },
    {
        id: "v69",
        title: "Setting up SonarQube with GitHub in 60 seconds",
        description: "Setting up SonarQube with GitHub in 60 seconds",
        youtubeId: "K1zaFcmkARo",
        thumbnail: "/thumbnails/K1zaFcmkARo.jpg",
        category: "devops-cicd",
        duration: "0:59",
        publishedAt: "2026-01-13"
    },
    {
        id: "v70",
        title: "What's hiding in your code? Uncovering the state of code security",
        description: "What's hiding in your code? Uncovering the state of code security",
        youtubeId: "dsX7WOqBtIY",
        thumbnail: "/thumbnails/dsX7WOqBtIY.jpg",
        category: "code-security",
        duration: "48:47",
        publishedAt: "2026-01-13"
    },
    {
        id: "v71",
        title: "How to set up SonarQube MCP Server in Cursor (1-Click install)",
        description: "How to set up SonarQube MCP Server in Cursor (1-Click install)",
        youtubeId: "02_eh48rp6I",
        thumbnail: "/thumbnails/02_eh48rp6I.jpg",
        category: "ai-code-quality",
        duration: "1:52",
        publishedAt: "2025-12-13"
    },
    {
        id: "v72",
        title: "From detection to resolution: Introducing AI CodeFix GA",
        description: "From detection to resolution: Introducing AI CodeFix GA",
        youtubeId: "fJ_wu5ruzBk",
        thumbnail: "/thumbnails/fJ_wu5ruzBk.jpg",
        category: "ai-code-quality",
        duration: "50:16",
        publishedAt: "2025-12-13"
    },
    {
        id: "v73",
        title: "How to build custom project dashboards in SonarQube Cloud Enterprise",
        description: "How to build custom project dashboards in SonarQube Cloud Enterprise",
        youtubeId: "82mGJaYaNpQ",
        thumbnail: "/thumbnails/82mGJaYaNpQ.jpg",
        category: "sonarqube-cloud",
        duration: "3:56",
        publishedAt: "2025-12-13"
    },
    {
        id: "v74",
        title: "New SonarQube security report for Visual Studio: Find & manage security risks in your IDE",
        description: "New SonarQube security report for Visual Studio: Find & manage security risks in your IDE",
        youtubeId: "8DYgtTsS1uM",
        thumbnail: "/thumbnails/8DYgtTsS1uM.jpg",
        category: "sonarqube-for-ide",
        duration: "2:33",
        publishedAt: "2025-11-13"
    },
    {
        id: "v75",
        title: "Introducing Sonar: Developer & AI Code Verification",
        description: "Introducing Sonar: Developer & AI Code Verification",
        youtubeId: "5zC1UeUMIgM",
        thumbnail: "/thumbnails/5zC1UeUMIgM.jpg",
        category: "ai-code-quality",
        duration: "1:16",
        publishedAt: "2025-11-13"
    },
    {
        id: "v76",
        title: "The $2.41 trillion problem: unpacking the state of code reliability",
        description: "The $2.41 trillion problem: unpacking the state of code reliability",
        youtubeId: "47zj4x0hp0c",
        thumbnail: "/thumbnails/47zj4x0hp0c.jpg",
        category: "clean-code",
        duration: "40:51",
        publishedAt: "2025-11-13"
    },
    {
        id: "v77",
        title: "How to manage dependency risks in your IDE with SonarQube",
        description: "How to manage dependency risks in your IDE with SonarQube",
        youtubeId: "PsdkS6p9M88",
        thumbnail: "/thumbnails/PsdkS6p9M88.jpg",
        category: "sonarqube-for-ide",
        duration: "1:41",
        publishedAt: "2025-11-13"
    },
    {
        id: "v78",
        title: "Key Updates in SonarQube Server 2025.5 Release",
        description: "Key Updates in SonarQube Server 2025.5 Release",
        youtubeId: "JRiF-w-3Cog",
        thumbnail: "/thumbnails/JRiF-w-3Cog.jpg",
        category: "product-updates",
        duration: "8:40",
        publishedAt: "2025-11-13"
    },
    {
        id: "v79",
        title: "Integrate Cursor & SonarQube MCP Server",
        description: "Integrate Cursor & SonarQube MCP Server",
        youtubeId: "RO5c-g6aOY4",
        thumbnail: "/thumbnails/RO5c-g6aOY4.jpg",
        category: "ai-code-quality",
        duration: "2:56",
        publishedAt: "2025-10-13"
    },
    {
        id: "v80",
        title: "How to Integrate SonarQube Cloud with Slack | Step-by-Step Guide (2025)",
        description: "How to Integrate SonarQube Cloud with Slack | Step-by-Step Guide (2025)",
        youtubeId: "oW-pp4LN9r0",
        thumbnail: "/thumbnails/oW-pp4LN9r0.jpg",
        category: "sonarqube-cloud",
        duration: "1:48",
        publishedAt: "2025-10-13"
    },
    {
        id: "v81",
        title: "Integrate Windsurf & SonarQube MCP Server",
        description: "Integrate Windsurf & SonarQube MCP Server",
        youtubeId: "bJoXEkwlBLc",
        thumbnail: "/thumbnails/bJoXEkwlBLc.jpg",
        category: "ai-code-quality",
        duration: "4:00",
        publishedAt: "2025-10-13"
    },
    {
        id: "v82",
        title: "Integrate Gemini CLI & SonarQube MCP Server",
        description: "Integrate Gemini CLI & SonarQube MCP Server",
        youtubeId: "7-Ou_Umc-84",
        thumbnail: "/thumbnails/7-Ou_Umc-84.jpg",
        category: "ai-code-quality",
        duration: "1:02",
        publishedAt: "2025-10-13"
    },
    {
        id: "v83",
        title: "SonarQube Advanced Security: A Developer-first approach to code quality and security",
        description: "SonarQube Advanced Security: A Developer-first approach to code quality and security",
        youtubeId: "4tYqKRTtVnA",
        thumbnail: "/thumbnails/4tYqKRTtVnA.jpg",
        category: "code-security",
        duration: "57:06",
        publishedAt: "2025-10-13"
    },
    {
        id: "v84",
        title: "SonarQube Advanced Security now available for SonarQube Cloud Enterprise",
        description: "SonarQube Advanced Security now available for SonarQube Cloud Enterprise",
        youtubeId: "pBEwoZNJOw4",
        thumbnail: "/thumbnails/pBEwoZNJOw4.jpg",
        category: "sonarqube-cloud",
        duration: "3:42",
        publishedAt: "2025-10-13"
    },
    {
        id: "v85",
        title: "SonarQube Advanced Security now available for SonarQube Cloud Enterprise",
        description: "SonarQube Advanced Security now available for SonarQube Cloud Enterprise",
        youtubeId: "Ublfbijaqw4",
        thumbnail: "/thumbnails/Ublfbijaqw4.jpg",
        category: "sonarqube-cloud",
        duration: "6:29",
        publishedAt: "2025-10-13"
    },
    {
        id: "v86",
        title: "Delivering High Quality and Secure AI Code with SonarQube",
        description: "Delivering High Quality and Secure AI Code with SonarQube",
        youtubeId: "RimDtdq1SMY",
        thumbnail: "/thumbnails/RimDtdq1SMY.jpg",
        category: "ai-code-quality",
        duration: "58:46",
        publishedAt: "2025-09-13"
    },
    {
        id: "v87",
        title: "Maintain excellence in code health with AI Code Assurance",
        description: "Maintain excellence in code health with AI Code Assurance",
        youtubeId: "fsxoyJYo4UE",
        thumbnail: "/thumbnails/fsxoyJYo4UE.jpg",
        category: "ai-code-quality",
        duration: "40:20",
        publishedAt: "2025-07-13"
    },
    {
        id: "v88",
        title: "Code Coverage: Your secret weapon for code reliability and developer productivity",
        description: "Code Coverage: Your secret weapon for code reliability and developer productivity",
        youtubeId: "Dr-NHyBBZwY",
        thumbnail: "/thumbnails/Dr-NHyBBZwY.jpg",
        category: "code-security",
        duration: "1:02:41",
        publishedAt: "2025-07-13"
    },
    {
        id: "v89",
        title: "Build better, faster: Supercharge your developers in 2025",
        description: "Build better, faster: Supercharge your developers in 2025",
        youtubeId: "vGfM3FInXTQ",
        thumbnail: "/thumbnails/vGfM3FInXTQ.jpg",
        category: "clean-code",
        duration: "58:37",
        publishedAt: "2025-06-13"
    },
    {
        id: "v90",
        title: "Transforming Code Quality & Code Security with SonarQube Server - The Wolters Kluwer Story",
        description: "Transforming Code Quality & Code Security with SonarQube Server - The Wolters Kluwer Story",
        youtubeId: "kZzQkq0pXSc",
        thumbnail: "/thumbnails/kZzQkq0pXSc.jpg",
        category: "code-security",
        duration: "41:44",
        publishedAt: "2025-05-13"
    },
    {
        id: "v91",
        title: "Discover the new Enterprise features for SonarCloud",
        description: "Discover the new Enterprise features for SonarCloud",
        youtubeId: "WEYhvmoLK3g",
        thumbnail: "/thumbnails/WEYhvmoLK3g.jpg",
        category: "sonarqube-cloud",
        duration: "34:06",
        publishedAt: "2025-03-13"
    },
    {
        id: "v92",
        title: "SonarQube | Same powerful features, new unified brand experience",
        description: "SonarQube | Same powerful features, new unified brand experience",
        youtubeId: "rdmYgr2Z_io",
        thumbnail: "/thumbnails/rdmYgr2Z_io.jpg",
        category: "product-updates",
        duration: "0:19",
        publishedAt: "2025-03-13"
    },
    {
        id: "v93",
        title: "End-to-end security in a web application",
        description: "End-to-end security in a web application",
        youtubeId: "6cdV-oN_Yao",
        thumbnail: "/thumbnails/6cdV-oN_Yao.jpg",
        category: "code-security",
        duration: "46:02",
        publishedAt: "2025-03-13"
    },
    {
        id: "v94",
        title: "SonarQube Tutorial: Everything you need to know for beginners",
        description: "SonarQube Tutorial: Everything you need to know for beginners",
        youtubeId: "GRVA4AiO7OM",
        thumbnail: "/thumbnails/GRVA4AiO7OM.jpg",
        category: "getting-started",
        duration: "42:47",
        publishedAt: "2025-03-13"
    },
    {
        id: "v95",
        title: "Secure in Design: How Implementing Good Quality Methodology Delivers Better Software Security",
        description: "Secure in Design: How Implementing Good Quality Methodology Delivers Better Software Security",
        youtubeId: "8sUrGwlffv0",
        thumbnail: "/thumbnails/8sUrGwlffv0.jpg",
        category: "code-security",
        duration: "53:10",
        publishedAt: "2025-03-13"
    },
    {
        id: "v96",
        title: "Basic HTTP Authentication Risk: Uncovering pyspider Vulnerabilities",
        description: "Basic HTTP Authentication Risk: Uncovering pyspider Vulnerabilities",
        youtubeId: "HTzmTucyHmQ",
        thumbnail: "/thumbnails/HTzmTucyHmQ.jpg",
        category: "code-security",
        duration: "0:57",
        publishedAt: "2025-03-13"
    },
    {
        id: "v97",
        title: "From Community to Commercial: Why Upgrade to SonarQube Enterprise Edition",
        description: "From Community to Commercial: Why Upgrade to SonarQube Enterprise Edition",
        youtubeId: "6qUxCKCtJ1M",
        thumbnail: "/thumbnails/6qUxCKCtJ1M.jpg",
        category: "architecture-governance",
        duration: "46:07",
        publishedAt: "2025-03-13"
    },
    {
        id: "v98",
        title: "Clean as You Code: A Proactive Approach to Technical Debt",
        description: "Clean as You Code: A Proactive Approach to Technical Debt",
        youtubeId: "t87V5bxUHRM",
        thumbnail: "/thumbnails/t87V5bxUHRM.jpg",
        category: "clean-code",
        duration: "43:11",
        publishedAt: "2025-03-13"
    },
    {
        id: "v99",
        title: "AutoConfig: C++ Code Analysis Redefined with SonarQube | #CleanCodeTips",
        description: "AutoConfig: C++ Code Analysis Redefined with SonarQube | #CleanCodeTips",
        youtubeId: "k2xUyPcBxag",
        thumbnail: "/thumbnails/k2xUyPcBxag.jpg",
        category: "clean-code",
        duration: "4:06",
        publishedAt: "2025-03-13"
    },
    {
        id: "v100",
        title: "Enhancing the Security and Quality of Copilot-Generated Code using Sonar | #CleanCodeTips",
        description: "Enhancing the Security and Quality of Copilot-Generated Code using Sonar | #CleanCodeTips",
        youtubeId: "_ua8Iz1RmV8",
        thumbnail: "/thumbnails/_ua8Iz1RmV8.jpg",
        category: "ai-code-quality",
        duration: "11:09",
        publishedAt: "2025-03-13"
    },
    {
        id: "v101",
        title: "Driving DevOps Transformation: Leveling Up CI/CD with Static Code Analysis",
        description: "Driving DevOps Transformation: Leveling Up CI/CD with Static Code Analysis",
        youtubeId: "_mZ1kcKfO0o",
        thumbnail: "/thumbnails/_mZ1kcKfO0o.jpg",
        category: "devops-cicd",
        duration: "46:48",
        publishedAt: "2025-03-13"
    },
    {
        id: "v102",
        title: "SonarCloud Enterprise Plan: Key Features",
        description: "SonarCloud Enterprise Plan: Key Features",
        youtubeId: "7neGGobzQJE",
        thumbnail: "/thumbnails/7neGGobzQJE.jpg",
        category: "sonarqube-cloud",
        duration: "2:10",
        publishedAt: "2025-03-13"
    },
    {
        id: "v103",
        title: "What is SonarCloud?",
        description: "What is SonarCloud?",
        youtubeId: "3R2stYMh-fk",
        thumbnail: "/thumbnails/3R2stYMh-fk.jpg",
        category: "sonarqube-cloud",
        duration: "0:57",
        publishedAt: "2025-03-13"
    },
    {
        id: "v104",
        title: "SonarQube Enterprise for Federal Agencies",
        description: "SonarQube Enterprise for Federal Agencies",
        youtubeId: "DIx-xlNd3rU",
        thumbnail: "/thumbnails/DIx-xlNd3rU.jpg",
        category: "architecture-governance",
        duration: "2:21",
        publishedAt: "2025-03-13"
    },
    {
        id: "v105",
        title: "Code Faster, Write Cleaner using AI Coding Assistants and Sonar",
        description: "Code Faster, Write Cleaner using AI Coding Assistants and Sonar",
        youtubeId: "mHx4fIpJ4f8",
        thumbnail: "/thumbnails/mHx4fIpJ4f8.jpg",
        category: "ai-code-quality",
        duration: "53:54",
        publishedAt: "2025-03-13"
    },
    {
        id: "v106",
        title: "Conquering Complexity: Refactoring JavaScript projects",
        description: "Conquering Complexity: Refactoring JavaScript projects",
        youtubeId: "4nZaynCJS58",
        thumbnail: "/thumbnails/4nZaynCJS58.jpg",
        category: "clean-code",
        duration: "40:52",
        publishedAt: "2025-03-13"
    },
    {
        id: "v107",
        title: "Re-moo-te Code Execution in Mailcow: Always Sanitize Error Messages",
        description: "Re-moo-te Code Execution in Mailcow: Always Sanitize Error Messages",
        youtubeId: "Fb7dK6OZ0eI",
        thumbnail: "/thumbnails/Fb7dK6OZ0eI.jpg",
        category: "code-security",
        duration: "0:42",
        publishedAt: "2025-03-13"
    },
    {
        id: "v108",
        title: "With great AI power comes great responsibility | MS Build 2024",
        description: "With great AI power comes great responsibility | MS Build 2024",
        youtubeId: "4Ya5K95pmKQ",
        thumbnail: "/thumbnails/4Ya5K95pmKQ.jpg",
        category: "ai-code-quality",
        duration: "6:23",
        publishedAt: "2025-03-13"
    },
    {
        id: "v109",
        title: "Clean Code is the Base for a Well-functioning Dev Team | Sonar at QCon London 2024",
        description: "Clean Code is the Base for a Well-functioning Dev Team | Sonar at QCon London 2024",
        youtubeId: "TUc77cOs9S0",
        thumbnail: "/thumbnails/TUc77cOs9S0.jpg",
        category: "clean-code",
        duration: "54:03",
        publishedAt: "2025-03-13"
    },
    {
        id: "v110",
        title: "SonarQube Enterprise Aggregate Reporting with Portfolios | #CleanCodeTips",
        description: "SonarQube Enterprise Aggregate Reporting with Portfolios | #CleanCodeTips",
        youtubeId: "9an_qhGX1RQ",
        thumbnail: "/thumbnails/9an_qhGX1RQ.jpg",
        category: "architecture-governance",
        duration: "5:49",
        publishedAt: "2025-03-13"
    },
    {
        id: "v111",
        title: "Achieve Clean Blazor Code with SonarQube and SonarCloud",
        description: "Achieve Clean Blazor Code with SonarQube and SonarCloud",
        youtubeId: "_8L1jTr1CFM",
        thumbnail: "/thumbnails/_8L1jTr1CFM.jpg",
        category: "sonarqube-cloud",
        duration: "53:56",
        publishedAt: "2025-03-13"
    },
    {
        id: "v112",
        title: "Reality Check: Who determines what Clean Code is anyway?",
        description: "Reality Check: Who determines what Clean Code is anyway?",
        youtubeId: "YZ8oVV-7_M4",
        thumbnail: "/thumbnails/YZ8oVV-7_M4.jpg",
        category: "clean-code",
        duration: "47:35",
        publishedAt: "2025-03-13"
    },
    {
        id: "v113",
        title: "A Short Introduction to Django Ninja | Sonar Clean Code Tips",
        description: "A Short Introduction to Django Ninja | Sonar Clean Code Tips",
        youtubeId: "RTJIwz84o74",
        thumbnail: "/thumbnails/RTJIwz84o74.jpg",
        category: "clean-code",
        duration: "7:30",
        publishedAt: "2025-03-13"
    },
    {
        id: "v114",
        title: "Sonar Customer Stories | Axoft (Tango Software)",
        description: "Sonar Customer Stories | Axoft (Tango Software)",
        youtubeId: "sNMafad0dQA",
        thumbnail: "/thumbnails/sNMafad0dQA.jpg",
        category: "customer-stories",
        duration: "3:56",
        publishedAt: "2025-03-13"
    },
    {
        id: "v115",
        title: "Apache Dubbo Consumer Risks: The Road Not Taken",
        description: "Apache Dubbo Consumer Risks: The Road Not Taken",
        youtubeId: "skaky-lI8a8",
        thumbnail: "/thumbnails/skaky-lI8a8.jpg",
        category: "code-security",
        duration: "1:38",
        publishedAt: "2025-03-13"
    },
    {
        id: "v116",
        title: "Clean Code with GitHub Copilot and Sonar | #CleanCodeTips",
        description: "Clean Code with GitHub Copilot and Sonar | #CleanCodeTips",
        youtubeId: "qkyD7-Y6AYs",
        thumbnail: "/thumbnails/qkyD7-Y6AYs.jpg",
        category: "ai-code-quality",
        duration: "13:04",
        publishedAt: "2025-03-13"
    },
    {
        id: "v117",
        title: "Sonar Clean Code Tips: 5 Flask Issues to Avoid | Python",
        description: "Sonar Clean Code Tips: 5 Flask Issues to Avoid | Python",
        youtubeId: "cNGEB9V7aaQ",
        thumbnail: "/thumbnails/cNGEB9V7aaQ.jpg",
        category: "clean-code",
        duration: "4:46",
        publishedAt: "2025-03-13"
    },
    {
        id: "v118",
        title: "Sonar Clean Code Tips: Understanding Python's New JIT Compiler",
        description: "Sonar Clean Code Tips: Understanding Python's New JIT Compiler",
        youtubeId: "xtLVCy0o28Q",
        thumbnail: "/thumbnails/xtLVCy0o28Q.jpg",
        category: "clean-code",
        duration: "6:09",
        publishedAt: "2024-03-13"
    },
    {
        id: "v119",
        title: "Reply to Calc: the Attack Chain to Compromise Mailspring",
        description: "Reply to Calc: the Attack Chain to Compromise Mailspring",
        youtubeId: "rbeHR2Tq3dM",
        thumbnail: "/thumbnails/rbeHR2Tq3dM.jpg",
        category: "code-security",
        duration: "2:10",
        publishedAt: "2024-03-13"
    },
    {
        id: "v120",
        title: "Integrating Sonar Clean Code Practices in AWS CI/CD Workflows",
        description: "Integrating Sonar Clean Code Practices in AWS CI/CD Workflows",
        youtubeId: "Hgb8ubDwGic",
        thumbnail: "/thumbnails/Hgb8ubDwGic.jpg",
        category: "devops-cicd",
        duration: "59:20",
        publishedAt: "2024-03-13"
    },
    {
        id: "v121",
        title: "SonarLint for Eclipse Overview | a free and open source IDE extension",
        description: "SonarLint for Eclipse Overview | a free and open source IDE extension",
        youtubeId: "DJkNl6Q5I5A",
        thumbnail: "/thumbnails/DJkNl6Q5I5A.jpg",
        category: "sonarqube-for-ide",
        duration: "9:23",
        publishedAt: "2024-03-13"
    },
    {
        id: "v122",
        title: "Securing with Clean Code: Unveiling and Mitigating Vulnerabilities",
        description: "Securing with Clean Code: Unveiling and Mitigating Vulnerabilities",
        youtubeId: "nAlhq6npw_4",
        thumbnail: "/thumbnails/nAlhq6npw_4.jpg",
        category: "code-security",
        duration: "46:34",
        publishedAt: "2024-03-13"
    },
    {
        id: "v123",
        title: "Discover what's new in MISRA C++ 2023, with Andreas Weis",
        description: "Discover what's new in MISRA C++ 2023, with Andreas Weis",
        youtubeId: "doEikRO9GF8",
        thumbnail: "/thumbnails/doEikRO9GF8.jpg",
        category: "code-security",
        duration: "44:24",
        publishedAt: "2024-03-13"
    },
    {
        id: "v124",
        title: "OpenNMS Vulnerabilities: Securing Code against Attacker's Unexpected Ways",
        description: "OpenNMS Vulnerabilities: Securing Code against Attacker's Unexpected Ways",
        youtubeId: "mjsD4dEYePI",
        thumbnail: "/thumbnails/mjsD4dEYePI.jpg",
        category: "code-security",
        duration: "1:06",
        publishedAt: "2024-03-13"
    },
    {
        id: "v125",
        title: "Clean as You Code: No pain lots to gain",
        description: "Clean as You Code: No pain lots to gain",
        youtubeId: "uWmYvq2SoZU",
        thumbnail: "/thumbnails/uWmYvq2SoZU.jpg",
        category: "clean-code",
        duration: "43:34",
        publishedAt: "2024-03-13"
    },
    {
        id: "v126",
        title: "Joomla: Multiple XSS Vulnerabilities, detected with SonarCloud",
        description: "Joomla: Multiple XSS Vulnerabilities, detected with SonarCloud",
        youtubeId: "4HmGMSWry_c",
        thumbnail: "/thumbnails/4HmGMSWry_c.jpg",
        category: "sonarqube-cloud",
        duration: "2:34",
        publishedAt: "2024-03-13"
    },
    {
        id: "v127",
        title: "How SonarQube and SonarLint combine to help review and fix coding issues | #CleanCodeTips",
        description: "How SonarQube and SonarLint combine to help review and fix coding issues | #CleanCodeTips",
        youtubeId: "PIWh-ro9Y2g",
        thumbnail: "/thumbnails/PIWh-ro9Y2g.jpg",
        category: "sonarqube-for-ide",
        duration: "1:11",
        publishedAt: "2024-03-13"
    },
    {
        id: "v128",
        title: "Clean Code in Java: a story of monsters, heroes and victories",
        description: "Clean Code in Java: a story of monsters, heroes and victories",
        youtubeId: "bBHKuKr-E7Q",
        thumbnail: "/thumbnails/bBHKuKr-E7Q.jpg",
        category: "clean-code",
        duration: "50:04",
        publishedAt: "2024-03-13"
    },
    {
        id: "v129",
        title: "Excessive Expansion: Uncovering Critical Security Vulnerabilities in Jenkins",
        description: "Excessive Expansion: Uncovering Critical Security Vulnerabilities in Jenkins",
        youtubeId: "ucs-XF5X3bE",
        thumbnail: "/thumbnails/ucs-XF5X3bE.jpg",
        category: "code-security",
        duration: "1:16",
        publishedAt: "2024-03-13"
    },
    {
        id: "v130",
        title: "15 Years of Clean Code with SonarQube | UI Timelapse",
        description: "15 Years of Clean Code with SonarQube | UI Timelapse",
        youtubeId: "wSjvKtdIuTQ",
        thumbnail: "/thumbnails/wSjvKtdIuTQ.jpg",
        category: "clean-code",
        duration: "0:36",
        publishedAt: "2024-03-13"
    },
    {
        id: "v131",
        title: "SonarQube Enterprise Solution Demo",
        description: "SonarQube Enterprise Solution Demo",
        youtubeId: "M86f__ZYIKQ",
        thumbnail: "/thumbnails/M86f__ZYIKQ.jpg",
        category: "architecture-governance",
        duration: "10:33",
        publishedAt: "2024-03-13"
    },
    {
        id: "v132",
        title: "Clean Code Principles and Practices Part II : Mastering Clean Code",
        description: "Clean Code Principles and Practices Part II : Mastering Clean Code",
        youtubeId: "g7OlG7VFfzg",
        thumbnail: "/thumbnails/g7OlG7VFfzg.jpg",
        category: "clean-code",
        duration: "39:21",
        publishedAt: "2024-03-13"
    },
    {
        id: "v133",
        title: "Python 3.12 and F-Strings | Sonar Developer Tips",
        description: "Python 3.12 and F-Strings | Sonar Developer Tips",
        youtubeId: "WfhYL51qlKk",
        thumbnail: "/thumbnails/WfhYL51qlKk.jpg",
        category: "clean-code",
        duration: "3:51",
        publishedAt: "2024-03-13"
    },
    {
        id: "v134",
        title: "Sonar Customer Stories | RR Mechatronics",
        description: "Sonar Customer Stories | RR Mechatronics",
        youtubeId: "Zg7dmYRlylk",
        thumbnail: "/thumbnails/Zg7dmYRlylk.jpg",
        category: "customer-stories",
        duration: "2:19",
        publishedAt: "2024-03-13"
    },
    {
        id: "v135",
        title: "pfSense Security Vulnerabilities: Discovery & Demonstration on test Instance with SonarCloud",
        description: "pfSense Security Vulnerabilities: Discovery & Demonstration on test Instance with SonarCloud",
        youtubeId: "w0WIqSlUlNY",
        thumbnail: "/thumbnails/w0WIqSlUlNY.jpg",
        category: "sonarqube-cloud",
        duration: "1:03",
        publishedAt: "2024-03-13"
    },
    {
        id: "v136",
        title: "Sonar Customer Stories | Vodafone",
        description: "Sonar Customer Stories | Vodafone",
        youtubeId: "5qH6BIbZ48k",
        thumbnail: "/thumbnails/5qH6BIbZ48k.jpg",
        category: "customer-stories",
        duration: "1:10",
        publishedAt: "2024-03-13"
    },
    {
        id: "v137",
        title: "Sonar Success: Fireside chat with DATEV",
        description: "Sonar Success: Fireside chat with DATEV",
        youtubeId: "g6BqDORtdkE",
        thumbnail: "/thumbnails/g6BqDORtdkE.jpg",
        category: "customer-stories",
        duration: "33:52",
        publishedAt: "2024-03-13"
    },
    {
        id: "v138",
        title: "Upgrading Your SonarQube",
        description: "Upgrading Your SonarQube",
        youtubeId: "Z3vkBQRN1qU",
        thumbnail: "/thumbnails/Z3vkBQRN1qU.jpg",
        category: "getting-started",
        duration: "7:52",
        publishedAt: "2024-03-13"
    },
    {
        id: "v139",
        title: "SonarLint for Visual Studio Overview | a free and open source IDE extension",
        description: "SonarLint for Visual Studio Overview | a free and open source IDE extension",
        youtubeId: "nASTGaxYXOo",
        thumbnail: "/thumbnails/nASTGaxYXOo.jpg",
        category: "sonarqube-for-ide",
        duration: "4:02",
        publishedAt: "2024-03-13"
    },
    {
        id: "v140",
        title: "Key Features of SonarQube 10.3",
        description: "Key Features of SonarQube 10.3",
        youtubeId: "E4fbARDFwZI",
        thumbnail: "/thumbnails/E4fbARDFwZI.jpg",
        category: "product-updates",
        duration: "10:52",
        publishedAt: "2024-03-13"
    },
    {
        id: "v141",
        title: "SQL Injection with Java and SonarLint + SonarCloud",
        description: "SQL Injection with Java and SonarLint + SonarCloud",
        youtubeId: "gFaPDrVGdUo",
        thumbnail: "/thumbnails/gFaPDrVGdUo.jpg",
        category: "sonarqube-for-ide",
        duration: "1:54",
        publishedAt: "2024-03-13"
    },
    {
        id: "v142",
        title: "Linux Foundation: Open-Source & Clean Code | Live with Sonar",
        description: "Linux Foundation: Open-Source & Clean Code | Live with Sonar",
        youtubeId: "kfu0M0G591s",
        thumbnail: "/thumbnails/kfu0M0G591s.jpg",
        category: "clean-code",
        duration: "43:30",
        publishedAt: "2024-03-13"
    },
    {
        id: "v143",
        title: "Clean Code: How Mistakes can Make You Great!",
        description: "Clean Code: How Mistakes can Make You Great!",
        youtubeId: "tCT_9ERaAGI",
        thumbnail: "/thumbnails/tCT_9ERaAGI.jpg",
        category: "clean-code",
        duration: "28:31",
        publishedAt: "2024-03-13"
    },
    {
        id: "v144",
        title: "Common Django Mistakes, and How to Avoid Them!",
        description: "Common Django Mistakes, and How to Avoid Them!",
        youtubeId: "44Nj3n5vpUs",
        thumbnail: "/thumbnails/44Nj3n5vpUs.jpg",
        category: "clean-code",
        duration: "2:12",
        publishedAt: "2024-03-13"
    },
    {
        id: "v145",
        title: "SonarLint for IntelliJ and other JetBrains IDEs Overview | a free and open source IDE extension",
        description: "SonarLint for IntelliJ and other JetBrains IDEs Overview | a free and open source IDE extension",
        youtubeId: "6Bv1wmj0jZI",
        thumbnail: "/thumbnails/6Bv1wmj0jZI.jpg",
        category: "sonarqube-for-ide",
        duration: "8:18",
        publishedAt: "2024-03-13"
    },
    {
        id: "v146",
        title: "Interview with a Java Developer | Developer Relations Advocate",
        description: "Interview with a Java Developer | Developer Relations Advocate",
        youtubeId: "nOJooDwqDQQ",
        thumbnail: "/thumbnails/nOJooDwqDQQ.jpg",
        category: "clean-code",
        duration: "5:26",
        publishedAt: "2024-03-13"
    },
    {
        id: "v147",
        title: "Interview with a Java Developer | Product Manager",
        description: "Interview with a Java Developer | Product Manager",
        youtubeId: "ACZqTrM5Frs",
        thumbnail: "/thumbnails/ACZqTrM5Frs.jpg",
        category: "clean-code",
        duration: "4:23",
        publishedAt: "2024-03-13"
    },
    {
        id: "v148",
        title: "Interview with a Java Developer | Software Engineer",
        description: "Interview with a Java Developer | Software Engineer",
        youtubeId: "2jYXRu9dOJM",
        thumbnail: "/thumbnails/2jYXRu9dOJM.jpg",
        category: "clean-code",
        duration: "4:51",
        publishedAt: "2024-03-13"
    },
    {
        id: "v149",
        title: "Securing Applications, Accelerating DevOps with Clean Code | Live with ISMG",
        description: "Securing Applications, Accelerating DevOps with Clean Code | Live with ISMG",
        youtubeId: "D-ycv935v64",
        thumbnail: "/thumbnails/D-ycv935v64.jpg",
        category: "code-security",
        duration: "11:52",
        publishedAt: "2024-03-13"
    },
    {
        id: "v150",
        title: "Azure DevOps Integration | Mapping your organization with SonarQube",
        description: "Azure DevOps Integration | Mapping your organization with SonarQube",
        youtubeId: "oYvMmN6G3F0",
        thumbnail: "/thumbnails/oYvMmN6G3F0.jpg",
        category: "devops-cicd",
        duration: "11:06",
        publishedAt: "2024-03-13"
    },
    {
        id: "v151",
        title: "SonarLint for PL/SQL Overview | a free and open source IDE extension",
        description: "SonarLint for PL/SQL Overview | a free and open source IDE extension",
        youtubeId: "MxH4PfiDx7Y",
        thumbnail: "/thumbnails/MxH4PfiDx7Y.jpg",
        category: "sonarqube-for-ide",
        duration: "0:29",
        publishedAt: "2024-03-13"
    },
    {
        id: "v152",
        title: "Sonar Virtual Event: Clean Code Principles and Practices, Part 1",
        description: "Sonar Virtual Event: Clean Code Principles and Practices, Part 1",
        youtubeId: "AlK4Vir5fMQ",
        thumbnail: "/thumbnails/AlK4Vir5fMQ.jpg",
        category: "clean-code",
        duration: "34:44",
        publishedAt: "2024-03-13"
    },
    {
        id: "v153",
        title: "SecurityGuy TV| Discovering Hidden Security Issues in Code with Sonar Deeper SAST",
        description: "SecurityGuy TV| Discovering Hidden Security Issues in Code with Sonar Deeper SAST",
        youtubeId: "cPxwIpV6VBI",
        thumbnail: "/thumbnails/cPxwIpV6VBI.jpg",
        category: "code-security",
        duration: "13:18",
        publishedAt: "2024-03-13"
    },
    {
        id: "v154",
        title: "Key Features of SonarQube 10.2",
        description: "Key Features of SonarQube 10.2",
        youtubeId: "e6dXEfAHouM",
        thumbnail: "/thumbnails/e6dXEfAHouM.jpg",
        category: "product-updates",
        duration: "10:17",
        publishedAt: "2024-03-13"
    },
    {
        id: "v155",
        title: "5 Lesser Known Python Security Pitfalls",
        description: "5 Lesser Known Python Security Pitfalls",
        youtubeId: "hucvAJcCgdY",
        thumbnail: "/thumbnails/hucvAJcCgdY.jpg",
        category: "code-security",
        duration: "8:34",
        publishedAt: "2024-03-13"
    },
    {
        id: "v156",
        title: "Demonstration of Moodle vulnerabilities (CVE-2023-40320) on a test instance",
        description: "Demonstration of Moodle vulnerabilities (CVE-2023-40320) on a test instance",
        youtubeId: "njeXbu85yzM",
        thumbnail: "/thumbnails/njeXbu85yzM.jpg",
        category: "code-security",
        duration: "2:33",
        publishedAt: "2024-03-13"
    },
    {
        id: "v157",
        title: "Demonstration of Moodle vulnerabilities (CVE-2023-30943) on a test instance",
        description: "Demonstration of Moodle vulnerabilities (CVE-2023-30943) on a test instance",
        youtubeId: "pevHGKKOsqU",
        thumbnail: "/thumbnails/pevHGKKOsqU.jpg",
        category: "code-security",
        duration: "1:13",
        publishedAt: "2024-03-13"
    },
    {
        id: "v158",
        title: "SonarLint for VS Code Overview | a free and open source IDE extension",
        description: "SonarLint for VS Code Overview | a free and open source IDE extension",
        youtubeId: "m8sAdYCIWhY",
        thumbnail: "/thumbnails/m8sAdYCIWhY.jpg",
        category: "sonarqube-for-ide",
        duration: "6:32",
        publishedAt: "2024-03-13"
    },
    {
        id: "v159",
        title: "Installing SonarQube on Windows",
        description: "Installing SonarQube on Windows",
        youtubeId: "O0yFLS30InY",
        thumbnail: "/thumbnails/O0yFLS30InY.jpg",
        category: "getting-started",
        duration: "9:31",
        publishedAt: "2024-03-13"
    },
    {
        id: "v160",
        title: "Clean Code for Python. what does this mean in practice?",
        description: "Clean Code for Python. what does this mean in practice?",
        youtubeId: "CZKvnTv0-a0",
        thumbnail: "/thumbnails/CZKvnTv0-a0.jpg",
        category: "clean-code",
        duration: "31:08",
        publishedAt: "2024-03-13"
    },
    {
        id: "v161",
        title: "Automatic Analysis for C and C++ | SonarCloud",
        description: "Automatic Analysis for C and C++ | SonarCloud",
        youtubeId: "_EhqQAMscTQ",
        thumbnail: "/thumbnails/_EhqQAMscTQ.jpg",
        category: "sonarqube-cloud",
        duration: "0:31",
        publishedAt: "2024-03-13"
    },
    {
        id: "v162",
        title: "The Clean as You Code Imperative, by Sonar CEO Olivier Gaudin | WeAreDevelopers Mainstage Talk",
        description: "The Clean as You Code Imperative, by Sonar CEO Olivier Gaudin | WeAreDevelopers Mainstage Talk",
        youtubeId: "9_1QZcisUFw",
        thumbnail: "/thumbnails/9_1QZcisUFw.jpg",
        category: "clean-code",
        duration: "30:41",
        publishedAt: "2024-03-13"
    },
    {
        id: "v163",
        title: "Clean as You Code | Sonar's Unique Methodology for Clean Code",
        description: "Clean as You Code | Sonar's Unique Methodology for Clean Code",
        youtubeId: "VEBQrAVLm38",
        thumbnail: "/thumbnails/VEBQrAVLm38.jpg",
        category: "clean-code",
        duration: "1:37",
        publishedAt: "2024-03-13"
    },
    {
        id: "v164",
        title: "How Ben Dechrai Became a Developer Relations Advocate",
        description: "How Ben Dechrai Became a Developer Relations Advocate",
        youtubeId: "rHOCgaZG9Cc",
        thumbnail: "/thumbnails/rHOCgaZG9Cc.jpg",
        category: "clean-code",
        duration: "6:30",
        publishedAt: "2024-03-13"
    },
    {
        id: "v165",
        title: "How Phil Nash Became a Developer Relations Advocate",
        description: "How Phil Nash Became a Developer Relations Advocate",
        youtubeId: "s1YM2OLI1PY",
        thumbnail: "/thumbnails/s1YM2OLI1PY.jpg",
        category: "clean-code",
        duration: "6:25",
        publishedAt: "2024-03-13"
    },
    {
        id: "v166",
        title: "How to Scan C / C++ Code with SonarQube | C- Family Analysis",
        description: "How to Scan C / C++ Code with SonarQube | C- Family Analysis",
        youtubeId: "fYr5Yxz7w_Q",
        thumbnail: "/thumbnails/fYr5Yxz7w_Q.jpg",
        category: "getting-started",
        duration: "7:03",
        publishedAt: "2024-03-13"
    },
    {
        id: "v167",
        title: "GitLab Integration | Mapping your organization into SonarQube",
        description: "GitLab Integration | Mapping your organization into SonarQube",
        youtubeId: "XX0ey4rRvms",
        thumbnail: "/thumbnails/XX0ey4rRvms.jpg",
        category: "devops-cicd",
        duration: "9:01",
        publishedAt: "2024-03-13"
    },
    {
        id: "v168",
        title: "SonarLint for Python: How to Get Started",
        description: "SonarLint for Python: How to Get Started",
        youtubeId: "pAz9O_N1Vs8",
        thumbnail: "/thumbnails/pAz9O_N1Vs8.jpg",
        category: "sonarqube-for-ide",
        duration: "3:18",
        publishedAt: "2024-03-13"
    },
    {
        id: "v169",
        title: "See it Live: SonarQube 9.9 LTS",
        description: "See it Live: SonarQube 9.9 LTS",
        youtubeId: "natyYoVix9U",
        thumbnail: "/thumbnails/natyYoVix9U.jpg",
        category: "product-updates",
        duration: "1:01:07",
        publishedAt: "2024-03-13"
    },
    {
        id: "v170",
        title: "Key Features of SonarQube 10.1",
        description: "Key Features of SonarQube 10.1",
        youtubeId: "nvwwIurQ6ao",
        thumbnail: "/thumbnails/nvwwIurQ6ao.jpg",
        category: "product-updates",
        duration: "11:14",
        publishedAt: "2024-03-13"
    },
    {
        id: "v171",
        title: "Clean Code for Cloud Native Applications",
        description: "Clean Code for Cloud Native Applications",
        youtubeId: "KmXlSnPX38M",
        thumbnail: "/thumbnails/KmXlSnPX38M.jpg",
        category: "clean-code",
        duration: "26:03",
        publishedAt: "2024-03-13"
    },
    {
        id: "v172",
        title: "GitHub Integration | Mapping your organization into SonarQube",
        description: "GitHub Integration | Mapping your organization into SonarQube",
        youtubeId: "6zvBuZr8CeI",
        thumbnail: "/thumbnails/6zvBuZr8CeI.jpg",
        category: "devops-cicd",
        duration: "8:51",
        publishedAt: "2024-03-13"
    },
    {
        id: "v173",
        title: "Ace Your SonarQube Version Upgrade!",
        description: "Ace Your SonarQube Version Upgrade!",
        youtubeId: "U3QGs6PlVEM",
        thumbnail: "/thumbnails/U3QGs6PlVEM.jpg",
        category: "product-updates",
        duration: "32:18",
        publishedAt: "2024-03-13"
    },
    {
        id: "v174",
        title: "Sonar Analysis in Compiler Explorer: The Presenter",
        description: "Sonar Analysis in Compiler Explorer: The Presenter",
        youtubeId: "32bEXjbb8oQ",
        thumbnail: "/thumbnails/32bEXjbb8oQ.jpg",
        category: "clean-code",
        duration: "1:02",
        publishedAt: "2024-03-13"
    },
    {
        id: "v175",
        title: "Sonar Analysis in Compiler Explorer: The Debugger",
        description: "Sonar Analysis in Compiler Explorer: The Debugger",
        youtubeId: "k1KkCPMHwzA",
        thumbnail: "/thumbnails/k1KkCPMHwzA.jpg",
        category: "clean-code",
        duration: "1:05",
        publishedAt: "2024-03-13"
    },
    {
        id: "v176",
        title: "Sonar Analysis in Compiler Explorer: The Experimenter",
        description: "Sonar Analysis in Compiler Explorer: The Experimenter",
        youtubeId: "xwTdlw-yuwM",
        thumbnail: "/thumbnails/xwTdlw-yuwM.jpg",
        category: "clean-code",
        duration: "1:13",
        publishedAt: "2024-03-13"
    },
    {
        id: "v177",
        title: "What is SonarQube?",
        description: "What is SonarQube?",
        youtubeId: "xeTwG9XFFTE",
        thumbnail: "/thumbnails/xeTwG9XFFTE.jpg",
        category: "getting-started",
        duration: "0:57",
        publishedAt: "2024-03-13"
    },
    {
        id: "v178",
        title: "Interview with a Python Developer | Why you should start coding in Python",
        description: "Interview with a Python Developer | Why you should start coding in Python",
        youtubeId: "i95lJmsWEHc",
        thumbnail: "/thumbnails/i95lJmsWEHc.jpg",
        category: "clean-code",
        duration: "2:43",
        publishedAt: "2024-03-13"
    },
    {
        id: "v179",
        title: "Finding the Bad Apple in Your Regular Expressions",
        description: "Finding the Bad Apple in Your Regular Expressions",
        youtubeId: "V00IFs2EzdE",
        thumbnail: "/thumbnails/V00IFs2EzdE.jpg",
        category: "code-security",
        duration: "30:00",
        publishedAt: "2024-03-13"
    },
    {
        id: "v180",
        title: "Scaling Clean Code Across Your Enterprise | Clean Code Webinar",
        description: "Scaling Clean Code Across Your Enterprise | Clean Code Webinar",
        youtubeId: "dY76ed3YBaw",
        thumbnail: "/thumbnails/dY76ed3YBaw.jpg",
        category: "architecture-governance",
        duration: "31:41",
        publishedAt: "2024-03-13"
    },
    {
        id: "v181",
        title: "What is SonarCloud?",
        description: "What is SonarCloud?",
        youtubeId: "GCTGSvP_UAo",
        thumbnail: "/thumbnails/GCTGSvP_UAo.jpg",
        category: "sonarqube-cloud",
        duration: "0:57",
        publishedAt: "2024-03-13"
    },
    {
        id: "v182",
        title: "Women in Tech: Celebrating Womens History Month",
        description: "Women in Tech: Celebrating Womens History Month",
        youtubeId: "oOFUk77y_7U",
        thumbnail: "/thumbnails/oOFUk77y_7U.jpg",
        category: "clean-code",
        duration: "1:13",
        publishedAt: "2024-03-13"
    },
    {
        id: "v183",
        title: "Sonar Customer Stories | Modino.io",
        description: "Sonar Customer Stories | Modino.io",
        youtubeId: "DiF4VfW4zco",
        thumbnail: "/thumbnails/DiF4VfW4zco.jpg",
        category: "customer-stories",
        duration: "2:28",
        publishedAt: "2024-03-13"
    },
    {
        id: "v184",
        title: "Sonar Customer Stories | Siemens AG",
        description: "Sonar Customer Stories | Siemens AG",
        youtubeId: "VOjYA-WHdIs",
        thumbnail: "/thumbnails/VOjYA-WHdIs.jpg",
        category: "customer-stories",
        duration: "1:26",
        publishedAt: "2024-03-13"
    },
    {
        id: "v185",
        title: "The Power of Clean C++",
        description: "The Power of Clean C++",
        youtubeId: "c4BGTEfw0Go",
        thumbnail: "/thumbnails/c4BGTEfw0Go.jpg",
        category: "clean-code",
        duration: "33:44",
        publishedAt: "2024-03-13"
    },
    {
        id: "v186",
        title: "Sprinkle the Clean Code magic in your JavaScript projects",
        description: "Sprinkle the Clean Code magic in your JavaScript projects",
        youtubeId: "SrySvsiQp6A",
        thumbnail: "/thumbnails/SrySvsiQp6A.jpg",
        category: "clean-code",
        duration: "30:06",
        publishedAt: "2023-03-13"
    },
    {
        id: "v187",
        title: "Clean Code: Your Software Done Right",
        description: "Clean Code: Your Software Done Right",
        youtubeId: "MtkhwVa-uYw",
        thumbnail: "/thumbnails/MtkhwVa-uYw.jpg",
        category: "clean-code",
        duration: "31:03",
        publishedAt: "2023-03-13"
    },
    {
        id: "v188",
        title: "What is Sonar? | Sustainable Clean Code",
        description: "What is Sonar? | Sustainable Clean Code",
        youtubeId: "PTGYFUR-mgo",
        thumbnail: "/thumbnails/PTGYFUR-mgo.jpg",
        category: "clean-code",
        duration: "1:15",
        publishedAt: "2023-03-13"
    },
    {
        id: "v189",
        title: "Key Features of SonarQube 9 8",
        description: "Key Features of SonarQube 9 8",
        youtubeId: "_mqCs7C5UeY",
        thumbnail: "/thumbnails/_mqCs7C5UeY.jpg",
        category: "product-updates",
        duration: "7:32",
        publishedAt: "2023-03-13"
    },
    {
        id: "v190",
        title: "Key features of SonarQube 9.7",
        description: "Key features of SonarQube 9.7",
        youtubeId: "X_7XWFXipI0",
        thumbnail: "/thumbnails/X_7XWFXipI0.jpg",
        category: "product-updates",
        duration: "4:54",
        publishedAt: "2023-03-13"
    },
    {
        id: "v191",
        title: "What is SonarQube for IDE? (Formerly SonarLint)",
        description: "What is SonarQube for IDE? (Formerly SonarLint)",
        youtubeId: "Ks4Slmzb1qY",
        thumbnail: "/thumbnails/Ks4Slmzb1qY.jpg",
        category: "sonarqube-for-ide",
        duration: "0:33",
        publishedAt: "2023-03-13"
    },
    {
        id: "v192",
        title: "Sonar CEO, Olivier Gaudin: What is Clean Code?",
        description: "Sonar CEO, Olivier Gaudin: What is Clean Code?",
        youtubeId: "GKv1ls81Bi8",
        thumbnail: "/thumbnails/GKv1ls81Bi8.jpg",
        category: "clean-code",
        duration: "3:37",
        publishedAt: "2023-03-13"
    },
    {
        id: "v193",
        title: "A day in the life of a Sonar developer",
        description: "A day in the life of a Sonar developer",
        youtubeId: "TEXN7jx22C4",
        thumbnail: "/thumbnails/TEXN7jx22C4.jpg",
        category: "clean-code",
        duration: "1:07",
        publishedAt: "2023-03-13"
    },
    {
        id: "v194",
        title: "Who is Sonar? | Better Software & Code",
        description: "Who is Sonar? | Better Software & Code",
        youtubeId: "D4weESrOVdM",
        thumbnail: "/thumbnails/D4weESrOVdM.jpg",
        category: "getting-started",
        duration: "0:31",
        publishedAt: "2023-03-13"
    },
    {
        id: "v195",
        title: "Clean Java Pull Requests in 3 Minutes",
        description: "Clean Java Pull Requests in 3 Minutes",
        youtubeId: "tpy7Oen0kdQ",
        thumbnail: "/thumbnails/tpy7Oen0kdQ.jpg",
        category: "devops-cicd",
        duration: "1:24",
        publishedAt: "2023-03-13"
    },
    {
        id: "v196",
        title: "What is Clean Code? | BrightTalk at Black Hat USA 2022",
        description: "What is Clean Code? | BrightTalk at Black Hat USA 2022",
        youtubeId: "6f6x7ACwwy0",
        thumbnail: "/thumbnails/6f6x7ACwwy0.jpg",
        category: "clean-code",
        duration: "1:39",
        publishedAt: "2023-03-13"
    },
    {
        id: "v197",
        title: "Key Features of SonarQube 9.6",
        description: "Key Features of SonarQube 9.6",
        youtubeId: "VCkA8nGLbPg",
        thumbnail: "/thumbnails/VCkA8nGLbPg.jpg",
        category: "product-updates",
        duration: "10:10",
        publishedAt: "2023-03-13"
    },
    {
        id: "v198",
        title: "Infrastructure as Code (IaC) & Clean Code in Cloud Native Apps with Sonar",
        description: "Infrastructure as Code (IaC) & Clean Code in Cloud Native Apps with Sonar",
        youtubeId: "Zn4CXrXYe7k",
        thumbnail: "/thumbnails/Zn4CXrXYe7k.jpg",
        category: "clean-code",
        duration: "1:10",
        publishedAt: "2023-03-13"
    },
    {
        id: "v199",
        title: "Intro to C++ Quick Fixes in VS Code with SonarLint",
        description: "Intro to C++ Quick Fixes in VS Code with SonarLint",
        youtubeId: "LO0mUe_YYY4",
        thumbnail: "/thumbnails/LO0mUe_YYY4.jpg",
        category: "sonarqube-for-ide",
        duration: "4:09",
        publishedAt: "2023-03-13"
    },
    {
        id: "v200",
        title: "Key features of SonarQube 9.5",
        description: "Key features of SonarQube 9.5",
        youtubeId: "7_jdW2Co_ns",
        thumbnail: "/thumbnails/7_jdW2Co_ns.jpg",
        category: "product-updates",
        duration: "7:51",
        publishedAt: "2023-03-13"
    },
    {
        id: "v201",
        title: "Bring Code Quality and Security to your CI/CD pipeline",
        description: "Bring Code Quality and Security to your CI/CD pipeline",
        youtubeId: "0sXU5OPfAPs",
        thumbnail: "/thumbnails/0sXU5OPfAPs.jpg",
        category: "code-security",
        duration: "1:44:09",
        publishedAt: "2023-03-13"
    },
    {
        id: "v202",
        title: "Clean Code Approach: Simple, Yet Powerful | Code smarter",
        description: "Clean Code Approach: Simple, Yet Powerful | Code smarter",
        youtubeId: "shfNPc4RxS4",
        thumbnail: "/thumbnails/shfNPc4RxS4.jpg",
        category: "clean-code",
        duration: "7:29",
        publishedAt: "2023-03-13"
    },
    {
        id: "v203",
        title: "Intro to C++ Quick Fixes in Visual Studio with SonarLint",
        description: "Intro to C++ Quick Fixes in Visual Studio with SonarLint",
        youtubeId: "svzaGMRcfrU",
        thumbnail: "/thumbnails/svzaGMRcfrU.jpg",
        category: "sonarqube-for-ide",
        duration: "4:14",
        publishedAt: "2023-03-13"
    },
    {
        id: "v204",
        title: "Key features of SonarQube 9.4",
        description: "Key features of SonarQube 9.4",
        youtubeId: "0oGOWds9oQ0",
        thumbnail: "/thumbnails/0oGOWds9oQ0.jpg",
        category: "product-updates",
        duration: "10:04",
        publishedAt: "2023-03-13"
    },
    {
        id: "v205",
        title: "Intro to C++ Quick Fixes in CLion with SonarLint",
        description: "Intro to C++ Quick Fixes in CLion with SonarLint",
        youtubeId: "GBoTe9OmCeM",
        thumbnail: "/thumbnails/GBoTe9OmCeM.jpg",
        category: "sonarqube-for-ide",
        duration: "5:02",
        publishedAt: "2022-03-13"
    },
    {
        id: "v206",
        title: "How to Detect Security Vulnerabilities in Pull Requests (SonarQube Cloud)",
        description: "How to Detect Security Vulnerabilities in Pull Requests (SonarQube Cloud)",
        youtubeId: "wUFWafTWhvA",
        thumbnail: "/thumbnails/wUFWafTWhvA.jpg",
        category: "sonarqube-cloud",
        duration: "0:31",
        publishedAt: "2022-03-13"
    },
    {
        id: "v207",
        title: "How to Do Automatic Code Analysis in Minutes with SonarQube Cloud",
        description: "How to Do Automatic Code Analysis in Minutes with SonarQube Cloud",
        youtubeId: "TeFSQ4fl1FA",
        thumbnail: "/thumbnails/TeFSQ4fl1FA.jpg",
        category: "sonarqube-cloud",
        duration: "0:28",
        publishedAt: "2022-03-13"
    },
    {
        id: "v208",
        title: "How to Get Started with SonarQube Cloud (3 Easy Steps)",
        description: "How to Get Started with SonarQube Cloud (3 Easy Steps)",
        youtubeId: "n7Rf2uibD6g",
        thumbnail: "/thumbnails/n7Rf2uibD6g.jpg",
        category: "sonarqube-cloud",
        duration: "0:26",
        publishedAt: "2022-03-13"
    },
    {
        id: "v209",
        title: "Who Guards the Guards? - Finding Code Bugs in Your Tests with Static Analysis",
        description: "Who Guards the Guards? - Finding Code Bugs in Your Tests with Static Analysis",
        youtubeId: "Prlo_WiCPzc",
        thumbnail: "/thumbnails/Prlo_WiCPzc.jpg",
        category: "clean-code",
        duration: "7:15",
        publishedAt: "2022-03-13"
    },
    {
        id: "v210",
        title: "Modernize Code Quality with Quick-Fixes | SonarLint",
        description: "Modernize Code Quality with Quick-Fixes | SonarLint",
        youtubeId: "nn3OyFsEPQE",
        thumbnail: "/thumbnails/nn3OyFsEPQE.jpg",
        category: "sonarqube-for-ide",
        duration: "1:17",
        publishedAt: "2022-03-13"
    },
    {
        id: "v211",
        title: "Mobile Apps: Building at Scale while Maintaining Code Quality & Complex Lifecycles",
        description: "Mobile Apps: Building at Scale while Maintaining Code Quality & Complex Lifecycles",
        youtubeId: "UppGKkzGXPQ",
        thumbnail: "/thumbnails/UppGKkzGXPQ.jpg",
        category: "architecture-governance",
        duration: "56:16",
        publishedAt: "2022-03-13"
    },
    {
        id: "v212",
        title: "Refactoring with Cognitive Complexity",
        description: "Refactoring with Cognitive Complexity",
        youtubeId: "el9OKGrqU6o",
        thumbnail: "/thumbnails/el9OKGrqU6o.jpg",
        category: "clean-code",
        duration: "43:08",
        publishedAt: "2022-03-13"
    },
    {
        id: "v213",
        title: "SonarQube 8.9 LTS: Better than ever",
        description: "SonarQube 8.9 LTS: Better than ever",
        youtubeId: "40AUfi3hd9c",
        thumbnail: "/thumbnails/40AUfi3hd9c.jpg",
        category: "product-updates",
        duration: "46:15",
        publishedAt: "2022-03-13"
    },
    {
        id: "v214",
        title: "You're 5 minutes away from Code Quality & Code Security",
        description: "You're 5 minutes away from Code Quality & Code Security",
        youtubeId: "JeRFHQt7rkk",
        thumbnail: "/thumbnails/JeRFHQt7rkk.jpg",
        category: "code-security",
        duration: "6:32",
        publishedAt: "2022-03-13"
    },
    {
        id: "v215",
        title: "CI/CD Pipeline: Smarter with Static Analysis & Linting | Improve Code Insights",
        description: "CI/CD Pipeline: Smarter with Static Analysis & Linting | Improve Code Insights",
        youtubeId: "k1JfYzF_HTY",
        thumbnail: "/thumbnails/k1JfYzF_HTY.jpg",
        category: "devops-cicd",
        duration: "1:07:06",
        publishedAt: "2022-03-13"
    },
    {
        id: "v216",
        title: "GitHub: Block the Merge of a Pull Requests",
        description: "GitHub: Block the Merge of a Pull Requests",
        youtubeId: "gdbYq0eYSa0",
        thumbnail: "/thumbnails/gdbYq0eYSa0.jpg",
        category: "devops-cicd",
        duration: "0:57",
        publishedAt: "2021-03-13"
    },
    {
        id: "v217",
        title: "Bitbucket : Reviewing a Security Hotspot",
        description: "Bitbucket : Reviewing a Security Hotspot",
        youtubeId: "VKrCUaFP4Fo",
        thumbnail: "/thumbnails/VKrCUaFP4Fo.jpg",
        category: "code-security",
        duration: "0:42",
        publishedAt: "2021-03-13"
    },
    {
        id: "v218",
        title: "Multiple Issue Locations or Flows in SonarLint for Eclipse",
        description: "Multiple Issue Locations or Flows in SonarLint for Eclipse",
        youtubeId: "fty4Ofxcy9g",
        thumbnail: "/thumbnails/fty4Ofxcy9g.jpg",
        category: "sonarqube-for-ide",
        duration: "0:45",
        publishedAt: "2021-03-13"
    },
    {
        id: "v219",
        title: "Understanding Issues with Multiple Locations",
        description: "Understanding Issues with Multiple Locations",
        youtubeId: "17G-aZcuMKw",
        thumbnail: "/thumbnails/17G-aZcuMKw.jpg",
        category: "clean-code",
        duration: "0:45",
        publishedAt: "2021-03-13"
    },
    {
        id: "v220",
        title: "Lightning fast SonarQube analysis with Jenkins",
        description: "Lightning fast SonarQube analysis with Jenkins",
        youtubeId: "CaE8L6AAvCY",
        thumbnail: "/thumbnails/CaE8L6AAvCY.jpg",
        category: "devops-cicd",
        duration: "0:59",
        publishedAt: "2021-03-13"
    },
    {
        id: "v221",
        title: "Block the Merge of a Pull Request in Azure DevOps",
        description: "Block the Merge of a Pull Request in Azure DevOps",
        youtubeId: "be5aw9_7bBU",
        thumbnail: "/thumbnails/be5aw9_7bBU.jpg",
        category: "devops-cicd",
        duration: "0:46",
        publishedAt: "2021-03-13"
    },
    {
        id: "v222",
        title: "C++: Write Cleaner, Safer, Modern Code with SonarQube",
        description: "C++: Write Cleaner, Safer, Modern Code with SonarQube",
        youtubeId: "WPHVPbxCAwE",
        thumbnail: "/thumbnails/WPHVPbxCAwE.jpg",
        category: "clean-code",
        duration: "29:37",
        publishedAt: "2021-03-13"
    },
    {
        id: "v223",
        title: "Write cleaner, safer Python code with SonarQube",
        description: "Write cleaner, safer Python code with SonarQube",
        youtubeId: "ow-yuIlCuHk",
        thumbnail: "/thumbnails/ow-yuIlCuHk.jpg",
        category: "clean-code",
        duration: "30:49",
        publishedAt: "2021-03-13"
    },
    {
        id: "v224",
        title: "Azure DevOps Pull Request/Branch Decoration with SonarQube",
        description: "Azure DevOps Pull Request/Branch Decoration with SonarQube",
        youtubeId: "apGamsIBB9Y",
        thumbnail: "/thumbnails/apGamsIBB9Y.jpg",
        category: "devops-cicd",
        duration: "4:19",
        publishedAt: "2021-03-13"
    },
    {
        id: "v225",
        title: "Atlassian Bitbucket Pull Request/Branch Decoration with SonarQube",
        description: "Atlassian Bitbucket Pull Request/Branch Decoration with SonarQube",
        youtubeId: "KaoI4jiySkQ",
        thumbnail: "/thumbnails/KaoI4jiySkQ.jpg",
        category: "devops-cicd",
        duration: "4:02",
        publishedAt: "2021-03-13"
    },
    {
        id: "v226",
        title: "GitLab Merge Request/Branch Decoration with SonarQube",
        description: "GitLab Merge Request/Branch Decoration with SonarQube",
        youtubeId: "u2dvQx08nXM",
        thumbnail: "/thumbnails/u2dvQx08nXM.jpg",
        category: "devops-cicd",
        duration: "4:38",
        publishedAt: "2021-03-13"
    },
    {
        id: "v227",
        title: "GitHub Pull Request/Branch Decoration Development Workflow with SonarQube",
        description: "GitHub Pull Request/Branch Decoration Development Workflow with SonarQube",
        youtubeId: "zVzwuV92r6M",
        thumbnail: "/thumbnails/zVzwuV92r6M.jpg",
        category: "devops-cicd",
        duration: "3:15",
        publishedAt: "2021-03-13"
    },
    {
        id: "v228",
        title: "Code Quality & Security in Your Development Workflow",
        description: "Code Quality & Security in Your Development Workflow",
        youtubeId: "je7rSt3QcQc",
        thumbnail: "/thumbnails/je7rSt3QcQc.jpg",
        category: "code-security",
        duration: "18:11",
        publishedAt: "2021-03-13"
    },
    {
        id: "v229",
        title: "Empowering Developers to own Code Security | SAST Tool Solution",
        description: "Empowering Developers to own Code Security | SAST Tool Solution",
        youtubeId: "1-TRlxBGrkI",
        thumbnail: "/thumbnails/1-TRlxBGrkI.jpg",
        category: "code-security",
        duration: "22:23",
        publishedAt: "2020-03-13"
    }
];
function getVideoById(id) {
    return videos.find((v)=>v.id === id);
}
function getVideosByCategory(categorySlug) {
    return videos.filter((v)=>v.category === categorySlug);
}
function getCategoryBySlug(slug) {
    return categories.find((c)=>c.slug === slug);
}
function getFeaturedVideo() {
    return videos.find((v)=>v.youtubeId === "el9OKGrqU6o") ?? videos[0];
}
}),
"[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$data$2f$videos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/src/data/videos.ts [app-ssr] (ecmascript)");
;
;
;
;
function Hero({ video, actions }) {
    const category = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$data$2f$videos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["categories"].find((c)=>c.slug === video.category);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative h-[70vh] min-h-[500px] w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                src: video.thumbnail,
                alt: video.title,
                fill: true,
                className: "object-cover",
                priority: true,
                sizes: "100vw"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-r from-sonar-purple/70 to-transparent"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-0 right-0 px-4 pb-16 sm:px-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-2xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-3 flex flex-wrap items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-block rounded bg-qube-blue/20 px-3 py-1 font-heading text-sm font-medium text-qube-blue",
                                            children: "Featured"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                            lineNumber: 26,
                                            columnNumber: 15
                                        }, this),
                                        category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-block rounded bg-sonar-purple/40 px-3 py-1 font-heading text-sm font-medium text-n5",
                                            children: category.title
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                            lineNumber: 30,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-flex items-center gap-1 rounded bg-n9/60 px-2.5 py-1 font-heading text-sm font-medium text-n6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "h-3.5 w-3.5",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    strokeWidth: "2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                            cx: "12",
                                                            cy: "12",
                                                            r: "10"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                                            lineNumber: 36,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                            points: "12 6 12 12 16 14"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                                            lineNumber: 37,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                                    lineNumber: 35,
                                                    columnNumber: 17
                                                }, this),
                                                video.duration
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                            lineNumber: 34,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                    lineNumber: 25,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "mb-4 font-heading text-3xl font-bold text-n1 sm:text-5xl",
                                    children: video.title
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-6 line-clamp-2 text-base text-n5 sm:text-lg",
                                    children: video.description
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/watch/${video.id}`,
                                    className: "inline-flex items-center gap-2 rounded-lg bg-sonar-red px-6 py-3 font-heading text-sm font-semibold text-n1 shadow-lg shadow-sonar-red/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sonar-red/85 hover:shadow-xl hover:shadow-sonar-red/35 active:translate-y-0 active:shadow-md active:shadow-sonar-red/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-5 w-5",
                                            fill: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M8 5v14l11-7z"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                                lineNumber: 55,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                            lineNumber: 54,
                                            columnNumber: 15
                                        }, this),
                                        "Watch Now"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                actions
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/workspace/sonarqube-tv/src/lib/watchProgress.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllProgress",
    ()=>getAllProgress,
    "getProgress",
    ()=>getProgress,
    "setProgress",
    ()=>setProgress
]);
const STORAGE_KEY = "sonarqube-tv-watch-progress";
function getAllProgress() {
    if ("TURBOPACK compile-time truthy", 1) return {};
    //TURBOPACK unreachable
    ;
}
function getProgress(videoId) {
    return getAllProgress()[videoId] ?? 0;
}
function setProgress(videoId, percent) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const all = undefined;
}
}),
"[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VideoCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$lib$2f$watchProgress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/src/lib/watchProgress.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
}
function VideoCard({ video }) {
    const [progress, setProgressState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setProgressState((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$lib$2f$watchProgress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProgress"])(video.id));
    }, [
        video.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: `/watch/${video.id}`,
        className: "group flex-shrink-0 snap-start",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-video w-[280px] overflow-hidden rounded-lg shadow-md shadow-transparent transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-sonar-red/25 sm:w-[320px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: video.thumbnail,
                        alt: video.title,
                        fill: true,
                        className: "object-cover transition-transform duration-300 group-hover:scale-105",
                        sizes: "320px"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-sonar-purple/40",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "h-12 w-12 scale-75 text-n1 opacity-0 drop-shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100",
                            fill: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M8 5v14l11-7z"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute bottom-2 right-2 rounded bg-n9/80 px-1.5 py-0.5 text-xs font-medium text-n1",
                        children: video.duration
                    }, void 0, false, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    progress > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute top-2 left-2 rounded bg-n9/80 px-1.5 py-0.5 text-xs font-medium text-qube-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                                children: [
                                    progress,
                                    "% watched"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-0 left-0 right-0 h-1 bg-n8/60",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full bg-sonar-red transition-all duration-300",
                                    style: {
                                        width: `${progress}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                                    lineNumber: 68,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "mt-2 line-clamp-2 w-[280px] font-heading text-sm font-medium text-n3 transition-colors group-hover:text-n1 sm:w-[320px]",
                children: video.title
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-0.5 w-[280px] text-xs text-n7 sm:w-[320px]",
                children: timeAgo(video.publishedAt)
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VideoRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$components$2f$VideoCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/src/components/VideoCard.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function VideoRow({ title, categorySlug, videos }) {
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scroll = (direction)=>{
        if (!scrollRef.current) return;
        const amount = 340;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth"
        });
    };
    if (videos.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative py-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-4 mb-4 border-t border-n8/50 sm:mx-6"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-center justify-between px-4 sm:px-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "font-heading text-lg font-semibold text-n1 sm:text-xl",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: `/watch/${videos[0].id}?playlist=${categorySlug}`,
                                className: "inline-flex items-center gap-1.5 font-heading text-sm text-n6 transition-colors hover:text-n1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-4 w-4",
                                        fill: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
                                                opacity: ".5"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                                                lineNumber: 39,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M15 12l5 3.5V8.5z"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                                                lineNumber: 40,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                                        lineNumber: 38,
                                        columnNumber: 13
                                    }, this),
                                    "Watch All"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: `/category/${categorySlug}`,
                                className: "font-heading text-sm text-n1 transition-colors hover:text-n6",
                                children: "See All"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "group/row relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>scroll("left"),
                        className: "absolute left-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100",
                        "aria-label": "Scroll left",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "h-6 w-6 text-n1",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M15 19l-7-7 7-7"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: scrollRef,
                        className: "flex gap-4 overflow-x-auto scroll-smooth px-4 scrollbar-hide snap-x snap-mandatory sm:px-6",
                        children: videos.map((video)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$components$2f$VideoCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                video: video
                            }, video.id, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>scroll("right"),
                        className: "absolute right-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity duration-300 group-hover/row:opacity-100",
                        "aria-label": "Scroll right",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "h-6 w-6 text-n1",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M9 5l7 7-7 7"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FilterTrigger",
    ()=>FilterTrigger,
    "default",
    ()=>FilterBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const uploadDateOptions = [
    {
        value: "anytime",
        label: "Any time"
    },
    {
        value: "today",
        label: "Today"
    },
    {
        value: "this-week",
        label: "This week"
    },
    {
        value: "this-month",
        label: "This month"
    },
    {
        value: "this-year",
        label: "This year"
    }
];
const durationOptions = [
    {
        value: "any",
        label: "Any duration"
    },
    {
        value: "short",
        label: "Under 4 min"
    },
    {
        value: "medium",
        label: "4\u201320 min"
    },
    {
        value: "long",
        label: "Over 20 min"
    }
];
const sortOptions = [
    {
        value: "newest",
        label: "Newest"
    },
    {
        value: "oldest",
        label: "Oldest"
    }
];
function SlidersIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "4",
                y1: "21",
                x2: "4",
                y2: "14"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "4",
                y1: "10",
                x2: "4",
                y2: "3"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "21",
                x2: "12",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "8",
                x2: "12",
                y2: "3"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "20",
                y1: "21",
                x2: "20",
                y2: "16"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "20",
                y1: "12",
                x2: "20",
                y2: "3"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "1",
                y1: "14",
                x2: "7",
                y2: "14"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "8",
                x2: "15",
                y2: "8"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "17",
                y1: "16",
                x2: "23",
                y2: "16"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
function FilterGroup({ label, options, value, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-heading text-xs font-medium uppercase tracking-wider text-n6",
                children: label
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2",
                children: options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onChange(opt.value),
                        className: `rounded-full px-3 py-1.5 font-heading text-xs font-medium transition-colors ${value === opt.value ? "bg-qube-blue text-n1" : "bg-n8 text-n5 hover:bg-n7"}`,
                        children: opt.label
                    }, opt.value, false, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
function FilterBar({ uploadDate, duration, sortBy, onUploadDateChange, onDurationChange, onSortByChange, onReset, hasActiveFilters, isOpen, onOpenChange }) {
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const setIsOpen = onOpenChange;
    // Animation state: keep modal mounted during exit transition
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen) {
            setMounted(true);
            // Trigger enter animation on next frame so the transition fires
            requestAnimationFrame(()=>{
                requestAnimationFrame(()=>setVisible(true));
            });
        } else {
            setVisible(false);
        }
    }, [
        isOpen
    ]);
    const handleTransitionEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!visible) setMounted(false);
    }, [
        visible
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) return;
        function handleKeyDown(e) {
            if (e.key === "Escape") setIsOpen(false);
        }
        document.addEventListener("keydown", handleKeyDown);
        return ()=>document.removeEventListener("keydown", handleKeyDown);
    }, [
        isOpen,
        setIsOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-colors duration-200 ${visible ? "bg-black/60" : "bg-black/0"}`,
            onClick: (e)=>{
                if (e.target === e.currentTarget) setIsOpen(false);
            },
            onTransitionEnd: handleTransitionEnd,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: modalRef,
                className: `mx-4 w-full max-w-md rounded-xl border border-n8 bg-background p-6 shadow-2xl transition-all duration-200 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-heading text-lg font-semibold text-n1",
                                children: "Filters"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                lineNumber: 169,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsOpen(false),
                                className: "rounded-lg p-1 text-n6 transition-colors hover:bg-n8 hover:text-n3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    width: "20",
                                    height: "20",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "18",
                                            y1: "6",
                                            x2: "6",
                                            y2: "18"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                            lineNumber: 177,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "6",
                                            y1: "6",
                                            x2: "18",
                                            y2: "18"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                            lineNumber: 178,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                    lineNumber: 176,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                lineNumber: 172,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                        lineNumber: 168,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterGroup, {
                                label: "Upload date",
                                options: uploadDateOptions,
                                value: uploadDate,
                                onChange: onUploadDateChange
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                lineNumber: 184,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterGroup, {
                                label: "Duration",
                                options: durationOptions,
                                value: duration,
                                onChange: onDurationChange
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                lineNumber: 190,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterGroup, {
                                label: "Sort by",
                                options: sortOptions,
                                value: sortBy,
                                onChange: onSortByChange
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                lineNumber: 196,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                        lineNumber: 183,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 flex items-center justify-between border-t border-n8 pt-4",
                        children: [
                            hasActiveFilters ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onReset,
                                className: "font-heading text-sm font-medium text-n6 transition-colors hover:text-n3",
                                children: "Reset all"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                lineNumber: 206,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                lineNumber: 213,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsOpen(false),
                                className: "rounded-lg bg-qube-blue px-5 py-2 font-heading text-sm font-medium text-white transition-colors hover:bg-qube-blue/80",
                                children: "Apply"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                                lineNumber: 215,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                        lineNumber: 204,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 160,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
            lineNumber: 151,
            columnNumber: 9
        }, this)
    }, void 0, false);
}
function FilterTrigger({ activeCount, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        "aria-label": "Filters",
        className: "flex items-center gap-2 rounded-lg border border-n8 bg-n9/80 px-4 py-2 font-heading text-sm font-medium text-n3 backdrop-blur-sm transition-colors hover:border-n7 hover:bg-n8/80",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: "Filters"
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SlidersIcon, {}, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            activeCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-qube-blue text-[10px] font-bold text-white",
                children: activeCount
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
                lineNumber: 242,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx",
        lineNumber: 234,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomeContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/src/components/Hero.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$components$2f$VideoRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/src/components/VideoRow.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$components$2f$FilterBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/workspace/sonarqube-tv/src/components/FilterBar.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function parseDurationMinutes(duration) {
    const parts = duration.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
    if (parts.length === 2) return parts[0] + parts[1] / 60;
    return 0;
}
function isWithinDateRange(dateStr, filter) {
    if (filter === "anytime") return true;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    switch(filter){
        case "today":
            return diffDays < 1;
        case "this-week":
            return diffDays < 7;
        case "this-month":
            return diffDays < 30;
        case "this-year":
            return diffDays < 365;
        default:
            return true;
    }
}
function matchesDuration(duration, filter) {
    if (filter === "any") return true;
    const mins = parseDurationMinutes(duration);
    switch(filter){
        case "short":
            return mins < 4;
        case "medium":
            return mins >= 4 && mins <= 20;
        case "long":
            return mins > 20;
        default:
            return true;
    }
}
function HomeContent({ categories, videos, featuredVideo }) {
    const [uploadDate, setUploadDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("anytime");
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("any");
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("newest");
    const [filterOpen, setFilterOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasActiveFilters = uploadDate !== "anytime" || duration !== "any" || sortBy !== "newest";
    const filteredVideos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const result = videos.filter((v)=>isWithinDateRange(v.publishedAt, uploadDate) && matchesDuration(v.duration, duration));
        result.sort((a, b)=>{
            const dateA = new Date(a.publishedAt).getTime();
            const dateB = new Date(b.publishedAt).getTime();
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });
        return result;
    }, [
        videos,
        uploadDate,
        duration,
        sortBy
    ]);
    const getVideosByCategory = (slug)=>filteredVideos.filter((v)=>v.category === slug);
    const reset = ()=>{
        setUploadDate("anytime");
        setDuration("any");
        setSortBy("newest");
    };
    const activeFilterCount = [
        uploadDate !== "anytime",
        duration !== "any",
        sortBy !== "newest"
    ].filter(Boolean).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$components$2f$Hero$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                video: featuredVideo,
                actions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$components$2f$FilterBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FilterTrigger"], {
                    activeCount: activeFilterCount,
                    onClick: ()=>setFilterOpen(true)
                }, void 0, false, {
                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
                    lineNumber: 109,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$components$2f$FilterBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        uploadDate: uploadDate,
                        duration: duration,
                        sortBy: sortBy,
                        onUploadDateChange: setUploadDate,
                        onDurationChange: setDuration,
                        onSortByChange: setSortBy,
                        onReset: reset,
                        hasActiveFilters: hasActiveFilters,
                        isOpen: filterOpen,
                        onOpenChange: setFilterOpen
                    }, void 0, false, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6 pt-4 pb-12",
                        children: [
                            categories.map((category)=>{
                                const categoryVideos = getVideosByCategory(category.slug);
                                if (categoryVideos.length === 0 && hasActiveFilters) return null;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$src$2f$components$2f$VideoRow$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    title: category.title,
                                    categorySlug: category.slug,
                                    videos: categoryVideos
                                }, category.slug, false, {
                                    fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, this);
                            }),
                            hasActiveFilters && filteredVideos.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-4 py-16 text-center sm:px-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-heading text-lg text-n6",
                                        children: "No videos match your filters."
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$workspace$2f$sonarqube$2d$tv$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: reset,
                                        className: "mt-3 font-heading text-sm text-qube-blue hover:underline",
                                        children: "Reset filters"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/workspace/sonarqube-tv/src/components/HomeContent.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Desktop_workspace_sonarqube-tv_src_07f59991._.js.map