// src/ai/flows/suggest-alternatives.ts
'use server';

/**
 * @fileOverview Suggests alternative approaches (brute-force, better, optimal) to solve the same problem, including explanations of their pros and cons.
 *
 * - suggestAlternatives - A function that suggests alternative approaches for a given code.
 * - SuggestAlternativesInput - The input type for the suggestAlternatives function.
 * - SuggestAlternativesOutput - The return type for the suggestAlternatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativesInputSchema = z.object({
  code: z.string().describe('The code for which to suggest alternative approaches.'),
});
export type SuggestAlternativesInput = z.infer<typeof SuggestAlternativesInputSchema>;

const SuggestAlternativesOutputSchema = z.object({
  alternatives: z.array(
    z.object({
      approach: z.string().describe('The name of the alternative approach (e.g., Brute Force, Optimal).'),
      codeSnippet: z.string().describe('The code snippet for the alternative approach.'),
      explanation: z.string().describe('A detailed explanation of the approach.'),
      pros: z.string().describe('The advantages of using this approach.'),
      cons: z.string().describe('The disadvantages of using this approach.'),
      timeComplexity: z.string().describe('The time complexity of the alternative approach.'),
      spaceComplexity: z.string().describe('The space complexity of the alternative approach.'),
    })
  ).describe('An array of alternative approaches with their explanations, pros, and cons.'),
});
export type SuggestAlternativesOutput = z.infer<typeof SuggestAlternativesOutputSchema>;

export async function suggestAlternatives(input: SuggestAlternativesInput): Promise<SuggestAlternativesOutput> {
  return suggestAlternativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativesPrompt',
  input: {schema: SuggestAlternativesInputSchema},
  output: {schema: SuggestAlternativesOutputSchema},
  prompt: `You are an expert computer scientist skilled at suggesting alternative approaches to solve coding problems.

  Given the following code, first automatically detect the programming language. Then, suggest alternative approaches to solve the same problem. Include brute-force, better, and optimal approaches, if applicable. For each approach, provide a code snippet in the detected language, an explanation, pros, cons, time complexity, and space complexity.

  Code:
  {{{code}}}

  Format your response as a JSON array of objects with the following keys:
  - approach: The name of the approach (e.g., Brute Force, Optimal).
  - codeSnippet: The code snippet for the alternative approach. Use the same language as the original code.
  - explanation: A detailed explanation of the approach.
  - pros: The advantages of using this approach.
  - cons: The disadvantages of using this approach.
  - timeComplexity: The time complexity of the alternative approach.
  - spaceComplexity: The space complexity of the alternative approach.`,
});

const suggestAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestAlternativesFlow',
    inputSchema: SuggestAlternativesInputSchema,
    outputSchema: SuggestAlternativesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
