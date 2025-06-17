// discount-suggestion.ts
'use server';

/**
 * @fileOverview AI Discount Assistant for suggesting optimal discount ranges for products during seasonal sales.
 *
 * - getDiscountSuggestion - A function that analyzes sales data and suggests optimal discount ranges.
 * - DiscountSuggestionInput - The input type for the getDiscountSuggestion function.
 * - DiscountSuggestionOutput - The return type for the getDiscountSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const DiscountSuggestionInputSchema = z.object({
  salesData: z.string().describe('Sales data of the products, including historical sales, current stock levels and seasonal trends.'),
  seasonalGoal: z.string().describe('The current seasonal business goal, e.g., maximize revenue, clear out seasonal inventory.'),
});

export type DiscountSuggestionInput = z.infer<typeof DiscountSuggestionInputSchema>;

const DiscountSuggestionOutputSchema = z.object({
  product: z.string().describe('The name of the product.'),
  discountRange: z.string().describe('The suggested discount range for the product, e.g., 10%-20%.'),
  reasoning: z.string().describe('A short reasoning about why this particular discount is suggested to make sure that it satisfies current business goals.'),
});

export type DiscountSuggestionOutput = z.infer<typeof DiscountSuggestionOutputSchema>;

export async function getDiscountSuggestion(input: DiscountSuggestionInput): Promise<DiscountSuggestionOutput> {
  return discountSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'discountSuggestionPrompt',
  input: {schema: DiscountSuggestionInputSchema},
  output: {schema: DiscountSuggestionOutputSchema},
  prompt: `You are an AI assistant that helps store managers to determine optimal discount ranges for products during seasonal sales.

  Analyze the provided sales data, current stock levels, and seasonal trends to suggest a discount range for a specific product.
  Also, provide a short reasoning about why you are suggesting this particular discount to make sure that it satisfies current business goals. Ensure that reasoning aligns with seasonalGoal.

  Sales Data: {{{salesData}}}
  Seasonal Goal: {{{seasonalGoal}}}
  \n
  Provide the product name, discount range, and reasoning.
  `,
});

const discountSuggestionFlow = ai.defineFlow(
  {
    name: 'discountSuggestionFlow',
    inputSchema: DiscountSuggestionInputSchema,
    outputSchema: DiscountSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
