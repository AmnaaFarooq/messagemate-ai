import { useRef, useState, type DragEvent } from "react";
import { FiMic, FiTrash2, FiUpload } from "react-icons/fi";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";

const MAX_CHARACTERS = 4000;

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function MessageInput({ value, onChange }: MessageInputProps) {
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isSupported: micSupported, isListening, start, stop } = useSpeechToText((transcript) => {
    onChange(value ? `${value} ${transcript}` : transcript);
  });

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const overLimit = charCount > MAX_CHARACTERS;

  function readFile(file: File) {
    if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
      showToast("Only plain text files are supported", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-2xl border bg-surface p-1 transition-colors dark:bg-surface-dark",
        isDragging ? "border-brand-500" : "border-border dark:border-border-dark"
      )}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        aria-label="Message to rewrite"
        rows={7}
        className="w-full resize-none rounded-xl bg-transparent p-4 text-[15px] leading-relaxed text-ink placeholder:text-muted focus:outline-none dark:text-ink-dark dark:placeholder:text-muted-dark"
      />

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-brand-50/90 dark:bg-brand-700/20">
          <p className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-300">
            <FiUpload /> Drop your text file
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 dark:border-border-dark">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "font-mono text-xs",
              overLimit ? "text-red-500" : "text-muted dark:text-muted-dark"
            )}
          >
            {charCount}/{MAX_CHARACTERS} chars · {wordCount} words
          </span>
        </div>

        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) readFile(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload a text file"
            aria-label="Upload a text file"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-canvas hover:text-ink dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-ink-dark"
          >
            <FiUpload className="h-4 w-4" />
          </button>

          {micSupported && (
            <button
              onClick={() => (isListening ? stop() : start())}
              title={isListening ? "Stop dictation" : "Dictate your message"}
              aria-label={isListening ? "Stop dictation" : "Dictate your message"}
              className={cn(
                "rounded-lg p-2 transition-colors",
                isListening
                  ? "animate-pulse bg-red-500 text-white"
                  : "text-muted hover:bg-canvas hover:text-ink dark:text-muted-dark dark:hover:bg-canvas-dark dark:hover:text-ink-dark"
              )}
            >
              <FiMic className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => onChange("")}
            title="Clear message"
            aria-label="Clear message"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-canvas hover:text-red-500 dark:text-muted-dark dark:hover:bg-canvas-dark"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
