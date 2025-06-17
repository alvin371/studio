"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getUnderperformingProducts, type UnderperformingProductsOutput } from '@/ai/flows/underperforming-products';
import { getDiscountSuggestion, type DiscountSuggestionOutput } from '@/ai/flows/discount-suggestion';
import { getBundlingSuggestions, type BundlingSuggestionsOutput } from '@/ai/flows/bundling-suggestions';

type AiTask = "underperforming" | "discount" | "bundling";

export default function AiAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState('');
  const [goals, setGoals] = useState('');
  
  const [underperformingResult, setUnderperformingResult] = useState<UnderperformingProductsOutput | null>(null);
  const [discountResult, setDiscountResult] = useState<DiscountSuggestionOutput | null>(null);
  const [bundlingResult, setBundlingSuggestionsOutput] = useState<BundlingSuggestionsOutput | null>(null);

  const handleAiRequest = async (task: AiTask) => {
    setIsLoading(true);
    setError(null);
    setUnderperformingResult(null);
    setDiscountResult(null);
    setBundlingSuggestionsOutput(null);

    try {
      if (!salesData.trim() || !goals.trim()) {
        setError("Sales data and business goals cannot be empty.");
        setIsLoading(false);
        return;
      }

      if (task === "underperforming") {
        const result = await getUnderperformingProducts({ salesData, currentGoals: goals });
        setUnderperformingResult(result);
      } else if (task === "discount") {
        const result = await getDiscountSuggestion({ salesData, seasonalGoal: goals });
        setDiscountResult(result);
      } else if (task === "bundling") {
        const result = await getBundlingSuggestions({ salesData, inventoryData: "Assuming sufficient inventory for bundling", businessGoals: goals });
        setBundlingSuggestionsOutput(result);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">AI Discount Assistant</h1>
        <p className="text-muted-foreground">Get smart recommendations for your retail strategy.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Input Data</CardTitle>
          <CardDescription>Provide sales data and business goals for AI analysis. For demo, use simple JSON or text descriptions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="salesData" className="block text-sm font-medium text-foreground mb-1">Sales Data (JSON or Text)</label>
            <Textarea
              id="salesData"
              placeholder='e.g., [{"productId": "A123", "name": "T-Shirt", "sales": 50, "price": 20}, {"productId": "B456", "name": "Jeans", "sales": 10, "price": 50}]'
              value={salesData}
              onChange={(e) => setSalesData(e.target.value)}
              rows={5}
              className="font-code"
            />
          </div>
          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-foreground mb-1">Business Goals / Seasonal Focus</label>
            <Textarea
              id="goals"
              placeholder="e.g., Increase overall revenue, clear out summer inventory, improve profit margins on electronics."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => handleAiRequest("underperforming")} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Find Underperforming Products
          </Button>
          <Button onClick={() => handleAiRequest("discount")} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Suggest Discount Ranges
          </Button>
          <Button onClick={() => handleAiRequest("bundling")} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Suggest Product Bundles
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle className="font-headline">Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {underperformingResult && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Underperforming Products Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {underperformingResult.underperformingProducts.map(p => (
              <Card key={p.productId} className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg font-headline">{p.productName} (ID: {p.productId})</CardTitle>
                  <CardDescription>Suggested Discount: <span className="font-semibold text-primary">{p.suggestedDiscount}%</span></CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground"><strong>Reasoning:</strong> {p.reasoning}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {discountResult && (
         <Card>
          <CardHeader>
            <CardTitle className="font-headline">Discount Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg font-headline">{discountResult.product}</CardTitle>
                  <CardDescription>Suggested Discount Range: <span className="font-semibold text-primary">{discountResult.discountRange}</span></CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground"><strong>Reasoning:</strong> {discountResult.reasoning}</p>
                </CardContent>
              </Card>
          </CardContent>
        </Card>
      )}

      {bundlingResult && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Bundling Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bundlingResult.suggestions.map(s => (
              <Card key={s.bundleName} className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg font-headline">{s.bundleName}</CardTitle>
                  <CardDescription>
                    Products: {s.products.join(', ')} | Discount: <span className="font-semibold text-primary">{s.discountPercentage}%</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground"><strong>Reasoning:</strong> {s.reasoning}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
