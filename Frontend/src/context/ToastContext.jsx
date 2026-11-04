import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { ToastContext } from "./ToastContextObject";
const TOAST_DURATION = 5000;

const toastStyles = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-white text-emerald-900",
    iconClassName: "text-emerald-600",
    role: "status",
  },
  error: {
    icon: CircleAlert,
    className: "border-red-200 bg-white text-red-900",
    iconClassName: "text-red-600",
    role: "alert",
  },
  info: {
    icon: Info,
    className: "border-sky-200 bg-white text-sky-900",
    iconClassName: "text-sky-600",
    role: "status",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const lastToast = useRef({ key: "", timestamp: 0 });

  const dismiss = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = "info", message, duration = TOAST_DURATION }) => {
      if (typeof message !== "string" || !message.trim()) return;
      const safeType = toastStyles[type] ? type : "info";
      const dedupeKey = `${safeType}:${message.trim()}`;
      const now = Date.now();
      if (lastToast.current.key === dedupeKey && now - lastToast.current.timestamp < 1500) {
        return;
      }
      lastToast.current = { key: dedupeKey, timestamp: now };

      const id = `${now}-${Math.random().toString(36).slice(2)}`;
      setToasts((current) => [...current.slice(-3), { id, type: safeType, message: message.trim() }]);
      timers.current.set(
        id,
        window.setTimeout(() => dismiss(id), duration)
      );
    },
    [dismiss]
  );

  useEffect(() => {
    const activeTimers = timers.current;
    const handleToast = (event) => showToast(event.detail || {});
    window.addEventListener("disha:toast", handleToast);
    return () => {
      window.removeEventListener("disha:toast", handleToast);
      for (const timer of activeTimers.values()) window.clearTimeout(timer);
      activeTimers.clear();
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3"
      >
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              role={style.role}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${style.className}`}
            >
              <Icon size={20} className={`mt-0.5 shrink-0 ${style.iconClassName}`} />
              <p className="min-w-0 flex-1 text-sm leading-5">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
