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
      content: `Hello **${currentUser?.name || 'Patient'}**! 👋 I am your **SDPS Groq AI Medical Assistant**.\n\nHow can I help you today? You can ask me about symptoms, treatment options, disease precautions, or general health & nutrition advice!`,
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
    "🤒 Fever management advice",
    "🦟 Symptoms of Dengue Fever",
    "🥗 Diet recommendations during illness",
    "🚨 When to seek emergency care?"
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

  const formatMarkdown = (text) => {
    if (!text) return '';
    // Process markdown formatting: **bold**, bullets, linebreaks
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-indigo-200">$1</em>');

    const lines = formatted.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={idx} className="ml-4 list-disc space-y-0.5 text-slate-200">
            <span dangerouslySetInnerHTML={{ __html: line.replace(/^[•-]\s*/, '') }} />
          </li>
        );
      }
      if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.')) {
        return (
          <p key={idx} className="ml-2 font-medium text-slate-200 my-0.5">
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </p>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="leading-relaxed my-0.5">
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 text-white shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all group flex items-center gap-3 border border-white/20 cursor-pointer"
          title="Open Groq AI Medical Chatbot"
        >
          <div className="relative">
            <Bot className="w-7 h-7 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <span className="hidden md:inline font-bold text-sm pr-1">Ask SDPS AI</span>
        </button>
      )}

      {/* Minimized Dock Bar */}
      {isOpen && isMinimized && (
        <div
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#0a0a1a]/95 border border-indigo-500/30 text-white shadow-2xl backdrop-blur-xl flex items-center gap-3 cursor-pointer hover:border-indigo-400 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              Groq AI Assistant <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            </p>
            <p className="text-[10px] text-slate-400">Click to expand chat window</p>
          </div>
          <Maximize2 className="w-4 h-4 text-slate-400 ml-2" />
        </div>
      )}

      {/* Full Floating Chat Window */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] glass-panel rounded-3xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/60 overflow-hidden flex flex-col animate-modal-content">
          
          {/* Header Bar */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-[#0a0a1a] to-slate-900 border-b border-white/[0.08] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-[#0a0a1a] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white leading-tight">SDPS Health AI</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Groq Llama-3.3
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-indigo-400" /> Medical & Wellness Assistant
                </p>
              </div>
            </div>

            {/* Window Action Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Clear Chat History"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Minimize Window"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-[#0a0a1a]/90">
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1 ${msg.role === 'user' ? 'items-end text-right' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed text-xs shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none'
                        : 'bg-slate-900/80 border border-white/[0.08] text-slate-200 rounded-tl-none space-y-1'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p>{msg.content}</p>
                    ) : (
                      <div>{formatMarkdown(msg.content)}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 px-1 text-[10px] text-slate-500">
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded ${msg.groqPowered ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                        {msg.groqPowered ? 'Groq AI' : 'Offline Engine'}
                      </span>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            ))}

            {/* Real-Time Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] text-slate-400 rounded-tl-none flex items-center gap-2">
                  <span className="text-xs">Groq AI is thinking</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-300" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-slate-950/70 border-t border-white/[0.06] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt.replace(/^[^\s]+\s*/, ''))}
                disabled={isTyping}
                className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-indigo-500/15 border border-white/[0.08] hover:border-indigo-500/30 text-[11px] text-slate-300 hover:text-indigo-300 transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form Bar */}
          <div className="p-3 bg-[#0a0a1a] border-t border-white/[0.08] shrink-0">
            <div className="flex items-center gap-2 bg-slate-900/90 rounded-2xl border border-white/[0.08] p-1.5 focus-within:border-indigo-500/50 transition-all">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Groq AI about symptoms, diet, or medical tips..."
                rows={1}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none max-h-20"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isTyping}
                className={`p-2.5 rounded-xl transition-all ${
                  inputMessage.trim() && !isTyping
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 cursor-pointer'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 text-center mt-1.5 font-mono">
              Powered by Groq AI (Llama-3.3-70b) · Educational clinical assistance only
            </p>
          </div>

        </div>
      )}
    </>
  );
};
