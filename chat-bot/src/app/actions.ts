
'use server';

import { summarizeCode } from '@/ai/flows/summarize-code';
import { explainCode } from '@/ai/flows/explain-code';
import { analyzeComplexity } from '@/ai/flows/analyze-complexity';
import { suggestAlternatives } from '@/ai/flows/suggest-alternatives';
import { suggestPracticeProblems } from '@/ai/flows/suggest-practice-problems';
import { identifyTopics } from '@/ai/flows/identify-topics';
import { askFollowUp } from '@/ai/flows/ask-follow-up';

export async function analyzeCode(input: { code: string }) {
  const { code } = input;

  if (!code.trim()) {
    throw new Error('Code input cannot be empty.');
  }

  const [
    summaryResult,
    explanationResult,
    complexityResult,
    alternativesResult,
    problemsResult,
    topicsResult,
  ] = await Promise.allSettled([
    summarizeCode({ code }),
    explainCode({ code }),
    analyzeComplexity({ code }),
    suggestAlternatives({ code }),
    suggestPracticeProblems({ code }),
    identifyTopics({ code }),
  ]);

  const getValue = <T,>(result: PromiseSettledResult<T>): T | null => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    console.error('AI Flow failed:', result.reason);
    return null;
  }
    
  const results = {
    summary: getValue(summaryResult),
    explanation: getValue(explanationResult),
    complexity: getValue(complexityResult),
    alternatives: getValue(alternativesResult),
    problems: getValue(problemsResult),
    topics: getValue(topicsResult),
  };

  return results;
}

export type AnalysisResults = Awaited<ReturnType<typeof analyzeCode>>;

export async function askFollowUpQuestion(input: { code: string, question: string }) {
    if (!input.code.trim()) {
        throw new Error('Code context cannot be empty.');
    }
    if (!input.question.trim()) {
        throw new Error('Question cannot be empty.');
    }
    return await askFollowUp(input);
}
