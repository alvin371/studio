import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Barcode, PlusCircle, Trash2, Edit, Percent, StickyNote } from "lucide-react";
import Image from "next/image";

const cartItems = [
  { id: 1, name: "Premium Wireless Mouse", price: 49.99, quantity: 1, image: "https://placehold.co/40x40.png" },
  { id: 2, name: "Organic Green Tea", price: 12.50, quantity: 2, image: "https://placehold.co/40x40.png" },
];

export default function SalesPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // Example 8% tax
  const total = subtotal + tax;

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
                  <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <Image src={`https://placehold.co/150x150.png?text=Product+${index + 1}`} alt={`Product ${index + 1}`} width={150} height={150} className="w-full h-auto object-cover" data-ai-hint="product placeholder" />
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
            <CardDescription>{cartItems.length} items</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {cartItems.length === 0 ? (
                 <div className="flex items-center justify-center h-full text-muted-foreground p-6">
                    Your cart is empty.
                 </div>
              ) : (
              <div className="divide-y">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <Image src={item.image} alt={item.name} width={40} height={40} className="rounded" data-ai-hint="product item" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
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
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1">
                        <Percent className="mr-2 h-4 w-4" /> Discount
                    </Button>
                    <Button variant="outline" className="flex-1">
                        <StickyNote className="mr-2 h-4 w-4" /> Notes
                    </Button>
                </div>
                <Button size="lg" className="w-full font-headline">Checkout</Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
