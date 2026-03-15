export default function Footer() {
  return (
    <footer className="relative border-t border-n7/40 bg-n9 px-4 pt-10 pb-16 sm:px-6">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-sonar-red/80 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <span className="font-heading text-lg font-semibold text-n1">
            Sonar<span className="text-qube-blue">.tv</span>
          </span>
          <p className="text-sm text-n6">
            A video showcase for{" "}
            <a
              href="https://www.sonarsource.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sonar-red underline decoration-sonar-red/40 hover:decoration-sonar-red"
            >
              SonarSource
            </a>{" "}
            content
          </p>
        </div>
        <div className="flex gap-6">
          <a
            href="https://www.youtube.com/c/SonarSource"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded font-heading text-sm text-n6 transition-colors hover:text-n1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2"
          >
            YouTube
          </a>
          <a
            href="https://github.com/SonarSource"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded font-heading text-sm text-n6 transition-colors hover:text-n1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2"
          >
            GitHub
          </a>
          <a
            href="https://www.sonarsource.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded font-heading text-sm text-n6 transition-colors hover:text-n1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-qube-blue focus-visible:outline-offset-2"
          >
            SonarSource
          </a>
        </div>
      </div>
    </footer>
  );
}
