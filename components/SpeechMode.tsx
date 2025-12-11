import React, { useEffect, useState, useRef } from 'react';
import { Button } from './ui/Button';

interface SpeechModeProps {
  onBack: () => void;
}

export const SpeechMode: React.FC<SpeechModeProps> = ({ onBack }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
             setTranscript(prev => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
      };
    } else {
        setTranscript("Browser does not support Web Speech API.");
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const clear = () => setTranscript('');

  return (
    <div className="flex flex-col h-full bg-zinc-950">
       <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
          <Button label="Back" onClick={onBack} variant="secondary" icon="arrow_back" />
          <div className="flex flex-col items-end">
             <h2 className="text-blue-400 font-bold tracking-wide uppercase text-sm">Live Captions</h2>
             {isListening && <span className="text-xs text-zinc-500 animate-pulse">Microphone Active</span>}
          </div>
       </div>

       {/* Transcript Area */}
       <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
           {transcript ? (
               <p className="text-3xl md:text-5xl font-semibold leading-tight text-white transition-all duration-300">
                   {transcript}
               </p>
           ) : (
               <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                   <span className="material-icons text-6xl mb-4">hearing</span>
                   <p className="text-xl">Waiting for speech...</p>
               </div>
           )}
           <div ref={bottomRef} />
       </div>

       {/* Controls Area */}
       <div className="p-6 bg-zinc-900 border-t border-zinc-800">
           {isListening && (
               <div className="flex justify-center mb-6 gap-1 h-8 items-end">
                   {[...Array(5)].map((_, i) => (
                       <div key={i} className="w-2 bg-blue-500 rounded-full animate-bounce" style={{ height: '100%', animationDelay: `${i * 0.1}s` }}></div>
                   ))}
               </div>
           )}
           
           <div className="flex items-center gap-4">
               <Button 
                    label={isListening ? "Stop Listening" : "Start Listening"}
                    onClick={toggleListening}
                    variant={isListening ? "danger" : "accent"}
                    large
                    className="flex-1 shadow-xl"
                    icon={isListening ? "mic_off" : "mic"}
               />
               {transcript && (
                <Button 
                        label="Clear"
                        onClick={clear}
                        variant="ghost"
                        icon="delete"
                />
               )}
           </div>
       </div>
    </div>
  );
};