
'use client';

import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, BrainCircuit } from "lucide-react";
import { motion } from 'framer-motion';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onUseExample: () => void;
}

export function CodeEditor({ code, setCode, onAnalyze, isLoading, onUseExample }: CodeEditorProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6"/>
            Input Code
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Enter your code and the AI will automatically detect the language.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code-input">Your Code</Label>
          <Textarea
            id="code-input"
            placeholder="Paste your code snippet here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-code h-80 resize-y"
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
          <Button onClick={onAnalyze} disabled={isLoading || !code.trim()} className="w-full">
            {isLoading ? 'Analyzing...' : 'Analyze Code'}
            <Wand2 className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
        <Button variant="outline" onClick={onUseExample} disabled={isLoading} className="w-full sm:w-auto">
          Use Example
        </Button>
      </CardFooter>
    </>
  );
}
