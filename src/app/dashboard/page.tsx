import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Real-time analytics for your business.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Total Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">$12,345.67</p>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Total Sales</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">482</p>
            <p className="text-xs text-muted-foreground">+10.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Active Products</CardTitle>
            <CardDescription>Total distinct products</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1,205</p>
            <p className="text-xs text-muted-foreground">7 low stock</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Sales Performance</CardTitle>
          <CardDescription>Revenue trends over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Interactive Line Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Stock Overview</CardTitle>
          <CardDescription>Top selling vs. low stock items.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Bar Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
