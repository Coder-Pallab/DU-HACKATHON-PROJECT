import { useEffect, useState } from "react";
import { Bot, MessageSquarePlus, Sparkles } from "lucide-react";
import PageHeader from "../../Components/layout/PageHeader";
import ChatWindow from "../../Components/counsellor/ChatWindow";
import ChatInput from "../../Components/counsellor/ChatInput";
import SuggestedQuestions from "../../Components/counsellor/SuggestedQuestion";
import { useLanguage } from "../../hooks/useLanguage";
import { aiService } from "../../services/aiService";
import { getApiErrorMessage } from "../../services/apiClient";

function mapMessages(messages = []) {
  return messages.map((message, index) => ({
    id: message._id || `${message.createdAt || "message"}-${index}`,
    role: message.role,
    text: message.content,
    time: message.createdAt
      ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "",
  }));
}

function AICounsellor() {
  const { language: interfaceLanguage } = useLanguage();
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(interfaceLanguage === "as" ? "Assamese" : "English");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    aiService.listConversations()
      .then(async (items) => {
        if (!active) return;
        setConversations(items);
        const latest = items[0];
        if (latest) {
          const conversation = await aiService.getConversation(latest._id);
          if (!active) return;
          setConversationId(conversation._id);
          setSelectedLanguage(conversation.language || "English");
          setMessages(mapMessages(conversation.messages));
        }
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoadingHistory(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const startNewConversation = () => {
    setConversationId("");
    setMessages([]);
    setError("");
  };

  const openConversation = async (item) => {
    setError("");
    setIsLoadingHistory(true);
    try {
      const conversation = await aiService.getConversation(item._id);
      setConversationId(conversation._id);
      setSelectedLanguage(conversation.language || "English");
      setMessages(mapMessages(conversation.messages));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSendMessage = async (text) => {
    const message = text.trim();
    if (!message || isTyping) return;
    setError("");
    setIsTyping(true);
    try {
      const response = await aiService.sendMessage({
        message,
        language: selectedLanguage,
        ...(conversationId ? { conversationId } : {}),
      });
      setConversationId(response.conversationId);
      setSelectedLanguage(response.language || selectedLanguage);
      setMessages((current) => [...current, ...mapMessages(response.messages)]);
      setConversations((current) => [
        {
          _id: response.conversationId,
          title: response.title,
          language: response.language || selectedLanguage,
          lastMessageAt: response.lastMessageAt,
        },
        ...current.filter((item) => item._id !== response.conversationId),
      ]);
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return false;
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageHeader
        title="AI Career Counsellor"
        description="Ask career questions and continue previous counselling conversations in English or Assamese."
      />

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-800">Conversations</h2>
            <button type="button" onClick={startNewConversation} className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 hover:bg-teal-100">
              <MessageSquarePlus size={15} /> New
            </button>
          </div>
          {isLoadingHistory && conversations.length === 0 ? (
            <p className="text-sm text-slate-500">Loading conversations...</p>
          ) : conversations.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">No previous conversations.</p>
          ) : (
            <ul className="space-y-2">
              {conversations.map((item) => (
                <li key={item._id}>
                  <button
                    type="button"
                    onClick={() => openConversation(item)}
                    className={`w-full rounded-xl p-3 text-left transition ${conversationId === item._id ? "bg-teal-50 text-teal-900" : "hover:bg-slate-50 text-slate-700"}`}
                  >
                    <span className="block truncate text-sm font-medium">{item.title || "Career counselling"}</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.language} · {item.lastMessageAt ? new Date(item.lastMessageAt).toLocaleDateString() : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700"><Bot size={21} /></div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Disha AI Assistant</h2>
                <p className="text-xs text-slate-500">{conversationId ? "Saved conversation" : "New conversation"}</p>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span>Response language</span>
              <select value={selectedLanguage} onChange={(event) => setSelectedLanguage(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                <option value="English">English</option>
                <option value="Assamese">অসমীয়া</option>
              </select>
            </label>
          </div>

          {isLoadingHistory && messages.length === 0 ? (
            <div className="flex h-105 items-center justify-center text-sm text-slate-500">Loading conversation...</div>
          ) : messages.length === 0 ? (
            <div className="flex h-105 flex-col items-center justify-center px-6 text-center">
              <Sparkles className="mb-3 text-teal-700" size={30} />
              <h3 className="font-semibold text-slate-800">Start a career conversation</h3>
              <p className="mt-2 max-w-md text-sm text-slate-500">Your message will be answered by the existing counselling API. Choose a language and ask a question.</p>
            </div>
          ) : (
            <ChatWindow messages={messages} isTyping={isTyping} />
          )}

          <ChatInput onSend={handleSendMessage} disabled={isTyping || isLoadingHistory} />
        </section>
      </div>

      {!conversationId && !isTyping && messages.length === 0 && (
        <SuggestedQuestions onSelect={handleSendMessage} />
      )}
    </div>
  );
}

export default AICounsellor;
