// src/ai/flows/bundling-suggestions.ts
'use server';
/**
 * @fileOverview Provides bundling suggestions for products, recommending complementary items
 *               or combinations to move stale inventory.
 *
 * - getBundlingSuggestions - A function to generate product bundling suggestions with reasoning.
 * - BundlingSuggestionsInput - The input type for the getBundlingSuggestions function.
 * - BundlingSuggestionsOutput - The return type for the getBundlingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BundlingSuggestionsInputSchema = z.object({
  salesData: z
    .string()
    .describe('Summary of recent sales data, including product performance.'),
  inventoryData: z
    .string()
    .describe('Details of current inventory levels for each product.'),
  businessGoals: z
    .string()
    .describe('Current business goals such as increasing revenue, reducing inventory, etc.'),
});
export type BundlingSuggestionsInput = z.infer<typeof BundlingSuggestionsInputSchema>;

const BundlingSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      bundleName: z.string().describe('A descriptive name for the product bundle.'),
      products: z.array(z.string()).describe('List of product names included in the bundle.'),
      discountPercentage: z
        .number()
        .describe('Recommended discount percentage for the bundle.'),
      reasoning: z
        .string()
        .describe('A short explanation of why this bundle is suggested and how it aligns with the business goals.'),
    })
  ).
  describe('An array of bundling suggestions, including product combinations, discount percentages, and reasoning.'),
});
export type BundlingSuggestionsOutput = z.infer<typeof BundlingSuggestionsOutputSchema>;

export async function getBundlingSuggestions(input: BundlingSuggestionsInput): Promise<BundlingSuggestionsOutput> {
  return bundlingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bundlingSuggestionsPrompt',
  input: {schema: BundlingSuggestionsInputSchema},
  output: {schema: BundlingSuggestionsOutputSchema},
  prompt: `You are an AI assistant that suggests product bundles for a retail store based on sales data, inventory, and current business goals.

  Sales Data: {{{salesData}}}
  Inventory Data: {{{inventoryData}}}
  Business Goals: {{{businessGoals}}}

  Based on this information, suggest product bundles that would help achieve the business goals. Provide a bundle name, list of products, a discount percentage, and reasoning for each suggestion.

  Format your response as a JSON array of bundling suggestions:
  {{outputFormat schema=BundlingSuggestionsOutputSchema}}
  `,
});

const bundlingSuggestionsFlow = ai.defineFlow(
  {
    name: 'bundlingSuggestionsFlow',
    inputSchema: BundlingSuggestionsInputSchema,
    outputSchema: BundlingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
