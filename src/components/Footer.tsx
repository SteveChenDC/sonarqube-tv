export default function Footer() {
  return (
    <footer className="relative border-t border-n8/50 bg-n9 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <span className="font-heading text-lg font-semibold text-n1">
            Sonar<span className="text-qube-blue">Qube</span>
            <span className="text-n6">.tv</span>
          </span>
          <p className="text-sm text-n6">
            A video showcase for{" "}
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
        </div>
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
