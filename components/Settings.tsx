import React from 'react';
import { UserSettings, ColorBlindMode } from '../types';
import { Button } from './ui/Button';

interface SettingsProps {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-black relative">
       {/* Header */}
       <div className="px-8 pt-10 pb-6 flex items-center justify-between bg-black/50 backdrop-blur-xl z-20 sticky top-0">
         <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Settings</h2>
            <p className="text-zinc-500 text-sm font-medium">Personalize your experience</p>
         </div>
         <Button label="Done" onClick={onBack} variant="secondary" icon="check" className="rounded-full px-6" />
       </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20 space-y-8 animate-fade-in custom-scrollbar">
        
        {/* Section: Visual */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <span className="material-icons text-blue-500 text-sm">visibility</span>
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Visual Engine</h3>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between p-5 border-b border-zinc-800/50">
                <div>
                    <span className="text-white font-semibold block">High Contrast</span>
                    <span className="text-zinc-500 text-xs">Increase legibility</span>
                </div>
                <button 
                    onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                    className={`w-14 h-8 rounded-full transition-all duration-300 flex items-center px-1 ${settings.highContrast ? 'bg-blue-500' : 'bg-zinc-700'}`}
                >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${settings.highContrast ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-5">
                <div>
                    <span className="text-white font-semibold block">Large Text</span>
                    <span className="text-zinc-500 text-xs">Scale up typography</span>
                </div>
                <button 
                    onClick={() => updateSettings({ largeText: !settings.largeText })}
                    className={`w-14 h-8 rounded-full transition-all duration-300 flex items-center px-1 ${settings.largeText ? 'bg-blue-500' : 'bg-zinc-700'}`}
                >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${settings.largeText ? 'translate-x-6' : ''}`} />
                </button>
              </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-5 space-y-4">
              <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Color Correction</label>
              <div className="grid grid-cols-2 gap-3">
                  {(['none', 'protanopia', 'deuteranopia', 'tritanopia'] as ColorBlindMode[]).map((mode) => (
                      <button
                          key={mode}
                          onClick={() => updateSettings({ colorBlindMode: mode })}
                          className={`p-3 rounded-2xl border text-sm font-medium transition-all duration-200 ${settings.colorBlindMode === mode ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                      >
                          <span className="capitalize">{mode}</span>
                      </button>
                  ))}
              </div>
          </div>
        </section>

        {/* Section: Cognitive */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
                <span className="material-icons text-green-500 text-sm">psychology</span>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Cognitive & Audio</h3>
            </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-5 space-y-4">
            <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Simplification Level</label>
            <div className="bg-zinc-950 p-1.5 rounded-2xl flex border border-zinc-800">
              {['simple', 'moderate', 'advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => updateSettings({ readingLevel: level as any })}
                  className={`flex-1 py-2.5 rounded-xl capitalize text-xs font-bold transition-all ${settings.readingLevel === level ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-5 space-y-4">
             <div className="flex justify-between">
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Voice Speed</label>
                <span className="text-white text-xs font-bold bg-zinc-800 px-2 py-0.5 rounded">{settings.voiceSpeed}x</span>
             </div>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={settings.voiceSpeed}
              onChange={(e) => updateSettings({ voiceSpeed: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-blue-400"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};