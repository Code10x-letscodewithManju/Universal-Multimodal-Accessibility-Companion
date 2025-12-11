import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { describeImage } from '../services/geminiService';
import { Button } from './ui/Button';
import { UserSettings } from '../types';

interface ImageModeProps {
  onBack: () => void;
  settings: UserSettings;
}

export const ImageMode: React.FC<ImageModeProps> = ({ onBack, settings }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speech when component unmounts (navigating back)
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const capture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setIsProcessing(true);
        // Stop any previous speech
        stopSpeaking();

        const base64 = imageSrc.split(',')[1];
        
        const text = await describeImage(base64, settings.language);
        setDescription(text);
        setIsProcessing(false);

        // Auto speak
        const u = new SpeechSynthesisUtterance(text);
        u.rate = settings.voiceSpeed;
        u.onend = () => setIsSpeaking(false);
        u.onstart = () => setIsSpeaking(true);
        window.speechSynthesis.speak(u);
      }
    }
  };

  const reset = () => {
    stopSpeaking();
    setCapturedImage(null);
    setDescription("");
  };

  return (
    <div className="flex flex-col h-full bg-black">
       <div className="absolute top-4 left-4 z-20">
          <Button label="Back" onClick={onBack} variant="secondary" icon="arrow_back" className="bg-black/40 backdrop-blur text-white border-none" />
       </div>

       <div className="flex-1 relative bg-zinc-900 overflow-hidden flex items-center justify-center">
         {!capturedImage ? (
            <>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: "environment" }}
                />
                {/* Scanner Overlay UI */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black/80 to-transparent"></div>
                    {/* Corners */}
                    <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-amber-400 rounded-tr-xl opacity-80"></div>
                    <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-amber-400 rounded-tl-xl opacity-80"></div>
                    <div className="absolute bottom-32 right-8 w-12 h-12 border-b-4 border-r-4 border-amber-400 rounded-br-xl opacity-80"></div>
                    <div className="absolute bottom-32 left-8 w-12 h-12 border-b-4 border-l-4 border-amber-400 rounded-bl-xl opacity-80"></div>
                </div>
            </>
         ) : (
            <div className="relative w-full h-full">
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                <img src={capturedImage} alt="Focused" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-auto rounded-xl shadow-2xl border-2 border-white/20" />
            </div>
         )}

         {!capturedImage && (
             <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
                <button 
                    onClick={capture}
                    className="group w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/30 active:scale-95 transition-all flex items-center justify-center"
                    aria-label="Capture Image"
                >
                    <div className="w-16 h-16 bg-white rounded-full group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
                </button>
             </div>
         )}
       </div>

       {capturedImage && (
        <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-xl p-6 rounded-t-3xl z-30 shadow-2xl border-t border-white/10 max-h-[50%] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-amber-400 text-xs uppercase font-bold tracking-widest">Scene Analysis</h3>
                {isSpeaking && (
                    <Button 
                        label="Stop Speaking" 
                        onClick={stopSpeaking} 
                        variant="ghost" 
                        icon="volume_off" 
                        className="py-1 px-3 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                    />
                )}
            </div>
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
                 {isProcessing ? (
                     <div className="flex flex-col gap-3">
                         <div className="h-4 bg-zinc-700 rounded animate-pulse w-3/4"></div>
                         <div className="h-4 bg-zinc-700 rounded animate-pulse w-full"></div>
                         <div className="h-4 bg-zinc-700 rounded animate-pulse w-5/6"></div>
                     </div>
                 ) : (
                     <p className="text-white text-lg leading-relaxed font-medium">{description}</p>
                 )}
            </div>
            <Button label="Scan New Object" onClick={reset} variant="primary" large className="bg-amber-500 hover:bg-amber-400 text-black" />
        </div>
       )}
    </div>
  );
};