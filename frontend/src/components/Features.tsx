import {
  FiZap,
  FiShield,
  FiRefreshCw,
  FiMic,
  FiClock,
  FiDownload,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: FiZap,
    title: "One-click rewrites",
    description: "Paste a message, pick a tone, get a polished version instantly.",
  },
  {
    icon: FiRefreshCw,
    title: "9 tones to choose from",
    description: "Professional, Friendly, Formal, Boss, Client, and more — pick what fits.",
  },
  {
    icon: FiMic,
    title: "Speak it instead",
    description: "Dictate your message with voice input when typing isn't convenient.",
  },
  {
    icon: FiClock,
    title: "Rewrite history",
    description: "Every rewrite is saved locally so you can revisit or reuse it later.",
  },
  {
    icon: FiDownload,
    title: "Export anytime",
    description: "Download a rewrite as a text file or your whole history as JSON.",
  },
  {
    icon: FiShield,
    title: "Meaning preserved",
    description: "The AI improves tone and grammar without inventing new information.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="mb-12 max-w-xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need, nothing you don't
        </h2>
        <p className="mt-3 text-muted dark:text-muted-dark">
          MessageMate stays out of your way — paste, pick, send.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-border bg-surface p-6 transition-transform duration-150 hover:-translate-y-1 dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-700/20 dark:text-brand-300">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted dark:text-muted-dark">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
