import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, ChevronLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSymptomChat, type Symptom } from '../hooks/useSymptomChat';
import { useRecordSymptomSession } from '../hooks/useQueries';

interface HealthChatProps {
  onBack: () => void;
}

const SYMPTOMS: { key: Symptom; label: string; emoji: string }[] = [
  { key: 'Bukhar', label: 'Bukhar (Fever)', emoji: '🌡️' },
  { key: 'Khansi', label: 'Khansi (Cough)', emoji: '😷' },
  { key: 'Dard', label: 'Dard (Pain)', emoji: '💊' },
  { key: 'Kamzori', label: 'Kamzori (Weakness)', emoji: '😴' },
  { key: 'Aur', label: 'Aur (Other)', emoji: '🏥' },
];

function renderMessageText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const italicProcessed = boldProcessed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: italicProcessed }} />
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function HealthChat({ onBack }: HealthChatProps) {
  const { messages, stage, selectedSymptoms, confirmPatient, selectSymptom, sendMessage, resetChat } = useSymptomChat();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recordSession = useRecordSymptomSession();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Record session when symptoms are selected
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      const advice = `Symptoms: ${selectedSymptoms.join(', ')}`;
      recordSession.mutate({ symptoms: selectedSymptoms, advice });
    }
  }, [selectedSymptoms.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl text-teal-mid hover:bg-teal-pale"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-10 h-10 rounded-full teal-gradient flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-teal-deep font-heading">Jeevan Rakshak</h2>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              Online — Madad ke liye taiyaar
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={resetChat}
          className="rounded-xl text-muted-foreground hover:bg-teal-pale"
          title="Nai baat shuru karein"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full teal-gradient flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 text-base leading-relaxed ${
                msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
              }`}
            >
              {renderMessageText(msg.text)}
            </div>
          </div>
        ))}

        {/* Action Buttons based on stage */}
        {stage === 'confirm' && (
          <div className="flex justify-start pl-10 animate-slide-up">
            <Button
              onClick={confirmPatient}
              className="teal-gradient text-white border-0 rounded-2xl px-6 py-3 text-base font-semibold shadow-teal hover:opacity-90"
            >
              🙏 Haan, Madad Chahiye
            </Button>
          </div>
        )}

        {stage === 'symptoms' && (
          <div className="pl-10 animate-slide-up">
            <p className="text-sm text-muted-foreground mb-3">Apne lakshan chunein:</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map(s => (
                <button
                  key={s.key}
                  onClick={() => selectSymptom(s.key)}
                  className={`symptom-chip ${selectedSymptoms.includes(s.key) ? 'selected' : ''}`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === 'chat' && selectedSymptoms.length > 0 && (
          <div className="pl-10 animate-slide-up">
            <p className="text-sm text-muted-foreground mb-2">Aur lakshan chunein:</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.filter(s => !selectedSymptoms.includes(s.key)).map(s => (
                <button
                  key={s.key}
                  onClick={() => selectSymptom(s.key)}
                  className="symptom-chip"
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {stage === 'chat' && (
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Apna sawaal likhein..."
            className="text-base border-teal-light focus:border-teal-mid rounded-2xl py-3"
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="teal-gradient text-white border-0 rounded-2xl px-4 shadow-teal hover:opacity-90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
