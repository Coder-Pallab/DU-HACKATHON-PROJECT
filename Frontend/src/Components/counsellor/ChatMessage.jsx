import { Bot, User } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

function ChatMessage({ message }) {
  const { t } = useLanguage();
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-teal-100 text-teal-700"
            : "bg-teal-700 text-white"
        }`}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* Message content */}
      <div
        className={`flex max-w-[85%] flex-col gap-1 sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-teal-700 text-white"
              : "rounded-tl-sm border border-gray-100 bg-white text-gray-700 shadow-sm"
          }`}
        >
          {t(message.text, message.text)}
        </div>

        {message.time && (
          <span className="px-1 text-xs text-gray-400">
            {t(message.time, message.time)}
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
