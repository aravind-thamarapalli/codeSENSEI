'use server';

/**
 * @fileOverview Identifies the core computer science or programming topics covered in a given code snippet.
 *
 * - identifyTopics - A function that takes code as input and returns a list of topics covered.
 * - IdentifyTopicsInput - The input type for the identifyTopics function.
 * - IdentifyTopicsOutput - The return type for the identifyTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyTopicsInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze.'),
});
export type IdentifyTopicsInput = z.infer<typeof IdentifyTopicsInputSchema>;

const IdentifyTopicsOutputSchema = z.object({
  topics: z.array(z.string()).describe('A list of computer science or programming topics covered in the code.'),
});
export type IdentifyTopicsOutput = z.infer<typeof IdentifyTopicsOutputSchema>;

export async function identifyTopics(input: IdentifyTopicsInput): Promise<IdentifyTopicsOutput> {
  return identifyTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyTopicsPrompt',
  input: {schema: IdentifyTopicsInputSchema},
  output: {schema: IdentifyTopicsOutputSchema},
  prompt: `You are an expert computer science educator. You will be given a code snippet, and you will identify the core computer science or programming topics covered in the code.

  Code:
  {{code}}
  
  Topics:
  `, // Ensure the output is valid JSON
});

const identifyTopicsFlow = ai.defineFlow(
  {
    name: 'identifyTopicsFlow',
    inputSchema: IdentifyTopicsInputSchema,
    outputSchema: IdentifyTopicsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
