import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your store details, user roles, and system preferences.</p>
      </div>

      <Tabs defaultValue="store_details" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="store_details" className="font-headline">Store Details</TabsTrigger>
          <TabsTrigger value="user_roles" className="font-headline">User Roles</TabsTrigger>
          <TabsTrigger value="system_prefs" className="font-headline">System Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="store_details">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Store Details</CardTitle>
              <CardDescription>Update your store's information and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="RetailFlow Demo Store" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Input id="storeAddress" defaultValue="123 Main St, Anytown, USA" />
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://placehold.co/100x100.png?text=Logo" alt="Store Logo" data-ai-hint="store logo" />
                  <AvatarFallback>RS</AvatarFallback>
                </Avatar>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user_roles">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">User Roles</CardTitle>
              <CardDescription>Manage user accounts and their permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">User Roles Management UI Placeholder</p>
              </div>
               <Button className="mt-4">Add New User</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system_prefs">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">System Preferences</CardTitle>
              <CardDescription>Configure currency, tax rates, and receipt formats.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="USD" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input id="taxRate" type="number" defaultValue="8.0" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="receiptFormat">Receipt Format</Label>
                 <Input id="receiptFormat" defaultValue="Standard" />
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
