
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Edit3, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const inventoryItems = [
  { id: "PROD001", name: "Premium Wireless Mouse", stock: 150, status: "In Stock", lastAdjusted: "2023-10-26" },
  { id: "PROD002", name: "Organic Green Tea", stock: 80, status: "In Stock", lastAdjusted: "2023-10-25" },
  { id: "PROD003", name: "Men's Cotton T-Shirt", stock: 20, status: "Low Stock", lastAdjusted: "2023-10-27" },
  { id: "PROD004", name: "Stainless Steel Water Bottle", stock: 0, status: "Out of Stock", lastAdjusted: "2023-10-20" },
];

export default function InventoryPage() {

  const handleExportCSV = () => {
    const headers = ["Product ID", "Name", "Stock", "Status", "Last Adjusted"];
    const csvRows = [
      headers.join(","), // header row
      ...inventoryItems.map(item => 
        [
          item.id,
          `"${item.name.replace(/"/g, '""')}"`, // Escape double quotes in name
          item.stock,
          item.status,
          item.lastAdjusted
        ].join(",")
      )
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your product stock levels.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Low Stock Alerts
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
          <CardDescription>Live tracking of product inventory.</CardDescription>
           <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search inventory..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Adjusted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.stock}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "In Stock" ? "secondary" : item.status === "Low Stock" ? "default" : "destructive"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastAdjusted}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Edit3 className="mr-2 h-4 w-4" /> Adjust Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Stock Adjustment Log</CardTitle>
          <CardDescription>History of all stock adjustments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Adjustment Log Table Placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
