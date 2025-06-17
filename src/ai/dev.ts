import { config } from 'dotenv';
config();

import '@/ai/flows/underperforming-products.ts';
import '@/ai/flows/discount-suggestion.ts';
import '@/ai/flows/bundling-suggestions.ts';