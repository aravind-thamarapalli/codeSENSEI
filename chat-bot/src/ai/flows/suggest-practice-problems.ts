'use server';

/**
 * @fileOverview A flow that suggests practice problems based on the input code.
 *
 * - suggestPracticeProblems - A function that handles the practice problem suggestion process.
 * - SuggestPracticeProblemsInput - The input type for the suggestPracticeProblems function.
 * - SuggestPracticeProblemsOutput - The return type for the suggestPracticeProblems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPracticeProblemsInputSchema = z.object({
  code: z.string().describe('The code to analyze.'),
});
export type SuggestPracticeProblemsInput = z.infer<typeof SuggestPracticeProblemsInputSchema>;

const SuggestPracticeProblemsOutputSchema = z.object({
  problems: z
    .array(z.object({title: z.string(), link: z.string()}))
    .describe('A list of relevant practice problems with links.'),
});
export type SuggestPracticeProblemsOutput = z.infer<typeof SuggestPracticeProblemsOutputSchema>;

export async function suggestPracticeProblems(
  input: SuggestPracticeProblemsInput
): Promise<SuggestPracticeProblemsOutput> {
  return suggestPracticeProblemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPracticeProblemsPrompt',
  input: {schema: SuggestPracticeProblemsInputSchema},
  output: {schema: SuggestPracticeProblemsOutputSchema},
  prompt: `You are an expert computer science educator. Given the following code, suggest 3 relevant practice problems with links to LeetCode or GeeksforGeeks.

Code: {{{code}}}`,
});

const suggestPracticeProblemsFlow = ai.defineFlow(
  {
    name: 'suggestPracticeProblemsFlow',
    inputSchema: SuggestPracticeProblemsInputSchema,
    outputSchema: SuggestPracticeProblemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
