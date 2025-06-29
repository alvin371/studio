
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Edit3, Bell, Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  lastAdjusted: string;
}

const initialInventoryItems: InventoryItem[] = [
  { id: "PROD001", name: "Premium Wireless Mouse", stock: 150, lastAdjusted: "2023-10-26" },
  { id: "PROD002", name: "Organic Green Tea", stock: 80, lastAdjusted: "2023-10-25" },
  { id: "PROD003", name: "Men's Cotton T-Shirt", stock: 20, lastAdjusted: "2023-10-27" },
  { id: "PROD004", name: "Stainless Steel Water Bottle", stock: 0, lastAdjusted: "2023-10-20" },
  { id: "PROD005", name: "Gaming Keyboard", stock: 5, lastAdjusted: "2023-10-28" },
  { id: "PROD006", name: "Yoga Mat Extra Thick", stock: 60, lastAdjusted: "2023-10-22" },
];

const LOW_STOCK_THRESHOLD = 20;

const getItemStatus = (stock: number): { text: string; variant: "secondary" | "default" | "destructive" } => {
  if (stock === 0) {
    return { text: "Out of Stock", variant: "destructive" };
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return { text: "Low Stock", variant: "default" };
  }
  return { text: "In Stock", variant: "secondary" };
};

export default function InventoryPage() {
  const { toast } = useToast();
  const [inventoryItems, setInventoryItems] = React.useState<InventoryItem[]>(initialInventoryItems);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLowStockAlertsOpen, setIsLowStockAlertsOpen] = React.useState(false);
  const [lowStockProducts, setLowStockProducts] = React.useState<InventoryItem[]>([]);

  const filteredInventoryItems = React.useMemo(() => {
    return inventoryItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventoryItems, searchTerm]);

  const handleExportCSV = () => {
    if (filteredInventoryItems.length === 0) {
      toast({
        title: "Export Notice",
        description: "No items to export based on current filters.",
        variant: "default",
      });
      return;
    }
    const headers = ["Product ID", "Name", "Stock", "Status", "Last Adjusted"];
    const csvRows = [
      headers.join(","),
      ...filteredInventoryItems.map(item => {
        const statusInfo = getItemStatus(item.stock);
        return [
          item.id,
          `"${item.name.replace(/"/g, '""')}"`, // Handle names with commas
          item.stock,
          statusInfo.text,
          item.lastAdjusted
        ].join(",");
      })
    ];
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "inventory_data.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
       toast({
        title: "Export Successful",
        description: "Filtered inventory data has been exported to CSV.",
      });
    } else {
       toast({
        title: "Export Failed",
        description: "Your browser does not support this feature.",
        variant: "destructive",
      });
    }
  };

  const handleShowLowStockAlerts = () => {
    // Alerts should operate on the full inventory list, not filtered
    const alerts = inventoryItems.filter(item => item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD);
    setLowStockProducts(alerts);
    setIsLowStockAlertsOpen(true);
  };
  
  const handleAdjustStock = (item: InventoryItem) => {
    // Mock action: In a real app, this would open a dialog to input new stock or adjustment amount
    toast({
      title: "Adjust Stock (Mock Action)",
      description: `Triggered for ${item.name}. Current stock: ${item.stock}.`,
    });
    // Example: For a real implementation, you might do something like:
    // const newStock = prompt(`Enter new stock for ${item.name}:`, String(item.stock));
    // if (newStock !== null && !isNaN(parseInt(newStock))) {
    //   setInventoryItems(prevItems => 
    //     prevItems.map(i => i.id === item.id ? {...i, stock: parseInt(newStock), lastAdjusted: new Date().toISOString().split('T')[0] } : i)
    //   );
    //   toast({ title: "Stock Updated (Mock)", description: `${item.name} stock set to ${newStock}.`});
    // }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your product stock levels. Low stock threshold: {LOW_STOCK_THRESHOLD} units.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleShowLowStockAlerts}>
            <Bell className="mr-2 h-4 w-4" />
            Low Stock Alerts ({inventoryItems.filter(item => item.stock > 0 && item.stock <= LOW_STOCK_THRESHOLD).length})
          </Button>
          <Button onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Stock Levels</CardTitle>
          <CardDescription>Live tracking of product inventory. Use the search below to filter items.</CardDescription>
           <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search inventory by name or ID..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Adjusted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventoryItems.length > 0 ? filteredInventoryItems.map((item) => {
                const statusInfo = getItemStatus(item.stock);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.stock}</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant} className={statusInfo.variant === 'default' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30' : ''}>
                        {statusInfo.text}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lastAdjusted}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleAdjustStock(item)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Adjust Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {searchTerm ? "No inventory items found matching your search." : "No inventory items available."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Stock Adjustment Log</CardTitle>
          <CardDescription>History of all stock adjustments. (This is a placeholder for future implementation)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full bg-muted/50 rounded-md flex items-center justify-center border border-dashed">
            <p className="text-muted-foreground">Adjustment Log Table / Data Placeholder</p>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts Dialog */}
      <Dialog open={isLowStockAlertsOpen} onOpenChange={setIsLowStockAlertsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
              Low Stock Alerts
            </DialogTitle>
            <DialogDescription>
              The following products are at or below the low stock threshold of {LOW_STOCK_THRESHOLD} units.
            </DialogDescription>
          </DialogHeader>
          {lowStockProducts.length > 0 ? (
            <div className="mt-4 max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">No products are currently low on stock.</p>
          )}
          <DialogFooter className="sm:justify-start mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
