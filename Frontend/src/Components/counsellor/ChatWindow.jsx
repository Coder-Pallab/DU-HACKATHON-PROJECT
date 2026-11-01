import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";

const defaultMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Hello! Welcome to Disha AI Counsellor. How can I help you with your career journey today?",
    time: "10:30 AM",
  },
  {
    id: 2,
    role: "user",
    text: "I'm a computer science student. What career paths can I explore?",
    time: "10:31 AM",
  },
  {
    id: 3,
    role: "assistant",
    text: "You can explore several career paths, including Frontend Development, Backend Development, Data Science, Cybersecurity and UI/UX Design.",
    time: "10:31 AM",
  },
];

function ChatWindow({ messages = defaultMessages, isTyping = false }) {
  const messagesEndRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  return (
    <div className="flex h-[420px] min-w-0 flex-col overflow-y-auto bg-gray-50 p-4 sm:h-[500px] sm:p-5">
      {/* Chat messages */}
      <div className="flex flex-col gap-5">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-white">
            <Sparkles size={17} />
          </div>

          <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm">
            <span className="h-2 w-2 animate-bounce rounded-full bg-teal-600" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-teal-600 [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-teal-600 [animation-delay:300ms]" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;