import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";

const iconMap = {
  success: <FiCheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
  error: <FiAlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
  info: <FiInfo className="h-5 w-5 text-brand-500 shrink-0" />,
};

export function Toaster() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "animate-fade-in flex items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 shadow-soft dark:border-border-dark dark:bg-surface-dark dark:shadow-softDark"
          )}
        >
          {iconMap[toast.variant]}
          <p className="flex-1 text-sm text-ink dark:text-ink-dark">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
