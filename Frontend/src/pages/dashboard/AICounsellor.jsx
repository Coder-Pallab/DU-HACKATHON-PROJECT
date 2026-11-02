import { useState } from "react";
import { Sparkles, Bot } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

import PageHeader from "../../Components/layout/PageHeader";
import ChatWindow from "../../Components/counsellor/ChatWindow";
import ChatInput from "../../Components/counsellor/ChatInput";
import SuggestedQuestions from "../../Components/counsellor/SuggestedQuestion";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Hello! Welcome to Disha AI Counsellor. How can I help you with your career journey today?",
    time: "Just now",
  },
];

function AICounsellor() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  // Send a message
  const handleSendMessage = (text) => {
    if (!text.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulated AI response (frontend demo only)
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: "That's a great question! To make a good career decision, start by identifying your interests, strengths and skills. Explore different career paths and create a learning plan based on your goals.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="AI Career Counsellor"
        description="Get guidance, explore career opportunities and plan your professional journey."
      />

      {/* Introduction card */}
      <div className="flex flex-col gap-4 rounded-2xl bg-teal-700 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Sparkles size={25} />
          </div>

          <div>
            <h2 className="text-lg font-semibold sm:text-xl">
              {t("Your Personal Career Guide")}
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-relaxed text-teal-50">
              {t("Explore career paths, understand required skills and discover learning opportunities.")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-teal-50">
          <span className="h-2 w-2 rounded-full bg-green-300" />
          <span>{t("Demo Mode")}</span>
        </div>
      </div>

      {/* Chat interface */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-200 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
            <Bot size={21} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              {t("Disha AI Assistant")}
            </h3>

            <p className="text-xs text-green-600">
              {t("Career guidance assistant")}
            </p>
          </div>
        </div>

        <ChatWindow
          messages={messages}
          isTyping={isTyping}
        />

        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping}
        />
      </div>

      {/* Suggested questions */}
      {!isTyping && messages.length <= 1 && (
        <SuggestedQuestions onSelect={handleSendMessage} />
      )}

      <p className="text-center text-xs text-gray-400">
        {t("Disha AI Counsellor is currently running in frontend demo mode. Responses are predefined sample messages.")}
      </p>
    </div>
  );
}

export default AICounsellor;
