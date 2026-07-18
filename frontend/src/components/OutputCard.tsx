import { useState } from "react";
import { FiCopy, FiCheck, FiRefreshCw, FiDownload, FiShare2 } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

interface OutputCardProps {
  result: string;
  isLoading: boolean;
  onRegenerate: () => void;
}

export function OutputCard({ result, isLoading, onRegenerate }: OutputCardProps) {
  const { showToast } = useToast();
  const [justCopied, setJustCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result);
      setJustCopied(true);
      showToast("Copied to clipboard", "success");
      window.setTimeout(() => setJustCopied(false), 1500);
    } catch {
      showToast("Couldn't copy — select and copy manually", "error");
    }
  }

  function handleDownload() {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "messagemate-rewrite.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ text: result });
      } catch {
        // user cancelled the native share sheet — nothing to do
      }
    } else {
      await navigator.clipboard.writeText(result);
      showToast("Sharing isn't supported here — copied instead", "info");
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
          Rewriting…
        </p>
        <div className="space-y-2.5">
          <div className="shimmer-bg h-4 w-full rounded bg-canvas dark:bg-canvas-dark" />
          <div className="shimmer-bg h-4 w-[92%] rounded bg-canvas dark:bg-canvas-dark" />
          <div className="shimmer-bg h-4 w-[76%] rounded bg-canvas dark:bg-canvas-dark" />
        </div>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex min-h-[180px] flex-col items-center justify-center gap-2 border-dashed p-6 text-center">
        <p className="text-sm text-muted dark:text-muted-dark">
          Your rewritten message will appear here.
        </p>
        <p className="text-xs text-muted dark:text-muted-dark">
          Type a message above and pick a tone to get started.
        </p>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in p-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted dark:text-muted-dark">
        Rewritten
      </p>
      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink dark:text-ink-dark">
        {result}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4 dark:border-border-dark">
        <Button size="sm" variant="secondary" onClick={handleCopy}>
          {justCopied ? (
            <FiCheck className="h-4 w-4 animate-pop-check text-emerald-500" />
          ) : (
            <FiCopy className="h-4 w-4" />
          )}
          {justCopied ? "Copied" : "Copy"}
        </Button>
        <Button size="sm" variant="secondary" onClick={onRegenerate}>
          <FiRefreshCw className="h-4 w-4" /> Regenerate
        </Button>
        <Button size="sm" variant="secondary" onClick={handleDownload}>
          <FiDownload className="h-4 w-4" /> Download
        </Button>
        <Button size="sm" variant="secondary" onClick={handleShare}>
          <FiShare2 className="h-4 w-4" /> Share
        </Button>
      </div>
    </Card>
  );
}
