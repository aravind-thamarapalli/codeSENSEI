'use server';

/**
 * @fileOverview Answers follow-up questions about a code snippet.
 *
 * - askFollowUp - A function that handles answering follow-up questions.
 * - AskFollowUpInput - The input type for the askFollowUp function.
 * - AskFollowUpOutput - The return type for the askFollowUp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskFollowUpInputSchema = z.object({
  code: z.string().describe('The original code snippet.'),
  question: z.string().describe("The user's follow-up question."),
});
export type AskFollowUpInput = z.infer<typeof AskFollowUpInputSchema>;

const AskFollowUpOutputSchema = z.object({
  answer: z.string().describe('The answer to the follow-up question.'),
});
export type AskFollowUpOutput = z.infer<typeof AskFollowUpOutputSchema>;

export async function askFollowUp(input: AskFollowUpInput): Promise<AskFollowUpOutput> {
  return askFollowUpFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askFollowUpPrompt',
  input: {schema: AskFollowUpInputSchema},
  output: {schema: AskFollowUpOutputSchema},
  prompt: `You are an expert software engineer acting as a coding mentor. A user has a follow-up question about the following code snippet. Provide a clear, concise, and helpful answer. Format your answer using Markdown.

Code:
\`\`\`
{{{code}}}
\`\`\`

User's Question:
"{{{question}}}"
`,
});

const askFollowUpFlow = ai.defineFlow(
  {
    name: 'askFollowUpFlow',
    inputSchema: AskFollowUpInputSchema,
    outputSchema: AskFollowUpOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
