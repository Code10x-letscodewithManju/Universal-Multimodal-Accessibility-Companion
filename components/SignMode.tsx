import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { interpretSignLanguage } from '../services/geminiService';
import { Button } from './ui/Button';

interface SignModeProps {
  onBack: () => void;
}

export const SignMode: React.FC<SignModeProps> = ({ onBack }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Text-to-Speech
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const captureAndAnalyze = useCallback(async () => {
    if (webcamRef.current && !isProcessing && isActive) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setIsProcessing(true);
        const base64 = imageSrc.split(',')[1];
        
        try {
          const text = await interpretSignLanguage(base64);
          if (text && !text.toLowerCase().includes('no gesture')) {
            setHistory(prev => [text, ...prev].slice(0, 5)); // Keep last 5
            speak(text);
          }
        } catch (e) {
            // Quiet fail for demo flow
        } finally {
          setIsProcessing(false);
        }
      }
    }
  }, [isActive, isProcessing]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(captureAndAnalyze, 2000); 
    }
    return () => clearInterval(interval);
  }, [isActive, captureAndAnalyze]);

  return (
    <div className="flex flex-col h-full bg-black relative">
      {/* Camera View */}
      <div className="relative flex-1 bg-zinc-900 overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          videoConstraints={{ facingMode: "user" }}
        />
        
        {/* UI Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
            <div className="flex justify-between items-start">
                <Button label="Back" onClick={onBack} variant="secondary" icon="arrow_back" className="bg-black/50 backdrop-blur" />
                <div className={`px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md border border-white/10 ${isActive ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800/50 text-zinc-400'}`}>
                    <div className={`w-2 h-2 rounded-full bg-current ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="font-bold text-xs uppercase tracking-wider">{isActive ? 'Live' : 'Standby'}</span>
                </div>
            </div>

            {/* Hand Guide Overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-white/30 rounded-3xl pointer-events-none flex items-center justify-center">
                 <span className="text-white/20 text-sm font-medium">Place Hand Here</span>
            </div>

            {/* Current Result Card */}
            <div className="w-full flex justify-center">
                 {isProcessing && isActive && (
                     <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm flex items-center gap-2 mb-4 animate-pulse">
                         <span className="material-icons text-sm">visibility</span>
                         Looking...
                     </div>
                 )}
            </div>
        </div>
      </div>

      {/* Control & History Panel */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-6 rounded-t-3xl -mt-6 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col gap-6">
            <div className="space-y-2">
                <h3 className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Recent Interpretations</h3>
                <div className="min-h-[4rem] flex flex-col-reverse gap-2">
                    {history.length > 0 ? (
                        history.map((h, i) => (
                            <p key={i} className={`text-lg font-medium transition-all ${i === 0 ? 'text-white text-xl scale-100' : 'text-zinc-600 scale-95 opacity-50'}`}>
                                {h}
                            </p>
                        ))
                    ) : (
                        <p className="text-zinc-600 italic">Start signing to translate...</p>
                    )}
                </div>
            </div>

            <Button 
                label={isActive ? "Stop Translation" : "Start Translation"} 
                onClick={() => setIsActive(!isActive)} 
                variant={isActive ? "danger" : "primary"}
                large
                className="w-full"
                icon={isActive ? "stop" : "videocam"}
            />
        </div>
      </div>
    </div>
  );
};