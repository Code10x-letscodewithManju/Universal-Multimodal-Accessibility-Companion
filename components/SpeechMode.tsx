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
       <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button label="Back" onClick={onBack} variant="secondary" icon="arrow_back" className="h-10 w-10 !p-0 rounded-full flex items-center justify-center shadow-none bg-zinc-800/50" />
            <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Live Captioning</h2>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Real-time Audio Transcription</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             {isListening && (
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Live</span>
                 </div>
             )}
          </div>
       </div>

       {/* Transcript Area */}
       <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
           {transcript ? (
               <p className="text-3xl md:text-5xl font-semibold leading-tight text-white transition-all duration-300">
                   {transcript}
               </p>
           ) : (
               <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-50">
                   <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800">
                      <span className="material-icons text-4xl">hearing</span>
                   </div>
                   <p className="text-xl font-medium">Waiting for speech...</p>
               </div>
           )}
           <div ref={bottomRef} />
       </div>

       {/* Controls Area */}
       <div className="p-6 bg-zinc-900 border-t border-zinc-800">
           {isListening && (
               <div className="flex justify-center mb-6 gap-1 h-12 items-end">
                   {[...Array(8)].map((_, i) => (
                       <div key={i} className="w-2 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full animate-bounce" style={{ height: '60%', animationDelay: `${i * 0.08}s` }}></div>
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