import { useContext } from "react";
import { ToastContext } from "../context/ToastContextObject";

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    showToast,
    success: (message, options) => showToast({ ...options, type: "success", message }),
    error: (message, options) => showToast({ ...options, type: "error", message }),
    info: (message, options) => showToast({ ...options, type: "info", message }),
  };
}

export default useToast;
