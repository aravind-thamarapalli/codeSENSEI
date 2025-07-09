
"use client";

import { useState, useEffect } from 'react';
import type { AnalysisResults as AnalysisResultsType } from '@/app/actions';
import { analyzeCode, askFollowUpQuestion } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from '@/components/code-editor';
import { AnalysisResults } from '@/components/analysis-results';
import { Card } from './ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { HistorySidebar, type HistoryItem } from '@/components/history-sidebar';
import { ScrollText } from 'lucide-react';
import { motion } from 'framer-motion';

const exampleCode = `function factorial(n) {
  if (n < 0) {
    return "Number must be non-negative.";
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}`;

export function CodeAnalysis() {
  const [code, setCode] = useState<string>('');
  const [results, setResults] = useState<AnalysisResultsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const { toast } = useToast();
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [conversation, setConversation] = useState<HistoryItem['conversation']>([]);

  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('code-sensei-history');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    } catch (error) {
        console.error("Failed to load history from localStorage", error);
        setHistory([]);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: "Input Error",
        description: "Please enter some code to analyze.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResults(null);
    setActiveHistoryId(null);
    setConversation([]);
    try {
      const res = await analyzeCode({ code });
      setResults(res);
      if(res.summary?.summary) {
        const newHistoryItem: HistoryItem = {
            id: new Date().toISOString(),
            code,
            summary: res.summary.summary.split('\n')[0].substring(0, 100), // Use first line of summary, truncated
            results: res,
            timestamp: Date.now(),
            conversation: [],
        };
        const updatedHistory = [newHistoryItem, ...history].filter((item, index, self) => index === self.findIndex(t => t.code === item.code)).slice(0, 50); // prevent duplicates and limit history
        setHistory(updatedHistory);
        setActiveHistoryId(newHistoryItem.id);
        localStorage.setItem('code-sensei-history', JSON.stringify(updatedHistory));
      }

    } catch (e: any) {
      toast({
        title: "Analysis Failed",
        description: e.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUseExample = () => {
    setCode(exampleCode);
    setResults(null);
    setActiveHistoryId(null);
    setConversation([]);
  }

  const handleSelectHistory = (item: HistoryItem) => {
    setCode(item.code);
    setResults(item.results);
    setActiveHistoryId(item.id);
    setConversation(item.conversation || []);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setActiveHistoryId(null);
    setCode('');
    setResults(null);
    setConversation([]);
    localStorage.removeItem('code-sensei-history');
  }

  const handleFollowUpSubmit = async (question: string) => {
    if (!code.trim() || !question.trim()) return;

    setIsFollowUpLoading(true);
    setFollowUpQuestion('');
    
    const newConversation = [...(conversation || []), { question, answer: '' }];
    setConversation(newConversation);

    try {
        const res = await askFollowUpQuestion({ code, question });

        const updatedConversationWithAnswer = newConversation.map((entry, index) => 
            index === newConversation.length - 1 ? { ...entry, answer: res.answer } : entry
        );
        setConversation(updatedConversationWithAnswer);
        
        if(activeHistoryId) {
            const updatedHistory = history.map(h => 
                h.id === activeHistoryId ? { ...h, conversation: updatedConversationWithAnswer } : h
            );
            setHistory(updatedHistory);
            localStorage.setItem('code-sensei-history', JSON.stringify(updatedHistory));
        }

    } catch (e: any) {
        toast({
            title: "Follow-up Failed",
            description: e.message || "An unexpected error occurred.",
            variant: "destructive",
        });
        setConversation(conv => (conv || []).slice(0, -1));
    } finally {
        setIsFollowUpLoading(false);
    }
  };

  useEffect(() => {
    if (activeHistoryId) {
        const activeItem = history.find(h => h.id === activeHistoryId);
        if (activeItem && activeItem.code !== code) {
            setActiveHistoryId(null);
            setResults(null);
            setConversation([]);
        }
    }
  }, [code, activeHistoryId, history]);

  return (
    <SidebarProvider>
        <HistorySidebar 
            history={history}
            onSelectHistory={handleSelectHistory}
            onClearHistory={handleClearHistory}
            activeItemId={activeHistoryId}
        />
        <SidebarInset>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center pt-4 md:pt-8 mb-8 flex flex-col items-center shrink-0">
                <div className="bg-primary/10 backdrop-blur-lg p-4 rounded-2xl mb-6 border border-primary/20 shadow-glass">
                <ScrollText className="w-8 h-8 text-primary drop-shadow-lg" />
                </div>
                <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight mb-2">
                    <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent text-glow-subtle">
                        CodeSENSEI
                    </span>
                </h1>
                <p className="text-muted-foreground/90 mt-3 max-w-2xl text-lg leading-relaxed">
                Unlock the wisdom in your code. Paste your snippet to receive instant guidance from your personal AI-powered sensei.
                </p>
            </motion.header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="lg:sticky lg:top-8 shadow-glass-lg">
                        <CodeEditor
                        code={code}
                        setCode={setCode}
                        onAnalyze={handleAnalyze}
                        isLoading={isLoading}
                        onUseExample={handleUseExample}
                        />
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="min-h-[600px]"
                >
                    <AnalysisResults
                        results={results}
                        isLoading={isLoading}
                        conversation={conversation || []}
                        onFollowUpSubmit={handleFollowUpSubmit}
                        isFollowUpLoading={isFollowUpLoading}
                        followUpQuestion={followUpQuestion}
                        setFollowUpQuestion={setFollowUpQuestion}
                    />
                </motion.div>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
