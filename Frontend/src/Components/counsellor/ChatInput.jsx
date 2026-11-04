import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function ChatInput({ onSend, disabled = false }) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled || isSending) return;

    setIsSending(true);
    try {
      const sent = await onSend?.(trimmedMessage);
      if (sent !== false) setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 border-t border-gray-200 bg-white p-3 sm:p-4"
    >
      {/* Attachment button - UI only */}
      <button
        type="button"
        title={t("Attachment feature coming soon")}
        className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 sm:flex"
      >
        <Paperclip size={19} />
      </button>

      {/* Message input */}
      <div className="flex min-w-0 flex-1 items-center rounded-xl border border-gray-200 bg-gray-50 px-3 transition focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("Ask me anything about your career...")}
          disabled={disabled || isSending}
          className="h-11 min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
        />
      </div>

      {/* Send button */}
      <button
        type="submit"
        disabled={!message.trim() || disabled || isSending}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={t("Send message")}
      >
        <Send size={18} />
      </button>
    </form>
  );
}

export default ChatInput;
