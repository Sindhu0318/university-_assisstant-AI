"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { translations, LanguageCode } from "@/lib/i18n";
import { api, ChatMessage, Conversation, DocumentItem } from "@/lib/api";
import { speech } from "@/lib/speech";
import ChatSidebar from "@/components/chat/ChatSidebar";
import CitationCard from "@/components/chat/CitationCard";
import VoiceVisualizer from "@/components/chat/VoiceVisualizer";
import FileUploadModal from "@/components/chat/FileUploadModal";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Paperclip,
  RotateCcw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Bot,
  User as UserIcon,
  Loader2,
  FileText,
  Trash2,
  Globe,
} from "lucide-react";

function ChatInner() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");

  const { language, setLanguage, user } = useAuth();
  const t = translations[language];

  // Conversation states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // File upload state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [attachedDoc, setAttachedDoc] = useState<DocumentItem | null>(null);

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat history
  const loadHistory = async () => {
    try {
      const history = await api.getChatHistory();
      setConversations(history);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Handle prompt query param
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  // Select conversation
  const handleSelectConversation = async (convId: string) => {
    try {
      setActiveConvId(convId);
      const conv = await api.getConversation(convId);
      if (conv.messages) {
        setMessages(conv.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // New Chat
  const handleNewChat = () => {
    setActiveConvId(undefined);
    setMessages([]);
    setAttachedDoc(null);
  };

  // Delete Conversation
  const handleDeleteConversation = async (convId: string) => {
    try {
      await api.deleteConversation(convId);
      if (activeConvId === convId) {
        handleNewChat();
      }
      loadHistory();
    } catch (e) {
      console.error(e);
    }
  };

  // Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setInputValue("");
    setIsLoading(true);

    const tempUserMsg: ChatMessage = {
      message_id: "temp-" + Date.now(),
      role: "user",
      content: text,
      language,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await api.sendMessage(
        text,
        activeConvId,
        language,
        attachedDoc?.document_id
      );

      setActiveConvId(response.conversation_id);

      const asstMsg: ChatMessage = {
        message_id: response.message_id,
        role: "assistant",
        content: response.answer,
        language: response.language,
        sources: response.sources,
        suggested_followups: response.suggested_followups,
        latency_ms: response.latency_ms,
        query_intent: response.query_intent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, asstMsg]);
      loadHistory();
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        message_id: "err-" + Date.now(),
        role: "assistant",
        content: "I couldn't complete the query at this moment. Please verify backend connection or try again.",
        language,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setAttachedDoc(null);
    }
  };

  // Voice Recording
  const toggleListening = () => {
    if (isListening) {
      speech.stopListening();
      setIsListening(false);
      if (voiceTranscript.trim()) {
        handleSendMessage(voiceTranscript);
        setVoiceTranscript("");
      }
    } else {
      setIsListening(true);
      setVoiceTranscript("");
      speech.startListening(
        language,
        (transcript) => {
          setVoiceTranscript(transcript);
        },
        (error) => {
          console.error("Speech error:", error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
          if (voiceTranscript.trim()) {
            handleSendMessage(voiceTranscript);
            setVoiceTranscript("");
          }
        }
      );
    }
  };

  // Text-To-Speech Audio Playback
  const handleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      speech.stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      speech.speak(text, language, () => setSpeakingMsgId(null));
    }
  };

  // Copy response
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Feedback submit
  const handleFeedback = async (messageId: string, isHelpful: number) => {
    try {
      await api.submitFeedback(messageId, isHelpful);
      setMessages((prev) =>
        prev.map((m) =>
          m.message_id === messageId
            ? { ...m, feedback: { is_helpful: isHelpful } }
            : m
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-950 text-white relative">
      {/* Left Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Chat Header Bar */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                University Grounded Assistant
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  RAG Active
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Connected to Academic Knowledge Base & Assessments Database
              </p>
            </div>
          </div>

          {/* Quick Language Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
              {(["en", "te", "hi"] as LanguageCode[]).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => setLanguage(langCode)}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    language === langCode
                      ? "bg-blue-600 text-white shadow-sm font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {langCode === "en" ? "EN" : langCode === "te" ? "తెలుగు" : "हिंदी"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            /* Empty State / Welcome Screen */
            <div className="max-w-2xl mx-auto my-auto text-center space-y-6 pt-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  How can I help you today?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Ask me about university academic regulations, attendance policies (75%), upcoming assessments, scholarships, fees, or examination malpractice rules.
                </p>
              </div>

              {/* Sample Suggested Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
                {[
                  {
                    title: "Attendance Requirements",
                    desc: "What happens if my attendance is below 75%?",
                    prompt: "What is the attendance requirement and what happens if it is below 75%?",
                  },
                  {
                    title: "Assessment Schedule",
                    desc: "Show assessment weightages for module AAA",
                    prompt: "What assessments are available for module AAA?",
                  },
                  {
                    title: "Scholarship Eligibility",
                    desc: "How do I apply for Chancellor's Merit Scholarship?",
                    prompt: "How can I apply for a scholarship and what is the eligibility criteria?",
                  },
                  {
                    title: "Examination Rules",
                    desc: "What are the rules and penalties for exam malpractice?",
                    prompt: "What are the university examination rules and malpractice penalties?",
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 transition-all text-left group"
                  >
                    <div className="font-semibold text-xs text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Bubbles */
            messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              const isAssistant = msg.role === "assistant";

              return (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-3xl mx-auto ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-blue-500/20">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  {/* Message Bubble Body */}
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed max-w-[88%] sm:max-w-[80%] space-y-2.5 ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20"
                        : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {/* Message Content */}
                    <div className="whitespace-pre-line break-words space-y-2">
                      {msg.content}
                    </div>

                    {/* Citations Card if present */}
                    {isAssistant && msg.sources && msg.sources.length > 0 && (
                      <CitationCard citations={msg.sources} />
                    )}

                    {/* Suggested follow-up buttons */}
                    {isAssistant && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {msg.suggested_followups.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-blue-300 hover:text-white transition-colors"
                          >
                            {sug} →
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Assistant Action Bar (Speak, Copy, Feedback, Latency) */}
                    {isAssistant && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          {/* Speak Button */}
                          <button
                            onClick={() => handleSpeak(msg.message_id || String(idx), msg.content)}
                            className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                              speakingMsgId === (msg.message_id || String(idx))
                                ? "text-blue-400 font-bold"
                                : "text-slate-400 hover:text-white"
                            }`}
                            title="Play voice readout"
                          >
                            {speakingMsgId === (msg.message_id || String(idx)) ? (
                              <VolumeX className="w-3.5 h-3.5" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopy(msg.message_id || String(idx), msg.content)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Copy answer"
                          >
                            {copiedId === (msg.message_id || String(idx)) ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Feedback Thumbs */}
                          <button
                            onClick={() => handleFeedback(msg.message_id || "", 1)}
                            className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                              msg.feedback?.is_helpful === 1
                                ? "text-emerald-400"
                                : "text-slate-400 hover:text-white"
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.message_id || "", -1)}
                            className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                              msg.feedback?.is_helpful === -1
                                ? "text-red-400"
                                : "text-slate-400 hover:text-white"
                            }`}
                            title="Not Helpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {msg.latency_ms && (
                          <span className="text-[10px] text-slate-500">
                            {msg.latency_ms} ms
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 max-w-3xl mx-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>{t.thinking}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Visualizer Overlay */}
        <VoiceVisualizer
          isListening={isListening}
          transcript={voiceTranscript}
          onStop={toggleListening}
        />

        {/* File Attachment Pill Preview */}
        {attachedDoc && (
          <div className="px-6 py-1.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-blue-300 max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Analyzing uploaded document: <strong>{attachedDoc.title}</strong></span>
            </div>
            <button
              onClick={() => setAttachedDoc(null)}
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-3xl mx-auto relative flex items-center gap-2"
          >
            {/* Upload Button */}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
              title="Upload PDF or Image for Grounded Chat"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? "bg-red-600/30 border-red-500 text-red-400 animate-pulse"
                  : "bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white"
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              placeholder={t.askPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-inner"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Document Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={(doc) => setAttachedDoc(doc)}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Assistant...</div>}>
      <ChatInner />
    </Suspense>
  );
}
