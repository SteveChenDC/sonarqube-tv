import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  courses,
  getCourseBySlug,
  getCourseVideos,
  getCourseTotalDuration,
} from "@/data/courses";
import CourseTimeline from "@/components/CourseTimeline";
import CourseSidebar from "@/components/CourseSidebar";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};

  return {
    title: `${course.title} | Sonar.tv`,
    description: course.description,
    openGraph: {
      title: `${course.title} | Sonar.tv`,
      description: course.description,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${course.title} — SonarQube certification course on Sonar.tv`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | Sonar.tv`,
      description: course.description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `/courses/${slug}`,
    },
  };
}

const difficultyStyles = {
  beginner: "bg-qube-blue/15 text-qube-blue border-qube-blue/30",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  advanced: "bg-sonar-red/15 text-sonar-red border-sonar-red/30",
} as const;

const difficultyLabels = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

const BASE_URL = "https://stevechendc.github.io/sonarqube-tv";

const educationalLevelMap: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default async function CourseDetailPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const totalVideos = getCourseVideos(course).length;
  const duration = getCourseTotalDuration(course);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `${BASE_URL}/courses/${course.slug}`,
    educationalLevel: educationalLevelMap[course.difficulty] ?? course.difficulty,
    teaches: course.learningOutcomes,
    numberOfCredits: totalVideos,
    audience: {
      "@type": "Audience",
      audienceType: course.targetAudience,
    },
    provider: {
      "@type": "Organization",
      name: "SonarSource",
      url: "https://www.sonarsource.com",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${duration.replace(/h\s*/, "H").replace(/m$/, "M")}`,
      instructor: {
        "@type": "Organization",
        name: "SonarSource",
        url: "https://www.sonarsource.com",
      },
    },
    syllabusSections: course.modules.map((module) => ({
      "@type": "Syllabus",
      name: module.title,
      description: module.description,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: `${BASE_URL}/courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: course.title,
        item: `${BASE_URL}/courses/${course.slug}`,
      },
    ],
  };

  return (
    <div className="pt-20 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/courses"
          className="group mb-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-2 font-heading text-sm text-n5 transition-colors hover:bg-n8/40 hover:text-n1 -ml-3"
        >
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          All Courses
        </Link>

        {/* Two-column layout */}
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          {/* Main content */}
          <div className="min-w-0">
            {/* Course header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-heading text-xs font-semibold uppercase tracking-wider ${difficultyStyles[course.difficulty]}`}
                >
                  {difficultyLabels[course.difficulty]}
                </span>
                <span className="rounded-full border border-n7/30 bg-n8/50 px-2.5 py-0.5 font-heading text-xs font-medium text-n4">
                  {course.shortTitle}
                </span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-n1 sm:text-3xl lg:text-4xl">
                {course.title}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-n3">
                {course.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-n5">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  {course.modules.length} modules
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  {totalVideos} videos
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {duration}
                </span>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="mb-8 rounded-xl border border-n8 bg-n8/10 p-5 sm:p-6">
              <h2 className="font-heading text-base font-bold text-n1 mb-4">
                What you&apos;ll learn
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {course.learningOutcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-2.5">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-qube-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm leading-relaxed text-n3">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course content / Syllabus */}
            <div className="mb-8">
              <h2 className="font-heading text-base font-bold text-n1 mb-4">
                Course Content
              </h2>
              <CourseTimeline course={course} />
            </div>

            {/* Target audience */}
            <div className="rounded-xl border border-n8 bg-n8/10 p-5 sm:p-6">
              <h2 className="font-heading text-base font-bold text-n1 mb-2">
                Who this course is for
              </h2>
              <div className="flex items-start gap-2.5">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-n6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span className="text-sm leading-relaxed text-n3">
                  {course.targetAudience}
                </span>
              </div>
            </div>
          </div>

          {/* Sticky sidebar */}
          <div className="hidden lg:block">
            <CourseSidebar course={course} />
          </div>
        </div>

        {/* Mobile sticky CTA (shown below content on mobile/tablet) */}
        <div className="mt-8 lg:hidden">
          <CourseSidebar course={course} />
        </div>
      </div>
    </div>
  );
}
