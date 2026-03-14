import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold text-n1">
            Sonar<span className="text-qube-blue">Qube</span>
            <span className="text-n6">.tv</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
<Link
            href="/#categories"
            className="font-heading text-sm font-medium text-n6 transition-colors hover:text-n1"
          >
            Categories
          </Link>
        </nav>
      </div>
    </header>
  );
}
