import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/cn";

const FAQS = [
  {
    question: "Does it change the meaning of my message?",
    answer:
      "No. The AI is instructed to preserve your original meaning and never invent new information — it only improves tone, grammar, and phrasing.",
  },
  {
    question: "Which AI provider does this use?",
    answer:
      "MessageMate works with any OpenAI-compatible API — OpenAI, Groq, OpenRouter, Together AI, or a local Ollama model. You choose the provider in your environment configuration.",
  },
  {
    question: "Is my message data stored anywhere?",
    answer:
      "Your rewrite history is stored only in your browser's local storage. Messages sent for rewriting go directly to your configured AI provider and aren't stored on a MessageMate server.",
  },
  {
    question: "Can I use my own API key?",
    answer:
      "Yes — MessageMate is self-hosted. You provide your own API key for whichever provider you choose via environment variables.",
  },
  {
    question: "Is MessageMate free?",
    answer:
      "The app itself is free and open source. You only pay your AI provider for the tokens you use, which is typically a fraction of a cent per rewrite.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <h2 className="mb-10 text-center font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Frequently asked questions
      </h2>

      <div className="flex flex-col divide-y divide-border dark:divide-border-dark">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="py-4">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="font-display text-base font-medium">{faq.question}</span>
                <FiChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted transition-transform duration-200 dark:text-muted-dark",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              {isOpen && (
                <p className="animate-fade-in mt-3 max-w-2xl text-sm leading-relaxed text-muted dark:text-muted-dark">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
