import { motion } from 'framer-motion';
import { Sparkles, Zap, MessageSquare, ArrowRight } from 'lucide-react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '20%', left: '10%' }}
        />
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 blur-xl"
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '60%', right: '15%' }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500/10 to-purple-500/10 blur-xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ bottom: '20%', left: '20%' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center relative z-10 px-6"
      >
        {/* Glass container with enhanced backdrop blur */}
        <div 
          className="relative rounded-3xl p-16 backdrop-blur-2xl border border-white/30 mt-8"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)'
          }}
        >
          {/* Subtle top accent */}
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="px-4 py-2 rounded-full text-xs font-medium text-white/90 border border-purple-400/30"
                 style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
              NOW SUPERCHARGED WITH AGENT MODE
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            AI that builds with you
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Experience the Model Context Protocol with our interactive AI agent. See every
            step, tool call, and reasoning process in beautiful detail.
          </motion.p>

          {/* Feature cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              {
                icon: Sparkles,
                title: "Model Context Protocol",
                description: "Experience the power of MCP with real-time agent interactions"
              },
              {
                icon: Zap,
                title: "Intelligent Processing",
                description: "Watch every step as your query gets processed by AI agents"
              },
              {
                icon: MessageSquare,
                title: "Transparent Communication",
                description: "See tool calls, reasoning steps, and knowledge retrieval in action"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="relative rounded-2xl p-6 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ 
                  y: -2,
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                       style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                    <feature.icon className="w-6 h-6 text-purple-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <button
              onClick={onStart}
              className="group relative px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center gap-3 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)'
              }}
            >
              Start MCP Experience
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>

          {/* Subtle suggestion text */}
          <motion.p
            className="text-sm text-white/50 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Try asking: <span className="text-purple-300">"What's 142 × 37?"</span> or <span className="text-cyan-300">"Calculate compound interest on $5000"</span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen; 