import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiGithub } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { TONE_OPTIONS } from "@/lib/tones";
import { trackEvent } from "@/lib/analytics";

const DEMO_ORIGINAL = "im sick today cant come in";
const DEMO_REWRITES: Record<string, string> = {
  Friendly: "Hey! I'm not feeling well today, so I won't be able to make it in.",
  Professional:
    "Hello, I am feeling unwell today and won't be able to come in. I apologize for the inconvenience.",
  Formal:
    "Dear Sir/Madam, I am unwell today and therefore unable to attend. Thank you for your understanding.",
};

const DEMO_TONES = Object.keys(DEMO_REWRITES);

export function Hero() {
  const navigate = useNavigate();
  const [toneIndex, setToneIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const activeTone = DEMO_TONES[toneIndex];

  // Typewriter effect that cycles through a few tones — this *is* the
  // product's core action, so the hero shows it happening rather than
  // describing it.
  useEffect(() => {
    const fullText = DEMO_REWRITES[activeTone];
    let i = 0;
    setDisplayed("");
    const typeInterval = window.setInterval(() => {
      i += 1;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) {
        window.clearInterval(typeInterval);
        window.setTimeout(() => {
          setToneIndex((prev) => (prev + 1) % DEMO_TONES.length);
        }, 1800);
      }
    }, 18);
    return () => window.clearInterval(typeInterval);
  }, [activeTone]);

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-3xl dark:opacity-25"
        style={{
          background:
            "radial-gradient(circle, var(--tone-professional) 0%, var(--tone-friendly) 45%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted shadow-soft dark:border-border-dark dark:bg-surface-dark dark:text-muted-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            9 tones, one click
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Rewrite Any Message
            <br />
            in <span className="text-brand-500">Seconds</span>
          </h1>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted dark:text-muted-dark">
            Turn casual messages into professional communication using AI.
            Paste, pick a tone, done.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => { trackEvent("try_free_click", { location: "hero" }); navigate("/app"); }}>
              Try Free <FiArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <FiGithub className="h-4 w-4" /> GitHub
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {TONE_OPTIONS.slice(0, 6).map((tone) => (
              <span
                key={tone.id}
                className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: tone.colorVar }}
              >
                {tone.label}
              </span>
            ))}
            <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted dark:border-border-dark dark:text-muted-dark">
              +3 more
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft dark:border-border-dark dark:bg-surface-dark dark:shadow-softDark">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
              Original
            </p>
            <p className="rounded-xl bg-canvas px-4 py-3 font-mono text-sm text-ink dark:bg-canvas-dark dark:text-ink-dark">
              {DEMO_ORIGINAL}
            </p>

            <div className="my-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-border dark:bg-border-dark" />
              <span
                key={activeTone}
                className="animate-fade-in rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{
                  backgroundColor:
                    TONE_OPTIONS.find((t) => t.label === activeTone)?.colorVar ?? "var(--tone-professional)",
                }}
              >
                {activeTone}
              </span>
              <div className="h-px flex-1 bg-border dark:bg-border-dark" />
            </div>

            <p className="min-h-[92px] rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm leading-relaxed text-ink dark:border-brand-700/40 dark:bg-brand-700/10 dark:text-ink-dark">
              {displayed}
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-brand-500 align-middle" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
