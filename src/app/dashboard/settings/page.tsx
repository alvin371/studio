
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Edit, UserCog, UserX, UserCheck, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialMockUsers = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'Admin' as UserRole, status: 'Active' as UserStatus },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', role: 'Editor' as UserRole, status: 'Active' as UserStatus },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer' as UserRole, status: 'Disabled' as UserStatus },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Editor' as UserRole, status: 'Active' as UserStatus },
];

const userRoles = ['Admin', 'Editor', 'Viewer'] as const;
type UserRole = typeof userRoles[number];
type UserStatus = 'Active' | 'Disabled';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>(initialMockUsers);

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = React.useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = React.useState(false);
  
  const [currentUserToEdit, setCurrentUserToEdit] = React.useState<User | null>(null);
  const [currentUserToDelete, setCurrentUserToDelete] = React.useState<User | null>(null);

  const [newUserName, setNewUserName] = React.useState("");
  const [newUserEmail, setNewUserEmail] = React.useState("");
  const [newUserRole, setNewUserRole] = React.useState<UserRole>("Viewer");

  const [editUserRole, setEditUserRole] = React.useState<UserRole>("Viewer");

  const openAddUserDialog = () => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Viewer");
    setIsAddUserDialogOpen(true);
  };

  const submitAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast({ title: "Error", description: "Name and Email cannot be empty.", variant: "destructive" });
      return;
    }
    const newUser: User = {
      id: Date.now().toString(), // Simple unique ID for mock
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
    toast({ title: "User Added", description: `${newUser.name} has been added. (Mock action)` });
    setIsAddUserDialogOpen(false);
  };

  const openEditUserDialog = (user: User) => {
    setCurrentUserToEdit(user);
    setEditUserRole(user.role);
    setIsEditUserDialogOpen(true);
  };

  const submitEditUserRole = () => {
    if (!currentUserToEdit) return;
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === currentUserToEdit.id ? { ...u, role: editUserRole } : u
      )
    );
    toast({ title: "User Role Updated", description: `${currentUserToEdit.name}'s role updated to ${editUserRole}. (Mock action)` });
    setIsEditUserDialogOpen(false);
    setCurrentUserToEdit(null);
  };
  
  const openDeleteUserDialog = (user: User) => {
    setCurrentUserToDelete(user);
  };

  const confirmDeleteUser = () => {
    if (!currentUserToDelete) return;
    setUsers(prevUsers => prevUsers.filter(u => u.id !== currentUserToDelete.id));
    toast({ title: "User Deleted", description: `${currentUserToDelete.name} has been deleted. (Mock action)`, variant: "destructive" });
    setCurrentUserToDelete(null); // This will also close the AlertDialog as its open prop is bound to currentUserToDelete
  };

  const handleToggleStatus = (userId: string) => {
    let updatedUser: User | undefined;
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === userId) {
          updatedUser = { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' };
          return updatedUser;
        }
        return user;
      })
    );
    if (updatedUser) {
      toast({
        title: "User Status Updated",
        description: `User ${updatedUser.name} status changed to ${updatedUser.status}. (Mock update)`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your store details, user roles, and system preferences.</p>
      </div>

      <Tabs defaultValue="user_roles" className="w-full">
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
              <CardTitle className="font-headline">User Roles &amp; Permissions</CardTitle>
              <CardDescription>Manage user accounts and their access levels within the system. (Mocked CRUD)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button onClick={openAddUserDialog}>
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
                        <Button variant="ghost" size="icon" onClick={() => openEditUserDialog(user)} title="Edit Role">
                          <UserCog className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(user.id)} title={user.status === 'Active' ? 'Disable User' : 'Enable User'}>
                          {user.status === 'Active' ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-green-600" />}
                        </Button>
                         <Button variant="ghost" size="icon" onClick={() => openDeleteUserDialog(user)} title="Delete User">
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Enter the details for the new user.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newUserName">Full Name</Label>
              <Input id="newUserName" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserEmail">Email</Label>
              <Input id="newUserEmail" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserRole">Role</Label>
              <Select value={newUserRole} onValueChange={(value: UserRole) => setNewUserRole(value)}>
                <SelectTrigger id="newUserRole">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={submitAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {currentUserToEdit && (
        <Dialog open={isEditUserDialogOpen} onOpenChange={(open) => { setIsEditUserDialogOpen(open); if (!open) setCurrentUserToEdit(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Role</DialogTitle>
              <DialogDescription>Change the role for {currentUserToEdit.name}.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={currentUserToEdit.name} readOnly disabled />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={currentUserToEdit.email} readOnly disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserRole">Role</Label>
                <Select value={editUserRole} onValueChange={(value: UserRole) => setEditUserRole(value)}>
                  <SelectTrigger id="editUserRole">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="outline" onClick={() => { setIsEditUserDialogOpen(false); setCurrentUserToEdit(null); }}>Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={submitEditUserRole}>Save Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={!!currentUserToDelete} onOpenChange={(open) => { if(!open) setCurrentUserToDelete(null);}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              "{currentUserToDelete?.name}" from the list (mock action).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

