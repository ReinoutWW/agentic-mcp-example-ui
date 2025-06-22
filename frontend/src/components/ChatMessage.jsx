import { motion } from 'framer-motion';
import { User, Bot, Clock, Cpu, Zap, CheckCircle, XCircle, Info, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const stepIcons = {
  'Message Received': Bot,
  'Agent Invocation': Cpu,
  'Tool Execution': Zap,
  'Response Generation': Cpu,
  'Response Delivery': CheckCircle,
  'Error Occurred': XCircle
};

const StepIcon = ({ action, status }) => {
  const IconComponent = stepIcons[action] || Clock;
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'processing': return 'text-electric-alt animate-pulse';
      default: return 'text-white/60';
    }
  };
  
  return <IconComponent className={`w-4 h-4 ${getStatusColor()}`} />;
};

export default function ChatMessage({ message, isLoading = false }) {
  const [showMCPDetails, setShowMCPDetails] = useState(false);
  
  // Handle case where message is undefined
  if (!message && !isLoading) {
    return null;
  }
  
  const isUser = message?.type === 'user';
  const isBot = message?.type === 'bot';

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4 mb-6"
      >
        <div className="glass-electric w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 pulse-glow">
          <Bot className="w-5 h-5 text-electric-alt" />
        </div>
        <div className="flex-1">
          <div className="glass-electric p-4 max-w-2xl">
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4 animate-pulse text-electric-alt" />
              <span className="text-sm">AI is thinking...</span>
            </div>
            <div className="flex gap-1 mt-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const mcpDetails = message?.mcpDetails;
  const hasTools = mcpDetails?.tools_used && mcpDetails.tools_used.length > 0;
  const completedSteps = mcpDetails?.steps ? mcpDetails.steps.filter(step => step.status === 'completed').length : 0;
  const hasErrors = mcpDetails?.steps ? mcpDetails.steps.some(step => step.status === 'error') : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex items-start gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`glass-electric w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'glow-green' : 'glow-cyan'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-electric-alt" />
        ) : (
          <Bot className="w-5 h-5 text-electric-alt" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        {/* Message Bubble */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={`glass-electric p-4 max-w-2xl ${isUser ? 'ml-auto' : ''} ${
            isUser ? 'glow-green' : 'glow-cyan'
          }`}
        >
          {/* Message Header */}
          <div className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : ''}`}>
            <span className="text-white/90 text-sm font-medium">
              {isUser ? 'You' : 'AI Assistant'}
            </span>
            {isBot && mcpDetails && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                mcpDetails.success 
                  ? 'badge-success' 
                  : 'bg-red-500/20 text-red-400 border border-red-400/30'
              }`}>
                {mcpDetails.success ? 'Success' : 'Error'}
              </span>
            )}
          </div>

          {/* Message Text */}
          <div className="text-white leading-relaxed mb-3">
            {message?.text}
          </div>

          {/* Integrated MCP Processing Details */}
          {isBot && mcpDetails && mcpDetails.steps && (
            <div className="border-t border-white/10 pt-3 mt-3">
              {/* Compact MCP Header */}
              <button
                onClick={() => setShowMCPDetails(!showMCPDetails)}
                className="flex items-center justify-between w-full p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-electric-alt" />
                  <span className="text-xs font-medium text-white/90">MCP Processing</span>
                  
                  {/* Compact Status Indicators */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <span>{completedSteps}/{mcpDetails.steps.length} steps</span>
                    </div>
                    
                    {hasTools && (
                      <div className="flex items-center gap-1 text-xs text-electric-alt">
                        <Zap className="w-3 h-3" />
                        <span>{mcpDetails.tools_used.length}</span>
                      </div>
                    )}
                    
                    {hasErrors && (
                      <XCircle className="w-3 h-3 text-red-400" />
                    )}
                    
                    {!hasErrors && completedSteps === mcpDetails.steps.length && (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    )}
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: showMCPDetails ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3 h-3 text-white/50" />
                </motion.div>
              </button>

              {/* Expandable MCP Details */}
              {showMCPDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 space-y-2"
                >
                  {/* Agent Info */}
                  <div className="flex items-center gap-4 text-xs text-white/60 px-2">
                    <span><strong className="text-white/80">Agent:</strong> {mcpDetails.agent_name || 'Unknown'}</span>
                    <span><strong className="text-white/80">Model:</strong> {mcpDetails.model || 'Unknown'}</span>
                    <span><strong className="text-white/80">Time:</strong> {mcpDetails.processing_time || 'N/A'}</span>
                  </div>

                  {/* Processing Steps */}
                  <div className="space-y-1">
                    {mcpDetails.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <StepIcon action={step.action} status={step.status} />
                        <span className="text-xs text-white/80 flex-1">{step.action}</span>
                        {step.description && (
                          <div className="group relative">
                            <Info className="w-3 h-3 text-white/40 cursor-help" />
                            <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block z-10 w-48 p-2 bg-black/90 backdrop-blur-sm rounded-lg text-xs text-white/90 border border-white/20">
                              {step.description}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Tools Used */}
                  {hasTools && (
                    <div className="border-t border-white/10 pt-2">
                      <div className="text-xs font-medium text-white/80 mb-1 flex items-center gap-1 px-2">
                        <Zap className="w-3 h-3 text-electric-alt" />
                        Tools Used
                      </div>
                      <div className="space-y-1">
                        {mcpDetails.tools_used.map((tool, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              tool.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                            }`} />
                            <span className="text-xs text-white/80 flex-1">{tool.name}</span>
                            {tool.description && (
                              <div className="group relative">
                                <Info className="w-3 h-3 text-white/40 cursor-help" />
                                <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block z-10 w-48 p-2 bg-black/90 backdrop-blur-sm rounded-lg text-xs text-white/90 border border-white/20">
                                  {tool.description}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
} 