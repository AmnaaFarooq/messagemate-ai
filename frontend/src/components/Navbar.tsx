import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiGithub, FiMessageSquare } from "react-icons/fi";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/app";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-canvas/80 backdrop-blur-md dark:border-border-dark/70 dark:bg-canvas-dark/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <FiMessageSquare className="h-4 w-4" />
          </span>
          MessageMate<span className="text-brand-500">AI</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition-colors hover:bg-surface sm:flex dark:border-border-dark dark:text-ink-dark dark:hover:bg-surface-dark"
          >
            <FiGithub className="h-4 w-4" />
          </a>
          <ThemeToggle />
          {!isDashboard && (
            <Button size="sm" onClick={() => navigate("/app")}>
              Try Free
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
