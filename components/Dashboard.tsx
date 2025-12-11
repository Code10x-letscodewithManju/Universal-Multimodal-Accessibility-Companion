import React from 'react';
import { AppMode } from '../types';

interface DashboardProps {
  setMode: (mode: AppMode) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  delay: string;
  color: string;
  onClick: () => void;
  fullWidth?: boolean;
}> = ({ title, description, icon, delay, color, onClick, fullWidth }) => (
  <button
    onClick={onClick}
    className={`
      group relative overflow-hidden rounded-[2rem] p-[1px] text-left transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] outline-none focus:ring-4 ring-white/10
      ${fullWidth ? 'col-span-2' : 'col-span-2 md:col-span-1'}
      animate-fade-in opacity-0
    `}
    style={{ animationDelay: delay }}
  >
    {/* Gradient Border Background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />
    
    {/* Inner Content Container */}
    <div className="relative h-full bg-zinc-900/95 backdrop-blur-2xl rounded-[1.9rem] p-6 flex flex-col justify-between overflow-hidden">
      
      {/* Decorative Glow Blob */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${color} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-all duration-500`} />
      
      <div className="flex justify-between items-start mb-6 z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-800/80 text-white group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-lg`}>
          <span className="material-icons text-2xl">{icon}</span>
        </div>
        
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/10 transition-all">
           <span className="material-icons text-sm text-zinc-500 group-hover:text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300">arrow_forward</span>
        </div>
      </div>
      
      <div className="z-10">
        <h3 className="text-xl font-bold text-zinc-100 mb-2 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
        <p className="text-zinc-400 text-sm font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
          {description}
        </p>
      </div>
    </div>
  </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ setMode }) => {
  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      {/* Ambient Background Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Header Section */}
      <header className="px-8 pt-12 pb-6 z-10 flex justify-between items-start">
        <div className="space-y-3 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm text-[10px] uppercase tracking-widest font-bold text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Online</span>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-1">
              UMAC <span className="font-light text-zinc-600">OS</span>
            </h1>
            <p className="text-zinc-400 text-base max-w-[280px] leading-relaxed font-medium">
              Your multimodal bridge to the world. Select a tool to begin.
            </p>
          </div>
        </div>

        <button 
            onClick={() => setMode(AppMode.SETTINGS)}
            className="group relative p-3 rounded-full bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-95 backdrop-blur-md"
            aria-label="Settings"
        >
             <span className="material-icons text-zinc-400 group-hover:text-white transition-colors">settings</span>
        </button>
      </header>

      {/* Grid Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 z-10 custom-scrollbar">
        <div className="grid grid-cols-2 gap-4 pb-20 max-w-2xl mx-auto">
          
          <FeatureCard 
            title="Live Caption"
            description="Transcribe speech instantly. Visualize sound in real-time."
            icon="record_voice_over"
            color="from-blue-500 to-cyan-400"
            delay="0.1s"
            onClick={() => setMode(AppMode.SPEECH)}
          />

          <FeatureCard 
            title="Sign Translator"
            description="Translate hand gestures into spoken language using vision."
            icon="fingerprint"
            color="from-purple-500 to-fuchsia-400"
            delay="0.15s"
            onClick={() => setMode(AppMode.SIGN)}
          />

          <FeatureCard 
            title="Vision Assist"
            description="Detailed audio descriptions of your surroundings."
            icon="lens"
            color="from-amber-500 to-orange-400"
            delay="0.2s"
            onClick={() => setMode(AppMode.IMAGE)}
          />

          <FeatureCard 
            title="Text Simplifier"
            description="Convert complex text into simple, easy-to-read summaries."
            icon="auto_stories"
            color="from-emerald-500 to-teal-400"
            delay="0.25s"
            onClick={() => setMode(AppMode.TEXT)}
          />

          <FeatureCard 
            title="AI Companion"
            description="Your empathetic assistant. Ask questions, practice scenarios, or get help with navigation."
            icon="smart_toy"
            color="from-rose-500 to-pink-500"
            delay="0.3s"
            onClick={() => setMode(AppMode.CHAT)}
            fullWidth
          />
          
          <div className="col-span-2 text-center mt-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
             <p className="text-zinc-600 text-xs font-medium uppercase tracking-widest">Powered by Gemini 2.5 & 3 Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
};