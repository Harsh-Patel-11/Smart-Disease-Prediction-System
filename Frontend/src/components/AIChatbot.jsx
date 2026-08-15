import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Bot,
  User,
  Send,
  X,
  Sparkles,
  RefreshCw,
  Minus,
  Maximize2,
  ChevronDown,
  Shield,
  Activity,
  Heart,
  HelpCircle
} from 'lucide-react';

export const AIChatbot = () => {
  const { sendChatMessage, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hello **${currentUser?.name || 'Patient'}**! 👋 I am your **SDPS Groq AI Medical Assistant**.\n\nHow can I help you today? You can ask me about **symptoms**, **treatment options**, **disease precautions**, or general **health & nutrition advice**!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groqPowered: true
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const quickPrompts = [
    "🏃‍♂️ Healthy weight loss tips",
    "😴 How to improve sleep quality?",
    "🥗 Daily balanced nutrition plan",
    "🤒 Fever & cold home remedies",
    "🧘 Relieving daily stress & anxiety",
    "👨‍💻 Who created & owns SDPS.ai?"
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    const conversationHistory = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content
    }));

    const result = await sendChatMessage(conversationHistory);

    setIsTyping(false);

    const botMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: result.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groqPowered: result.groqPowered
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: `Chat history cleared. How can I assist you with your health today, **${currentUser?.name || 'Patient'}**?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groqPowered: true
      }
    ]);
  };

  // List of common non-medical stop words and conversational phrases that should never be bolded
  const TRIVIAL_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what', 'why', 'how', 'when', 'where',
    'which', 'this', 'that', 'these', 'those', 'then', 'so', 'than', 'such', 'both', 'through', 'about',
    'for', 'is', 'are', 'was', 'were', 'of', 'while', 'during', 'to', 'from', 'in', 'on', 'at', 'by', 'with',
    'you', 'your', 'yours', 'it', 'its', 'they', 'their', 'them', 'we', 'our', 'he', 'him', 'his', 'she', 'her', 'i', 'me', 'my',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'can', 'could', 'should', 'would', 'may', 'might', 'must', 'shall', 'will',
    'you should', 'it is', 'there is', 'there are', 'make sure', 'ensure', 'please note',
    'very', 'also', 'just', 'more', 'most', 'some', 'any', 'all', 'only',
    'take', 'taking', 'get', 'getting', 'use', 'using', 'need', 'needs',
    'good', 'well', 'help', 'helps', 'please', 'daily', 'regularly', 'often', 'sometimes'
  ]);

  const sanitizeAndHighlightKeywords = (text) => {
    if (!text) return '';

    // Convert raw single bullet asterisks at line starts so they don't get misparsed as italics
    let processed = text.replace(/^(\s*)\*\s+/gm, '$1• ');

    // Process **bold** keywords: only keep genuine medical keywords and section headers bolded
    processed = processed.replace(/\*\*(.*?)\*\*/g, (fullMatch, keyword) => {
      const trimmed = keyword.trim();
      if (!trimmed) return '';
      const lower = trimmed.toLowerCase();
      
      // If it's a trivial stop word or filler phrase, remove the bold markup
      if (TRIVIAL_WORDS.has(lower) || TRIVIAL_WORDS.has(trimmed)) {
        return trimmed;
      }
      
      // Highlight genuine primary keywords with a clean, high-contrast bold badge
      return `<strong class="font-extrabold text-slate-900 bg-indigo-50/80 text-indigo-950 px-1 py-0.5 rounded border border-indigo-200/60 shadow-2xs">${trimmed}</strong>`;
    });

    // Process *italics* cleanly without bolding them
    processed = processed.replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '<em class="italic text-slate-600 font-normal">$1</em>');

    return processed;
  };

  const formatMarkdown = (text) => {
    if (!text) return '';
    const formatted = sanitizeAndHighlightKeywords(text);
    const lines = formatted.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 3: ### Heading
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-extrabold text-xs text-indigo-950 mt-2.5 mb-1 flex items-center gap-1.5 border-b border-slate-200/60 pb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
            <span dangerouslySetInnerHTML={{ __html: trimmed.replace(/^###\s*/, '') }} />
          </h4>
        );
      }

      // Heading 2: ## Heading
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-extrabold text-sm text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5 border-b border-indigo-200/80 pb-1">
            <span dangerouslySetInnerHTML={{ __html: trimmed.replace(/^##\s*/, '') }} />
          </h3>
        );
      }

      // Bullet points: • or -
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-1 my-1 text-slate-800 font-medium">
            <span className="text-indigo-500 font-bold mt-0.5 shrink-0 text-sm leading-none">•</span>
            <span className="flex-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: trimmed.replace(/^[•-]\s*/, '') }} />
          </div>
        );
      }

      // Numbered lists: 1. 2. 3.
      if (/^\d+\.\s+/.test(trimmed)) {
        const num = trimmed.match(/^(\d+)\.\s+/)[1];
        const content = trimmed.replace(/^\d+\.\s+/, '');
        return (
          <div key={idx} className="flex items-start gap-2 ml-1 my-1 text-slate-800 font-medium">
            <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-extrabold text-[10px] shrink-0 mt-0.5">{num}</span>
            <span className="flex-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        );
      }

      // Empty line
      if (trimmed === '') {
        return <div key={idx} className="h-1.5" />;
      }

      // Normal paragraph
      return (
        <p key={idx} className="leading-relaxed my-1 font-medium text-slate-800">
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all group flex items-center gap-3 border border-white/20 cursor-pointer"
          title="Open Groq AI Medical Chatbot"
        >
          <div className="relative">
            <Bot className="w-7 h-7 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </div>
          <span className="hidden md:inline font-extrabold text-sm pr-1">Ask SDPS AI</span>
        </button>
      )}

      {/* Minimized Dock Bar */}
      {isOpen && isMinimized && (
        <div
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-white border border-slate-200/90 text-slate-900 shadow-xl backdrop-blur-xl flex items-center gap-3 cursor-pointer hover:border-indigo-300 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              Groq AI Assistant <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Click to expand chat window</p>
          </div>
          <Maximize2 className="w-4 h-4 text-slate-400 ml-2" />
        </div>
      )}

      {/* Full Floating Chat Window */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col animate-modal-content text-slate-900">
          
          {/* Header Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-0.5 shadow-xs">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">SDPS Health AI</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> Groq Llama-3.3
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-indigo-600" /> Medical & Wellness Assistant
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Minimize Window"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Close Window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1.5 ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <div className={`p-3.5 rounded-2xl text-xs ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-500/20'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-xs'
                  }`}>
                    {msg.role === 'assistant' ? formatMarkdown(msg.content) : <p className="font-semibold">{msg.content}</p>}
                  </div>

                  <div className={`flex items-center gap-1.5 text-[9px] text-slate-400 px-1 font-medium ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {msg.groqPowered && (
                      <span className="text-emerald-700 font-bold">• Groq AI</span>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/90 text-slate-500 text-xs flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span className="font-bold">Groq AI is analyzing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-white border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                disabled={isTyping}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Groq AI about symptoms, medicines..."
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isTyping}
                className={`p-2.5 rounded-2xl font-bold transition-all shrink-0 cursor-pointer ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-slate-400 text-center mt-1.5 font-medium">
              AI provides general medical guidance. In emergencies, call your local ambulance.
            </p>
          </div>

        </div>
      )}
    </>
  );
};
