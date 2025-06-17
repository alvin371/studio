
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlusCircle, Search, Edit, Trash2, ImageUp } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const initialProducts: Product[] = [
  { id: "PROD001", name: "Premium Wireless Mouse", category: "Electronics", price: 49.99, stock: 150, image: "https://placehold.co/60x60.png" },
  { id: "PROD002", name: "Organic Green Tea", category: "Groceries", price: 12.50, stock: 80, image: "https://placehold.co/60x60.png" },
  { id: "PROD003", name: "Men's Cotton T-Shirt", category: "Apparel", price: 25.00, stock: 200, image: "https://placehold.co/60x60.png" },
  { id: "PROD004", name: "Stainless Steel Water Bottle", category: "Home Goods", price: 19.99, stock: 50, image: "https://placehold.co/60x60.png" },
  { id: "PROD005", name: "Bluetooth Headphones", category: "Electronics", price: 89.99, stock: 75, image: "https://placehold.co/60x60.png" },
  { id: "PROD006", name: "Yoga Mat", category: "Sports", price: 29.99, stock: 120, image: "https://placehold.co/60x60.png" },
];

const productCategories = ["All", ...new Set(initialProducts.map(p => p.category))];

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const [currentProduct, setCurrentProduct] = React.useState<Product | null>(null);

  // Form state for Add/Edit Dialog
  const [productName, setProductName] = React.useState("");
  const [productCategory, setProductCategory] = React.useState(productCategories.length > 1 ? productCategories[1] : "");
  const [productPrice, setProductPrice] = React.useState("");
  const [productStock, setProductStock] = React.useState("");
  const [productImage, setProductImage] = React.useState("https://placehold.co/150x150.png");

  const resetFormFields = () => {
    setProductName("");
    setProductCategory(productCategories.length > 1 ? productCategories[1] : "");
    setProductPrice("");
    setProductStock("");
    setProductImage("https://placehold.co/150x150.png");
  };

  const handleAddProduct = () => {
    if (!productName || !productCategory || !productPrice || !productStock) {
      toast({ title: "Error", description: "All fields except image are required.", variant: "destructive" });
      return;
    }
    const newProduct: Product = {
      id: `PROD${String(Date.now()).slice(-4)}${Math.floor(Math.random()*100)}`, // Simple unique ID
      name: productName,
      category: productCategory,
      price: parseFloat(productPrice),
      stock: parseInt(productStock, 10),
      image: productImage || "https://placehold.co/60x60.png",
    };
    setProducts(prev => [newProduct, ...prev]);
    toast({ title: "Product Added", description: `${newProduct.name} has been added.` });
    setIsAddDialogOpen(false);
    resetFormFields();
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setProductName(product.name);
    setProductCategory(product.category);
    setProductPrice(String(product.price));
    setProductStock(String(product.stock));
    setProductImage(product.image);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!currentProduct || !productName || !productCategory || !productPrice || !productStock) {
      toast({ title: "Error", description: "All fields except image are required.", variant: "destructive" });
      return;
    }
    const updatedProduct: Product = {
      ...currentProduct,
      name: productName,
      category: productCategory,
      price: parseFloat(productPrice),
      stock: parseInt(productStock, 10),
      image: productImage || "https://placehold.co/60x60.png",
    };
    setProducts(prev => prev.map(p => (p.id === currentProduct.id ? updatedProduct : p)));
    toast({ title: "Product Updated", description: `${updatedProduct.name} has been updated.` });
    setIsEditDialogOpen(false);
    setCurrentProduct(null);
    resetFormFields();
  };

  const handleDeleteProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (!currentProduct) return;
    setProducts(prev => prev.filter(p => p.id !== currentProduct.id));
    toast({ title: "Product Deleted", description: `${currentProduct.name} has been deleted.`, variant: "destructive" });
    setIsDeleteDialogOpen(false);
    setCurrentProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  const availableCategories = ["All", ...new Set(products.map(p => p.category))];


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage your products.</p>
        </div>
        <Button onClick={() => { resetFormFields(); setIsAddDialogOpen(true); }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">All Products</CardTitle>
          <CardDescription>View and manage your product catalog.</CardDescription>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products by name or category..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint="product item" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} title="Edit Product">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product)} title="Delete Product" className="text-destructive hover:text-destructive/90">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No products found matching your criteria.</p>
          )}
          <div className="flex justify-end items-center space-x-2 pt-4">
            {/* Pagination could be added here */}
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the details for the new product.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="addProductName">Product Name</Label>
              <Input id="addProductName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Wireless Keyboard" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="addProductCategory">Category</Label>
               <Input id="addProductCategory" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} placeholder="e.g., Electronics" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="addProductPrice">Price ($)</Label>
                <Input id="addProductPrice" type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="e.g., 29.99" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="addProductStock">Stock</Label>
                <Input id="addProductStock" type="number" value={productStock} onChange={(e) => setProductStock(e.target.value)} placeholder="e.g., 100" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="addProductImage">Image URL</Label>
              <div className="flex items-center gap-2">
                <Input id="addProductImage" value={productImage} onChange={(e) => setProductImage(e.target.value)} placeholder="https://placehold.co/150x150.png" />
                {productImage && <Image src={productImage} alt="Preview" width={40} height={40} className="rounded-md object-cover" data-ai-hint="image preview"/>}
              </div>
               <p className="text-xs text-muted-foreground">Default: https://placehold.co/150x150.png</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the details for {currentProduct?.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="editProductName">Product Name</Label>
              <Input id="editProductName" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
             <div className="space-y-1">
              <Label htmlFor="editProductCategory">Category</Label>
               <Input id="editProductCategory" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="editProductPrice">Price ($)</Label>
                <Input id="editProductPrice" type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="editProductStock">Stock</Label>
                <Input id="editProductStock" type="number" value={productStock} onChange={(e) => setProductStock(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="editProductImage">Image URL</Label>
               <div className="flex items-center gap-2">
                <Input id="editProductImage" value={productImage} onChange={(e) => setProductImage(e.target.value)} />
                {productImage && <Image src={productImage} alt="Preview" width={40} height={40} className="rounded-md object-cover" data-ai-hint="image preview"/>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" onClick={handleUpdateProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{currentProduct?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentProduct(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

