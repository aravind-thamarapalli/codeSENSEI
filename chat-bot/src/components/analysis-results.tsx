
'use client';

import type { AnalysisResults as AnalysisResultsType } from '@/app/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock } from "@/components/code-block";
import { ScrollText, FileText, BookOpenText, Gauge, GitFork, Lightbulb, Tags, AlertCircle, ExternalLink, User, Bot, Send } from "lucide-react";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisResultsProps {
  results: AnalysisResultsType | null;
  isLoading: boolean;
  conversation: { question: string, answer: string }[];
  onFollowUpSubmit: (question: string) => Promise<void>;
  isFollowUpLoading: boolean;
  followUpQuestion: string;
  setFollowUpQuestion: (question: string) => void;
}

function AnalysisSkeleton() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
                <ScrollText className="w-6 h-6 animate-pulse" />
                <Skeleton className="h-6 w-48" />
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </CardContent>
    </Card>
  );
}

function EmptyState() {
    return (
        <Card className="flex flex-col items-center justify-center text-center h-full min-h-[600px] bg-card/30 border-2 border-dashed border-border/30">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full">
                    <ScrollText className="w-12 h-12 text-primary"/>
                </div>
                <CardTitle className="mt-4">AI Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Your code analysis will appear here once you submit your code.
                </p>
            </CardContent>
        </Card>
    )
}

function ResultSection({ icon, title, children, hasData }: { icon: React.ReactNode; title: string; children: React.ReactNode, hasData: boolean }) {
    if (!hasData) {
        return (
             <div className="flex items-center p-4 text-sm text-muted-foreground border rounded-md bg-secondary/30 border-secondary">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                Could not generate insights for: {title}
            </div>
        )
    }
    return (
        <AccordionItem value={title}>
            <AccordionTrigger className="text-lg hover:no-underline">
                <div className="flex items-center gap-3">
                    {icon}
                    {title}
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-2">
                {children}
            </AccordionContent>
        </AccordionItem>
    );
}

