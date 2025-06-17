
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Edit, UserCog, UserX, UserCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const mockUsers = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Disabled' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Editor', status: 'Active' },
];

type User = typeof mockUsers[number];

export default function SettingsPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>(mockUsers);

  const handleEditRole = (userId: string) => {
    console.log(`Edit role for user ${userId}`);
    toast({ title: "Action: Edit Role", description: `Triggered edit role for user ID: ${userId}` });
    // In a real app, this would open a dialog to change the user's role
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' }
          : user
      )
    );
    const user = users.find(u => u.id === userId);
    toast({
      title: "Action: Toggle Status",
      description: `User ${user?.name} status changed to ${user?.status === 'Active' ? 'Disabled' : 'Active'}. (Mock update)`,
    });
  };
  
  const handleAddNewUser = () => {
    console.log("Add new user clicked");
    toast({ title: "Action: Add User", description: "Triggered add new user. (No functionality yet)" });
    // In a real app, this would open a form/dialog to add a new user
  }

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
              <Button onClick={() => toast({title: "Store Details Saved", description: "Your store details have been updated. (Mock action)"})}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user_roles">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">User Roles & Permissions</CardTitle>
              <CardDescription>Manage user accounts and their access levels within the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button onClick={handleAddNewUser}>
                  <UserPlus className="mr-2 h-4 w-4" /> Add New User
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "secondary" : "destructive"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRole(user.id)} title="Edit Role">
                          <UserCog className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(user.id)} title={user.status === 'Active' ? 'Disable User' : 'Enable User'}>
                          {user.status === 'Active' ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-green-600" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <Button onClick={() => toast({title: "Preferences Saved", description: "System preferences have been updated. (Mock action)"})}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper icon to avoid build errors if UserPlus is not available in lucide-react.
// In a real scenario, ensure all icons are correctly imported and available.
const UserPlus = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" x2="19" y1="8" y2="14"/>
    <line x1="22" x2="16" y1="11" y2="11"/>
  </svg>
);
