
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Barcode, Trash2, Percent, StickyNote } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const initialCartItems: CartItem[] = [
  { id: 1, name: "Premium Wireless Mouse", price: 49.99, quantity: 1, image: "https://placehold.co/60x60.png" },
  { id: 2, name: "Organic Green Tea", price: 12.50, quantity: 2, image: "https://placehold.co/60x60.png" },
  { id: 3, name: "Men's Cotton T-Shirt", category: "Apparel", price: 25.00, stock: 200, image: "https://placehold.co/60x60.png" },
];

const TAX_RATE = 0.08; // 8% tax rate

export default function SalesPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const { toast } = useToast();

  const handleRemoveItem = (itemId: number) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    if (itemToRemove) {
      toast({
        title: "Item Removed",
        description: `${itemToRemove.name} has been removed from the cart.`,
      });
    }
  };

  // Mock function to add product - in a real app, this would take a product object
  const handleAddProductToCart = (productIndex: number) => {
     // For now, this is a placeholder. Ideally, it would add a real product.
     // We'll just show a toast for demo purposes.
     toast({
       title: "Add to Cart (Mock)",
       description: `Product ${productIndex + 1} clicked. Add-to-cart logic to be implemented.`,
     });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = subtotal * TAX_RATE;
  const total = subtotal + taxAmount;

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]"> {/* Adjust height as needed */}
      {/* Product Selection & Search - Left/Main Panel */}
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">New Sale</CardTitle>
            <CardDescription>Add products to the cart by searching or scanning.</CardDescription>
            <div className="flex gap-2 pt-2">
              <Input placeholder="Search by product name or SKU" className="flex-1" />
              <Button variant="outline" size="icon" aria-label="Scan barcode">
                <Barcode className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                    onClick={() => handleAddProductToCart(index)}
                  >
                    <div className="relative w-full aspect-square">
                      <Image 
                        src={`https://placehold.co/150x150.png?text=Item+${index + 1}`} 
                        alt={`Product ${index + 1}`} 
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                        data-ai-hint="product placeholder" 
                      />
                    </div>
                    <div className="p-2 text-center">
                      <p className="text-sm font-medium truncate">Product {index + 1}</p>
                      <p className="text-xs text-muted-foreground">$ {(Math.random() * 50 + 10).toFixed(2)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Cart & Checkout - Right Panel */}
      <div className="space-y-6 flex flex-col h-full">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Cart</CardTitle>
            <CardDescription>{cartItems.length} item{cartItems.length === 1 ? '' : 's'}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {cartItems.length === 0 ? (
                 <div className="flex items-center justify-center h-full text-muted-foreground p-6">
                    Your cart is empty. Add items from the left.
                 </div>
              ) : (
              <div className="divide-y">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-4">
                    <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md border" data-ai-hint="product item" />
                    <div className="flex-1">
                      <p className="font-medium text-sm leading-tight">{item.name}</p>
                      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              )}
            </ScrollArea>
          </CardContent>
          {cartItems.length > 0 && (
            <>
            <Separator />
            <CardFooter className="flex-col items-stretch p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <Separator/>
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => toast({title: "Mock Action", description: "Apply Discount clicked."})}>
                        <Percent className="mr-2 h-4 w-4" /> Discount
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => toast({title: "Mock Action", description: "Add Notes clicked."})}>
                        <StickyNote className="mr-2 h-4 w-4" /> Notes
                    </Button>
                </div>
                <Button size="lg" className="w-full font-semibold h-11 text-base font-headline" onClick={() => toast({title: "Mock Action", description: "Checkout initiated."})}>
                  Checkout
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

