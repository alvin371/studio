
"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Search, Eye, RefreshCw, FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

const initialOrders = [
  { id: "ORD001", date: "2023-10-27", customer: "John Doe", total: 75.49, paymentMethod: "Card", status: "Completed", staff: "Alice" },
  { id: "ORD002", date: "2023-10-26", customer: "Jane Smith", total: 32.00, paymentMethod: "Cash", status: "Completed", staff: "Bob" },
  { id: "ORD003", date: "2023-10-25", customer: "Mike Brown", total: 120.90, paymentMethod: "Digital Wallet", status: "Refunded", staff: "Alice" },
  { id: "ORD004", date: "2023-10-24", customer: "Sarah Wilson", total: 55.00, paymentMethod: "Card", status: "Pending", staff: "Charles" },
  { id: "ORD005", date: "2023-10-27", customer: "David Lee", total: 88.20, paymentMethod: "Cash", status: "Completed", staff: "Bob" },
  { id: "ORD006", date: "2023-10-26", customer: "Laura Garcia", total: 15.50, paymentMethod: "Card", status: "Pending", staff: "Charles" },
];

// Extract unique staff and payment methods for filter dropdowns
const staffOptions = ["All", ...new Set(initialOrders.map(order => order.staff))];
const paymentMethodOptions = ["All", ...new Set(initialOrders.map(order => order.paymentMethod))];


export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStaff, setSelectedStaff] = useState<string>("All");
  const [selectedPayment, setSelectedPayment] = useState<string>("All");

  const filteredOrders = useMemo(() => {
    return initialOrders.filter(order => {
      const matchesSearchTerm =
        searchTerm.trim() === "" ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate =
        !selectedDate || order.date === format(selectedDate, "yyyy-MM-dd");

      const matchesStaff =
        selectedStaff === "All" || order.staff === selectedStaff;
      
      // Match payment method, handling potential case differences if any
      const matchesPayment =
        selectedPayment === "All" || order.paymentMethod === selectedPayment;

      return matchesSearchTerm && matchesDate && matchesStaff && matchesPayment;
    });
  }, [searchTerm, selectedDate, selectedStaff, selectedPayment]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">View and manage past transactions.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">All Transactions</CardTitle>
          <CardDescription>Filter and search through your order history.</CardDescription>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search ID or Customer..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Filter by date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by staff" />
              </SelectTrigger>
              <SelectContent>
                {staffOptions.map(staff => (
                  <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPayment} onValueChange={setSelectedPayment}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodOptions.map(pm => (
                   <SelectItem key={pm} value={pm}>{pm}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.staff}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "Completed" ? "default" : order.status === "Refunded" ? "destructive" : "secondary"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" aria-label="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Refund/Reissue">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" aria-label="Print Receipt">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No orders found matching your filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end items-center space-x-2 pt-4">
            {/* Pagination (mock) - Functionality not implemented in this step */}
            <Button variant="outline" size="sm" disabled={filteredOrders.length === 0}>Previous</Button>
            <Button variant="outline" size="sm" disabled={filteredOrders.length === 0}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

