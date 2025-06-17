
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Barcode, Trash2, Percent, StickyNote, MinusCircle, PlusCircle, FileText, Edit2, Search } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string; 
  stock?: number;    
}

interface CartItem extends Product {
  quantity: number;
}

const mockAvailableProducts: Product[] = Array.from({ length: 12 }).map((_, index) => ({
  id: `PROD${String(Date.now()).slice(-5)}${index}`,
  name: `Product Item ${index + 1}`,
  price: parseFloat((Math.random() * 40 + 10).toFixed(2)), // Random price between 10 and 50
  image: `https://placehold.co/150x150.png`,
  dataAiHint: `product item ${index + 1}`
}));


const TAX_RATE = 0.08; // 8% tax rate

export default function SalesPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [discountInputValue, setDiscountInputValue] = useState("");
  const [appliedDiscountPercentage, setAppliedDiscountPercentage] = useState(0);
  const [saleNotes, setSaleNotes] = useState("");


  const handleAddItem = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    toast({
      title: "Item Added",
      description: `${product.name} has been added to the cart.`,
    });
  };

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    if (itemToRemove) {
      toast({
        title: "Item Removed",
        description: `${itemToRemove.name} has been removed from the cart.`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const filteredAvailableProducts = mockAvailableProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return subtotal * (appliedDiscountPercentage / 100);
  }, [subtotal, appliedDiscountPercentage]);

  const subtotalAfterDiscount = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  const taxAmount = useMemo(() => {
    return subtotalAfterDiscount * TAX_RATE;
  }, [subtotalAfterDiscount]);
  
  const total = useMemo(() => {
    return subtotalAfterDiscount + taxAmount;
  }, [subtotalAfterDiscount, taxAmount]);


  const handleApplyDiscount = () => {
    const discountValue = parseFloat(discountInputValue);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      toast({
        title: "Invalid Discount",
        description: "Please enter a valid discount percentage (0-100).",
        variant: "destructive",
      });
      return;
    }
    setAppliedDiscountPercentage(discountValue);
    toast({
      title: "Discount Applied",
      description: `${discountValue}% discount has been applied.`,
    });
    setIsDiscountDialogOpen(false);
  };

  const handleSaveNotes = () => {
    toast({
      title: "Notes Saved",
      description: "Sale notes have been updated.",
    });
    setIsNotesDialogOpen(false);
    // Note: saleNotes state is already updated via its onChange handler in the Textarea
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    let checkoutMessage = `Proceeding to payment for a total of $${total.toFixed(2)}.`;
    if (saleNotes.trim()) {
      checkoutMessage += `\nNotes: ${saleNotes.trim()}`;
    }
    toast({
      title: "Checkout Initiated (Mock Action)",
      description: checkoutMessage,
      duration: 5000, // Allow more time to read if notes are present
    });
    // In a real app, you would navigate to a payment page or process payment here.
    // Potentially clear the cart and reset discount/notes:
    // setCartItems([]);
    // setAppliedDiscountPercentage(0);
    // setDiscountInputValue("");
    // setSaleNotes("");
  };


  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]"> {/* Adjust height as needed */}
      {/* Product Selection & Search - Left/Main Panel */}
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">New Sale</CardTitle>
            <CardDescription>Add products to the cart by searching or selecting from the grid.</CardDescription>
            <div className="flex gap-2 pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by product name or ID" 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" aria-label="Scan barcode">
                <Barcode className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {filteredAvailableProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredAvailableProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                      onClick={() => handleAddItem(product)}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem(product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <div className="relative w-full aspect-square bg-muted/30">
                        <Image 
                          src={`${product.image}?text=${encodeURIComponent(product.name)}`} 
                          alt={product.name} 
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300" 
                          data-ai-hint={product.dataAiHint || "product item"}
                        />
                      </div>
                      <div className="p-2 text-center">
                        <p className="text-sm font-medium truncate" title={product.name}>{product.name}</p>
                        <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground p-6">
                  No products found matching your search.
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Cart & Checkout - Right Panel */}
      <div className="space-y-6 flex flex-col h-full">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Cart</CardTitle>
            <CardDescription>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} item{cartItems.reduce((acc, item) => acc + item.quantity, 0) === 1 ? '' : 's'}</CardDescription>
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
                    <Image src={`${item.image}?text=${encodeURIComponent(item.name)}`} alt={item.name} width={48} height={48} className="rounded-md border" data-ai-hint={item.dataAiHint || "product item"} />
                    <div className="flex-1">
                      <p className="font-medium text-sm leading-tight">{item.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>${item.price.toFixed(2)}</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease quantity of ${item.name}`}>
                            <MinusCircle className="h-3.5 w-3.5" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} aria-label={`Increase quantity of ${item.name}`}>
                            <PlusCircle className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-semibold text-sm w-16 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => handleRemoveItem(item.id)} aria-label={`Remove ${item.name} from cart`}>
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

                {appliedDiscountPercentage > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="text-muted-foreground">Discount ({appliedDiscountPercentage}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground">Subtotal After Discount</span>
                      <span>${subtotalAfterDiscount.toFixed(2)}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <Separator/>
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                    <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                            <Percent className="mr-2 h-4 w-4" /> Discount
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply Discount</DialogTitle>
                          <DialogDescription>
                            Enter the discount percentage to apply to the subtotal. Current subtotal: ${subtotal.toFixed(2)}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-2">
                          <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
                          <Input 
                            id="discountPercentage" 
                            type="number" 
                            value={discountInputValue}
                            onChange={(e) => setDiscountInputValue(e.target.value)}
                            placeholder="e.g., 10 for 10%" 
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="button" onClick={handleApplyDiscount}>Apply Discount</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
                       <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                            <StickyNote className="mr-2 h-4 w-4" /> Notes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Sale Notes</DialogTitle>
                          <DialogDescription>
                            Add any relevant notes for this sale. These will be (mock) saved with the transaction.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Label htmlFor="saleNotes">Sale Notes</Label>
                          <Textarea 
                            id="saleNotes" 
                            value={saleNotes}
                            onChange={(e) => setSaleNotes(e.target.value)}
                            placeholder="e.g., Customer requested gift wrapping, item on hold..." 
                            rows={4}
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="button" onClick={handleSaveNotes}>Save Notes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                </div>
                <Button size="lg" className="w-full font-semibold h-11 text-base font-headline" onClick={handleCheckout}>
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

