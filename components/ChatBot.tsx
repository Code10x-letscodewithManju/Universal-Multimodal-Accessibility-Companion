import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import { Button } from './ui/Button';
import { ChatMessage } from '../types';

interface ChatBotProps {
  onBack: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatSession = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize session once
    chatSession.current = createChatSession();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Stream response
      const result = await chatSession.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = "";
      setMessages(prev => [...prev, { role: 'model', text: '', isThinking: true }]);

      for await (const chunk of result) {
         // @ts-ignore
         fullText += chunk.text;
         setMessages(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: 'model', text: fullText, isThinking: false };
            return newHistory;
         });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
        <Button label="Back" onClick={onBack} variant="secondary" icon="arrow_back" />
        <h2 className="text-xl font-bold text-yellow-400">AI Assistant</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-yellow-400 text-black rounded-tr-none' 
                : 'bg-zinc-800 text-white rounded-tl-none'
            }`}>
              {msg.isThinking ? (
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></span>
                 </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
        <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-yellow-400 outline-none"
        />
        <Button 
            label="Send" 
            onClick={sendMessage} 
            icon="send" 
            disabled={isThinking || !input}
        />
      </div>
    </div>
  );
};