import React, { useState } from 'react';
import { simplifyTextWithThinking } from '../services/geminiService';
import { Button } from './ui/Button';
import { UserSettings } from '../types';

interface TextModeProps {
  onBack: () => void;
  settings: UserSettings;
}

export const TextMode: React.FC<TextModeProps> = ({ onBack, settings }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  const handleProcess = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setActiveTab('output');
    
    // Simulate thinking delay for UX if API is too fast
    await new Promise(r => setTimeout(r, 500)); 
    
    const result = await simplifyTextWithThinking(
      inputText, 
      settings.readingLevel, 
      settings.language
    );
    
    setOutputText(result);
    setIsLoading(false);
  };

  const speakOutput = () => {
      if (!outputText) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(outputText);
      u.rate = settings.voiceSpeed;
      window.speechSynthesis.speak(u);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
       <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900">
        <Button label="Back" onClick={onBack} variant="secondary" icon="arrow_back" />
        <h2 className="text-xl font-bold text-emerald-400">Content Clarifier</h2>
      </div>

      <div className="flex p-4 gap-2 bg-zinc-900 border-b border-zinc-800">
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeTab === 'input' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
          >
            Original
          </button>
          <button 
            onClick={() => setActiveTab('output')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeTab === 'output' ? 'bg-emerald-600 text-white' : 'text-zinc-500'}`}
          >
            Simplified
          </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'input' && (
            <div className="h-full flex flex-col p-6 animate-fade-in">
                <textarea
                    className="flex-1 w-full bg-zinc-900/50 border border-zinc-700 rounded-2xl p-4 text-white placeholder-zinc-600 focus:border-emerald-400 outline-none resize-none transition-all focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Paste complex legal documents, medical forms, or articles here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                 <div className="mt-4 flex justify-between items-center">
                     <div className="relative">
                        <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden" 
                            accept=".txt,.md"
                            onChange={handleFileUpload}
                        />
                        <label htmlFor="file-upload" className="text-zinc-400 hover:text-white cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors">
                            <span className="material-icons">upload_file</span> 
                            <span>Upload Text File</span>
                        </label>
                     </div>
                     <Button 
                        label={isLoading ? "Analyzing..." : "Simplify"} 
                        onClick={handleProcess} 
                        disabled={isLoading || !inputText}
                        icon="auto_awesome"
                        variant="primary"
                        className="bg-emerald-500 text-white hover:bg-emerald-400"
                    />
                 </div>
            </div>
        )}

        {activeTab === 'output' && (
            <div className="h-full flex flex-col p-6 animate-fade-in bg-zinc-900/30">
                 <div className="flex-1 overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-inner">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-emerald-400 font-medium animate-pulse">Adapting content for you...</p>
                        </div>
                    ) : outputText ? (
                        <article className="prose prose-invert prose-lg max-w-none">
                            <p className="whitespace-pre-wrap leading-relaxed text-zinc-100">
                                {outputText}
                            </p>
                        </article>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                            <span className="material-icons text-5xl mb-2">text_fields</span>
                            <p>No simplified text yet.</p>
                        </div>
                    )}
                 </div>
                 {outputText && (
                     <div className="mt-4 flex justify-end">
                         <Button 
                            label="Read Aloud" 
                            onClick={speakOutput} 
                            icon="volume_up"
                            variant="secondary"
                        />
                     </div>
                 )}
            </div>
        )}
      </div>
    </div>
  );
};