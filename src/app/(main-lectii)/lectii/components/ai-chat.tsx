// src/app/lectii/[id]/ai/components/ai-chat.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, Message } from 'ai/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BotIcon, SendIcon, UserIcon } from 'lucide-react';
import { nanoid } from 'nanoid';

interface AIChatProps {
  lessonContent: string;
  lessonId: string;
}

export function AIChat({ lessonContent, lessonId }: AIChatProps) {
  const initialSystemMessage: Message = {
    id: nanoid(),
    role: 'system',
    content: `Sunteți un asistent AI pentru învățarea medicală. Bazați-vă răspunsurile pe următorul conținut al lecției: ${lessonContent}`
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [initialSystemMessage],
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (scrollAreaRef.current && !isScrolled) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isScrolled]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setIsScrolled(scrollTop + clientHeight < scrollHeight);
  };

  const visibleMessages = messages.filter(m => m.role !== 'system');

  return (
    <div className="flex flex-col h-[80vh] bg-background border rounded-lg shadow-lg overflow-hidden">
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 p-6"
        onScroll={handleScroll}
      >
        <div className="space-y-6">
          {visibleMessages.map((m) => (
            <div key={m.id} className={`flex items-start gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <BotIcon className="w-6 h-6" />
                </div>
              )}
              <div className={`rounded-lg p-4 max-w-[80%] shadow-md ${
                m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <p className="text-sm md:text-base">{m.content}</p>
              </div>
              {m.role === 'user' && (
                <div className="rounded-full bg-primary w-10 h-10 flex items-center justify-center text-primary-foreground flex-shrink-0">
                  <UserIcon className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Scrieți mesajul dvs. aici..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <SendIcon className="w-5 h-5" />
            <span className="sr-only">Trimite</span>
          </Button>
        </div>
      </form>
    </div>
  );
}