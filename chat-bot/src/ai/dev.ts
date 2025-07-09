import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-practice-problems.ts';
import '@/ai/flows/analyze-complexity.ts';
import '@/ai/flows/summarize-code.ts';
import '@/ai/flows/explain-code.ts';
import '@/ai/flows/suggest-alternatives.ts';
import '@/ai/flows/identify-topics.ts';
import '@/ai/flows/ask-follow-up.ts';
