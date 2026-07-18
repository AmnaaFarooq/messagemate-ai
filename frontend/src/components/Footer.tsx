import { FiGithub, FiMessageSquare } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="border-t border-border dark:border-border-dark">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted dark:text-muted-dark sm:flex-row sm:px-8">
        <div className="flex items-center gap-2 font-display font-semibold text-ink dark:text-ink-dark">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500 text-white">
            <FiMessageSquare className="h-3.5 w-3.5" />
          </span>
          MessageMate AI
        </div>
        <p>Built for people who write a lot of messages, fast.</p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 transition-colors hover:text-ink dark:hover:text-ink-dark"
        >
          <FiGithub className="h-4 w-4" /> Source
        </a>
      </div>
    </footer>
  );
}
