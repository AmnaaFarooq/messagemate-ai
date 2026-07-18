import { TONE_OPTIONS } from "@/lib/tones";

const EXAMPLE_ORIGINAL = "I'm sick today can't come.";

const EXAMPLE_REWRITES: Record<string, string> = {
  professional:
    "Hello, I am feeling unwell today and won't be able to come in. I apologize for the inconvenience.",
  friendly: "Hey! I'm not feeling well today, so I won't be able to make it.",
  formal:
    "Dear Sir/Madam, I am unwell today and therefore unable to attend. Thank you for your understanding.",
  boss: "Good morning. I'm feeling sick today and won't be able to come to work. I'll keep you updated regarding my recovery.",
  client:
    "Hello, I hope you're doing well. Unfortunately, I'm unwell today and won't be able to proceed as planned. Thank you for your understanding.",
};

export function Examples() {
  return (
    <section id="examples" className="bg-surface py-20 dark:bg-surface-dark">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-12 max-w-xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            One message, five tones
          </h2>
          <p className="mt-3 text-muted dark:text-muted-dark">
            The same sentence, rewritten for whoever's on the other end.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-dashed border-border p-5 dark:border-border-dark">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
            Original
          </p>
          <p className="font-mono text-sm">{EXAMPLE_ORIGINAL}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(EXAMPLE_REWRITES).map(([toneId, text]) => {
            const tone = TONE_OPTIONS.find((t) => t.id === toneId);
            return (
              <div
                key={toneId}
                className="rounded-2xl border border-border bg-canvas p-5 dark:border-border-dark dark:bg-canvas-dark"
              >
                <span
                  className="mb-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: tone?.colorVar ?? "var(--tone-professional)" }}
                >
                  {tone?.label ?? toneId}
                </span>
                <p className="text-sm leading-relaxed text-ink dark:text-ink-dark">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
