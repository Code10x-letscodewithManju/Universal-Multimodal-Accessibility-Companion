import React, { useState } from 'react';
import { AppMode, UserSettings } from './types';
import { Dashboard } from './components/Dashboard';
import { SignMode } from './components/SignMode';
import { SpeechMode } from './components/SpeechMode';
import { TextMode } from './components/TextMode';
import { ImageMode } from './components/ImageMode';
import { ChatBot } from './components/ChatBot';
import { Settings } from './components/Settings';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [settings, setSettings] = useState<UserSettings>({
    highContrast: false,
    largeText: false,
    readingLevel: 'simple',
    language: 'English',
    voiceSpeed: 1.0,
    colorBlindMode: 'none'
  });

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // CSS Filters for Color Blindness Simulation
  const getColorBlindFilter = () => {
    switch (settings.colorBlindMode) {
      case 'protanopia': return 'grayscale(0.5) sepia(0.2) hue-rotate(-10deg)'; // Simplified simulation
      case 'deuteranopia': return 'grayscale(0.4) sepia(0.3) hue-rotate(10deg)';
      case 'tritanopia': return 'grayscale(0.3) sepia(0.5) hue-rotate(180deg)';
      default: return 'none';
    }
  };

  const getActiveComponent = () => {
    switch (mode) {
      case AppMode.SIGN:
        return <SignMode onBack={() => setMode(AppMode.DASHBOARD)} />;
      case AppMode.SPEECH:
        return <SpeechMode onBack={() => setMode(AppMode.DASHBOARD)} />;
      case AppMode.TEXT:
        return <TextMode onBack={() => setMode(AppMode.DASHBOARD)} settings={settings} />;
      case AppMode.IMAGE:
        return <ImageMode onBack={() => setMode(AppMode.DASHBOARD)} settings={settings} />;
      case AppMode.CHAT:
        return <ChatBot onBack={() => setMode(AppMode.DASHBOARD)} />;
      case AppMode.SETTINGS:
        return <Settings settings={settings} updateSettings={updateSettings} onBack={() => setMode(AppMode.DASHBOARD)} />;
      default:
        return <Dashboard setMode={setMode} />;
    }
  };

  return (
    <div 
      className={`min-h-screen bg-black text-white transition-all overflow-hidden font-sans selection:bg-yellow-400 selection:text-black ${settings.largeText ? 'text-xl' : 'text-base'}`}
      style={{ filter: getColorBlindFilter() }}
    >
      <main className="max-w-screen-md mx-auto h-screen bg-zinc-950 shadow-2xl overflow-hidden relative border-x border-zinc-900">
         {getActiveComponent()}
      </main>
    </div>
  );
};

export default App;