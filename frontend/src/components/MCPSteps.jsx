import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap,
  MessageSquare,
  Cpu,
  Settings,
  Info
} from 'lucide-react';

const stepIcons = {
  'Message Received': MessageSquare,
  'Agent Invocation': Cpu,
  'Tool Execution': Zap,
  'Response Generation': Settings,
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

export default function MCPSteps({ steps, toolsUsed, agentInfo, isExpanded, onToggle }) {
  if (!steps || steps.length === 0) return null;

  const hasTools = toolsUsed && toolsUsed.length > 0;
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const hasErrors = steps.some(step => step.status === 'error');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="glass-electric rounded-xl mt-3 overflow-hidden"
    >
      {/* Compact Header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-electric-alt" />
          <span className="text-sm font-medium text-white">MCP Processing Details</span>
          
          {/* Compact Status Indicators */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-white/70">
              <span>{completedSteps}/{steps.length} steps</span>
            </div>
            
            {hasTools && (
              <div className="flex items-center gap-1 text-xs text-electric-alt">
                <Zap className="w-3 h-3" />
                <span>{toolsUsed.length} tool{toolsUsed.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {hasErrors && (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            
            {!hasErrors && completedSteps === steps.length && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/60" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10"
          >
            <div className="p-3 space-y-3">
              {/* Compact Agent Info */}
              <div className="flex items-center gap-4 text-xs text-white/70">
                <span><strong className="text-white">Agent:</strong> {agentInfo?.agent_name || 'Unknown'}</span>
                <span><strong className="text-white">Model:</strong> {agentInfo?.model || 'Unknown'}</span>
                <span><strong className="text-white">Time:</strong> {agentInfo?.processing_time || 'N/A'}</span>
              </div>

              {/* Compact Processing Steps */}
              <div className="space-y-1">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <StepIcon action={step.action} status={step.status} />
                    <span className="text-sm text-white/90 flex-1">{step.action}</span>
                    {step.description && (
                      <div className="group relative">
                        <Info className="w-3 h-3 text-white/50 cursor-help" />
                        <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block z-10 w-64 p-2 bg-black/90 backdrop-blur-sm rounded-lg text-xs text-white/90 border border-white/20">
                          {step.description}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Compact Tools Used */}
              {hasTools && (
                <div className="border-t border-white/10 pt-3">
                  <div className="text-xs font-medium text-white/90 mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-electric-alt" />
                    Tools Used
                  </div>
                  <div className="space-y-1">
                    {toolsUsed.map((tool, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          tool.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <span className="text-sm text-white/90 flex-1">{tool.name}</span>
                        {tool.description && (
                          <div className="group relative">
                            <Info className="w-3 h-3 text-white/50 cursor-help" />
                            <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block z-10 w-64 p-2 bg-black/90 backdrop-blur-sm rounded-lg text-xs text-white/90 border border-white/20">
                              {tool.description}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 