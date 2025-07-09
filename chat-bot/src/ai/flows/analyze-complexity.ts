'use server';

/**
 * @fileOverview Analyzes the time and space complexity of a given code snippet.
 *
 * - analyzeComplexity - A function that analyzes the complexity of a code snippet.
 * - AnalyzeComplexityInput - The input type for the analyzeComplexity function.
 * - AnalyzeComplexityOutput - The return type for the analyzeComplexity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeComplexityInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
});
export type AnalyzeComplexityInput = z.infer<typeof AnalyzeComplexityInputSchema>;

const AnalyzeComplexityOutputSchema = z.object({
  timeComplexity: z.string().describe('The time complexity of the code.'),
  spaceComplexity: z.string().describe('The space complexity of the code.'),
  justification: z.string().describe('The justification for the time and space complexity analysis, based on loop structures, recursions, and data structure sizes.'),
});
export type AnalyzeComplexityOutput = z.infer<typeof AnalyzeComplexityOutputSchema>;

export async function analyzeComplexity(input: AnalyzeComplexityInput): Promise<AnalyzeComplexityOutput> {
  return analyzeComplexityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeComplexityPrompt',
  input: {schema: AnalyzeComplexityInputSchema},
  output: {schema: AnalyzeComplexityOutputSchema},
  prompt: `You are an expert software engineer specializing in code analysis.  You will analyze the given code snippet and determine its time and space complexity.  Provide a justification for your analysis, based on loop structures, recursions, and data structure sizes.

Code:
{{code}}`,
});

const analyzeComplexityFlow = ai.defineFlow(
  {
    name: 'analyzeComplexityFlow',
    inputSchema: AnalyzeComplexityInputSchema,
    outputSchema: AnalyzeComplexityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
