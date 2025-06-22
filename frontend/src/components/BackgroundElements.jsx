import React from 'react';

const BackgroundElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl animate-pulse" 
           style={{ animationDelay: '0s', animationDuration: '8s' }} />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/10 to-green-500/10 blur-3xl animate-pulse" 
           style={{ animationDelay: '2s', animationDuration: '10s' }} />
      <div className="absolute top-1/2 left-3/4 w-64 h-64 rounded-full bg-gradient-to-r from-green-500/10 to-purple-500/10 blur-3xl animate-pulse" 
           style={{ animationDelay: '4s', animationDuration: '12s' }} />
      
      {/* Medium floating elements */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-purple-500/5 blur-2xl float" />
      <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-cyan-500/5 blur-2xl float" 
           style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-green-500/5 blur-xl float" 
           style={{ animationDelay: '6s' }} />
      
      {/* Geometric shapes */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-transparent rotate-45 blur-sm float" />
      <div className="absolute bottom-10 right-10 w-12 h-12 bg-gradient-to-br from-cyan-500/10 to-transparent rotate-12 blur-sm float" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-10 w-8 h-8 bg-gradient-to-br from-green-500/10 to-transparent rotate-45 blur-sm float" 
           style={{ animationDelay: '4s' }} />
      
      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '100px 100px'
             }} />
      </div>
      
      {/* Animated light rays */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse" 
           style={{ animationDelay: '1s', animationDuration: '6s' }} />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-pulse" 
           style={{ animationDelay: '3s', animationDuration: '8s' }} />
      <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-pulse" 
           style={{ animationDelay: '5s', animationDuration: '10s' }} />
    </div>
  );
};

export default BackgroundElements; 