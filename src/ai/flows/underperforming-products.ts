'use server';

/**
 * @fileOverview Identifies underperforming products and suggests discounts.
 *
 * - getUnderperformingProducts - A function that handles the process of identifying underperforming products and suggesting discounts.
 * - UnderperformingProductsInput - The input type for the getUnderperformingProducts function.
 * - UnderperformingProductsOutput - The return type for the getUnderperformingProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderperformingProductsInputSchema = z.object({
  salesData: z
    .string()
    .describe('Sales data for all products, in JSON format.  Include product name, id, and sales figures.'),
  currentGoals: z
    .string()
    .describe('The current business goals, such as increasing overall revenue, reducing inventory, or improving profit margins.'),
});
export type UnderperformingProductsInput = z.infer<typeof UnderperformingProductsInputSchema>;

const UnderperformingProductsOutputSchema = z.object({
  underperformingProducts: z.array(
    z.object({
      productId: z.string().describe('The ID of the underperforming product.'),
      productName: z.string().describe('The name of the underperforming product.'),
      suggestedDiscount: z
        .number()
        .describe('The suggested discount percentage to apply to the product.'),
      reasoning: z.string().describe('The reasoning behind the suggested discount, based on sales data and current business goals.'),
    })
  ).describe('A list of underperforming products with suggested discounts and reasoning.'),
});

export type UnderperformingProductsOutput = z.infer<typeof UnderperformingProductsOutputSchema>;

export async function getUnderperformingProducts(
  input: UnderperformingProductsInput
): Promise<UnderperformingProductsOutput> {
  return underperformingProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'underperformingProductsPrompt',
  input: {schema: UnderperformingProductsInputSchema},
  output: {schema: UnderperformingProductsOutputSchema},
  prompt: `You are an AI assistant helping retail managers identify underperforming products and suggest discounts to improve sales.

  Analyze the provided sales data and consider the current business goals to determine which products are underperforming and what discounts would be most effective.

  Sales Data:
  {{salesData}}

  Current Business Goals:
  {{currentGoals}}

  Provide a list of underperforming products with suggested discounts and a brief explanation for each discount, ensuring it aligns with the current business goals.

  Format your response as a JSON object conforming to the following schema:
  ${JSON.stringify(UnderperformingProductsOutputSchema.shape, null, 2)}`,
});

const underperformingProductsFlow = ai.defineFlow(
  {
    name: 'underperformingProductsFlow',
    inputSchema: UnderperformingProductsInputSchema,
    outputSchema: UnderperformingProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