export function AnalysisResults({ results, isLoading, conversation, onFollowUpSubmit, isFollowUpLoading, followUpQuestion, setFollowUpQuestion }: AnalysisResultsProps) {
  if (isLoading) return <AnalysisSkeleton />;
  if (!results) return <EmptyState />;

  const defaultOpen = results.summary ? "Code Summary" : "Line-by-Line Explanation";
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim()) return;
    onFollowUpSubmit(followUpQuestion);
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ScrollText className="w-6 h-6 text-primary" />
                Analysis Complete
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible defaultValue={defaultOpen} className="w-full">
                <ResultSection icon={<FileText className="w-5 h-5 text-primary"/>} title="Code Summary" hasData={!!results.summary}>
                    <div className="prose prose-sm max-w-none text-foreground prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{results.summary?.summary || ''}</ReactMarkdown>
                    </div>
                </ResultSection>

                <ResultSection icon={<BookOpenText className="w-5 h-5 text-primary"/>} title="Line-by-Line Explanation" hasData={!!results.explanation && results.explanation.explanation.length > 0}>
                     <div className="space-y-4">
                        {results.explanation?.explanation.map((chunk, index) => (
                            <div key={index} className="p-4 border rounded-md bg-black/20">
                                <p className="font-mono text-xs text-muted-foreground mb-2">LINES: {chunk.lines}</p>
                                <CodeBlock code={chunk.code} />
                                <div className="mt-3 prose prose-sm max-w-none text-foreground prose-invert">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {chunk.explanation}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                </ResultSection>

                <ResultSection icon={<Gauge className="w-5 h-5 text-primary"/>} title="Complexity Analysis" hasData={!!results.complexity}>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Time Complexity: <span className="font-normal text-accent font-code">{results.complexity?.timeComplexity}</span></h3>
                        </div>
                        <div>
                            <h3 className="font-semibold">Space Complexity: <span className="font-normal text-accent font-code">{results.complexity?.spaceComplexity}</span></h3>
                        </div>
                        <div>
                             <h3 className="font-semibold">Justification:</h3>
                             <div className="prose prose-sm max-w-none text-foreground prose-invert pt-1">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{results.complexity?.justification || ''}</ReactMarkdown>
                             </div>
                        </div>
                    </div>
                </ResultSection>

                <ResultSection icon={<GitFork className="w-5 h-5 text-primary"/>} title="Alternative Approaches" hasData={!!results.alternatives && results.alternatives.alternatives.length > 0}>
                    <div className="space-y-6">
                        {results.alternatives?.alternatives.map((alt, index) => (
                            <div key={index}>
                                <h3 className="text-base font-semibold font-headline mb-2">{alt.approach}</h3>
                                <div className="space-y-3">
                                    <div className="prose prose-sm max-w-none text-foreground prose-invert">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{`**Explanation:** ${alt.explanation}`}</ReactMarkdown>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{`**Pros:** ${alt.pros}`}</ReactMarkdown>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{`**Cons:** ${alt.cons}`}</ReactMarkdown>
                                    </div>
                                    <p><strong className="font-medium">Time Complexity:</strong> <span className="font-code text-accent">{alt.timeComplexity}</span></p>
                                    <p><strong className="font-medium">Space Complexity:</strong> <span className="font-code text-accent">{alt.spaceComplexity}</span></p>
                                    <CodeBlock code={alt.codeSnippet} />
                                </div>
                            </div>
                        ))}
                    </div>
                </ResultSection>

                <ResultSection icon={<Lightbulb className="w-5 h-5 text-primary"/>} title="Practice Problems" hasData={!!results.problems && results.problems.problems.length > 0}>
                    <ul className="list-disc pl-5 space-y-2">
                        {results.problems?.problems.map((prob, index) => (
                            <li key={index}>
                                <a href={prob.link} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline flex items-center gap-1">
                                    {prob.title}
                                    <ExternalLink className="w-3 h-3"/>
                                </a>
                            </li>
                        ))}
                    </ul>
                </ResultSection>

                <ResultSection icon={<Tags className="w-5 h-5 text-primary"/>} title="Topics Covered" hasData={!!results.topics && results.topics.topics.length > 0}>
                    <div className="flex flex-wrap gap-2">
                        {results.topics?.topics.map(topic => (
                            <Badge key={topic} variant="secondary">{topic}</Badge>
                        ))}
                    </div>
                </ResultSection>
            </Accordion>
            
            {results && (
                <>
                    <Separator className="my-6" />
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold flex items-center gap-3">
                            <Bot className="w-5 h-5 text-primary"/>
                            Follow-up Chat
                        </h3>
                        
                        <div className="space-y-4">
                            <AnimatePresence>
                                {conversation.map((entry, index) => (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-start gap-3 justify-end">
                                            <div className="bg-gradient-to-br from-primary/50 to-secondary/50 backdrop-blur-lg border border-white/10 rounded-xl p-3 max-w-[85%] text-primary-foreground shadow-lg">
                                                <p className="font-semibold text-right">You</p>
                                                <p className="text-sm opacity-90">{entry.question}</p>
                                            </div>
                                            <Avatar className="w-8 h-8 border">
                                                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Avatar className="w-8 h-8 border border-primary/20 bg-primary/10">
                                                <AvatarFallback className="bg-transparent"><Bot className="w-4 h-4 text-primary" /></AvatarFallback>
                                            </Avatar>
                                            <div className="prose prose-sm max-w-[85%] text-foreground prose-invert bg-card/60 backdrop-blur-lg border border-white/10 p-3 rounded-xl shadow-lg">
                                                {isFollowUpLoading && !entry.answer && index === conversation.length - 1 ? (
                                                    <p className="italic text-muted-foreground">Thinking...</p>
                                                ) : (
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {entry.answer}
                                                    </ReactMarkdown>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                    
                    <form onSubmit={handleFormSubmit} className="mt-6 flex gap-2 items-start">
                        <Textarea
                            placeholder="Ask a follow-up question..."
                            value={followUpQuestion}
                            onChange={(e) => setFollowUpQuestion(e.target.value)}
                            disabled={isFollowUpLoading}
                            className="resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleFormSubmit(e);
                                }
                            }}
                        />
                        <Button type="submit" disabled={isFollowUpLoading || !followUpQuestion.trim()} size="icon">
                            <Send className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </>
            )}
        </CardContent>
    </Card>
  );
}
