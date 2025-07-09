'use server';

/**
 * @fileOverview Explains code line by line.
 *
 * - explainCode - A function that handles the code explanation process.
 * - ExplainCodeInput - The input type for the explainCode function.
 * - ExplainCodeOutput - The return type for the explainCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('The code to be explained.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z
    .array(
      z.object({
        lines: z.string().describe('The line number(s) this explanation refers to (e.g., "1-3", "5").'),
        code: z.string().describe('The corresponding snippet of code being explained.'),
        explanation: z.string().describe('The detailed explanation for this code snippet.'),
      })
    )
    .describe('A detailed, chunk-by-chunk explanation of the code.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {schema: ExplainCodeInputSchema},
  output: {schema: ExplainCodeOutputSchema},
  prompt: `You are an expert software developer. Please provide a detailed, chunk-by-chunk explanation of the following code. Break down the code into logical segments, and for each segment, provide the line numbers, the code itself, and a clear explanation.
  
Code:
{{code}}`,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
