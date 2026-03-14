export default function Footer() {
  return (
    <footer className="relative bg-n9 px-4 py-8 sm:px-6">
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sonar-red to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-n6">
          Sonar.tv &mdash; A video showcase for{" "}
          <a
            href="https://www.sonarsource.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-qube-blue hover:underline"
          >
            SonarSource
          </a>{" "}
          content
        </p>
        <div className="flex gap-6">
          <a
            href="https://www.youtube.com/c/SonarSource"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-sm text-n6 transition-colors hover:text-n1"
          >
            YouTube
          </a>
          <a
            href="https://github.com/SonarSource"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-sm text-n6 transition-colors hover:text-n1"
          >
            GitHub
          </a>
          <a
            href="https://www.sonarsource.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-sm text-n6 transition-colors hover:text-n1"
          >
            SonarSource
          </a>
        </div>
      </div>
    </footer>
  );
}
