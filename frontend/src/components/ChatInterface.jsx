import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Sparkles, RotateCcw } from 'lucide-react';
import ChatMessage from './ChatMessage';

export default function ChatInterface({ onBack }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message.trim() })
      });

      const data = await response.json();

      const botMessage = {
        type: 'bot',
        text: data.reply,
        mcpDetails: data.mcp_details,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        mcpDetails: {
          success: false,
          steps: [
            { step: 1, action: 'Error Occurred', description: error.message, status: 'error' }
          ],
          tools_used: [],
          agent_name: 'demo-agent',
          model: 'gpt-4o-mini',
          processing_time: 'N/A',
          tokens_used: 'N/A'
        },
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  const suggestedQuestions = [
    "What's 142 × 37? Show me the calculation steps",
    "Calculate the compound interest on $5000 at 3.5% for 7 years",
    "Find the square root of 2048 and explain the method",
    "What's 15% of 890 plus 25% of 340?",
    "Solve: (125 + 75) ÷ 8 × 3 - 12",
    "Calculate how many days are in 5 years and 7 months"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with proper margins */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-4 mb-6 sticky top-4 z-10"
      >
        <div className="glass-strong p-4 rounded-2xl">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="btn btn-secondary p-2 hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-electric-alt" />
                  MCP Chat
                </h1>
                <p className="text-white/70 text-sm">AI Agent with Model Context Protocol</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="btn btn-secondary gap-2 hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6">
        <AnimatePresence>
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="glass-electric p-8 mb-8 rounded-2xl">
                <Sparkles className="w-16 h-16 text-electric-alt mx-auto mb-4 pulse-glow" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Ready to explore MCP?
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Ask me anything! I'll show you exactly how your query gets processed 
                  using the Model Context Protocol.
                </p>
                
                {/* Enhanced Suggested Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestedQuestions.map((question, index) => (
                    <motion.button
                      key={question}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setMessage(question)}
                      className="glass-electric p-4 text-left text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:scale-105 group"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-electric-alt text-lg opacity-60 group-hover:opacity-100 transition-opacity">"</span>
                        <span className="text-sm leading-relaxed">{question}</span>
                        <span className="text-electric-alt text-lg opacity-60 group-hover:opacity-100 transition-opacity">"</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="space-y-4 pb-6">
          {messages.filter(msg => msg).map((msg, index) => (
            <ChatMessage
              key={msg.timestamp || index}
              message={msg}
            />
          ))}
          
          {isLoading && <ChatMessage isLoading={true} />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Perfect Message Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky bottom-0 mx-4 mb-4"
      >
        <div className="glass-strong backdrop-blur-xl rounded-2xl p-4 max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything... Try complex calculations."
                className="w-full bg-transparent border-none outline-none text-white placeholder-white/60 resize-none py-3 px-4 rounded-xl focus:ring-2 focus:ring-purple-400/50 transition-all"
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                rows={1}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
              <div className="flex items-center justify-between mt-2 px-2">
                <span className="text-xs text-white/50">
                  ✨ Press Enter to send • Shift+Enter for new line
                </span>
                <span className="text-xs text-white/50 tabular-nums">
                  {message.length}/500
                </span>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              className="btn-primary p-3 rounded-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 