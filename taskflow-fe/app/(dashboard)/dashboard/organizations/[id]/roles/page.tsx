"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, Edit, Trash2, Info } from "lucide-react"

// Sample data for roles
const roles = [
  {
    id: 1,
    name: "Owner",
    description: "Full access to all resources",
    isDefault: true,
    members: 1,
    permissions: ["manage_organization", "manage_teams", "manage_members", "manage_roles", "manage_projects"],
  },
  {
    id: 2,
    name: "Admin",
    description: "Can manage teams and members",
    isDefault: true,
    members: 2,
    permissions: ["manage_teams", "manage_members", "manage_projects"],
  },
  {
    id: 3,
    name: "Member",
    description: "Can view and work on assigned projects",
    isDefault: true,
    members: 8,
    permissions: ["view_projects", "edit_assigned_tasks"],
  },
  {
    id: 4,
    name: "Project Manager",
    description: "Can manage specific projects",
    isDefault: false,
    members: 3,
    permissions: ["manage_assigned_projects", "view_all_projects"],
  },
  {
    id: 5,
    name: "Developer",
    description: "Technical team member",
    isDefault: false,
    members: 5,
    permissions: ["view_projects", "edit_assigned_tasks", "create_tasks"],
  },
]

// Sample permission categories
const permissionCategories = [
  {
    name: "Organization",
    permissions: [
      { id: "manage_organization", name: "Manage organization settings" },
      { id: "view_organization", name: "View organization details" },
      { id: "delete_organization", name: "Delete organization" },
    ],
  },
  {
    name: "Teams",
    permissions: [
      { id: "create_teams", name: "Create teams" },
      { id: "edit_teams", name: "Edit team details" },
      { id: "delete_teams", name: "Delete teams" },
      { id: "manage_team_members", name: "Manage team members" },
    ],
  },
  {
    name: "Members",
    permissions: [
      { id: "invite_members", name: "Invite members" },
      { id: "remove_members", name: "Remove members" },
      { id: "manage_roles", name: "Manage member roles" },
    ],
  },
  {
    name: "Projects",
    permissions: [
      { id: "create_projects", name: "Create projects" },
      { id: "edit_projects", name: "Edit projects" },
      { id: "delete_projects", name: "Delete projects" },
      { id: "view_all_projects", name: "View all projects" },
      { id: "manage_assigned_projects", name: "Manage assigned projects" },
    ],
  },
  {
    name: "Tasks",
    permissions: [
      { id: "create_tasks", name: "Create tasks" },
      { id: "edit_assigned_tasks", name: "Edit assigned tasks" },
      { id: "edit_all_tasks", name: "Edit all tasks" },
      { id: "delete_tasks", name: "Delete tasks" },
      { id: "assign_tasks", name: "Assign tasks to members" },
    ],
  },
]

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)

  const filteredRoles =
    activeTab === "all"
      ? roles
      : activeTab === "default"
        ? roles.filter((role) => role.isDefault)
        : roles.filter((role) => !role.isDefault)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">Manage roles and permissions for your organization.</p>
        </div>
        <Dialog open={isCreateRoleDialogOpen} onOpenChange={setIsCreateRoleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Custom Role</DialogTitle>
              <DialogDescription>Define a new role with custom permissions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input id="role-name" placeholder="Enter role name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-description">Description</Label>
                  <Input id="role-description" placeholder="Brief description of this role" />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Permissions</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Select All
                    </Button>
                    <Button variant="outline" size="sm">
                      Clear All
                    </Button>
                  </div>
                </div>

                {permissionCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <h3 className="font-medium text-sm border-b pb-1">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                      {category.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center gap-2">
                          <Checkbox id={permission.id} />
                          <Label htmlFor={permission.id} className="text-sm font-normal">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={() => setIsCreateRoleDialogOpen(false)}>
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Roles</TabsTrigger>
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search roles..." className="pl-9 focus-visible:ring-[#00B8D4]" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${role.isDefault ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}`}
                    >
                      {role.isDefault ? "Default" : "Custom"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{role.members}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRole(role)
                        setIsEditRoleDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {!role.isDefault && (
                      <Button variant="ghost" size="sm" className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      {selectedRole && (
        <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Role: {selectedRole.name}</DialogTitle>
              <DialogDescription>Modify role details and permissions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role-name">Role Name</Label>
                  <Input id="edit-role-name" defaultValue={selectedRole.name} disabled={selectedRole.isDefault} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role-description">Description</Label>
                  <Input id="edit-role-description" defaultValue={selectedRole.description} />
                </div>
              </div>

              {selectedRole.isDefault && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    This is a default role. Some settings cannot be modified to ensure system stability.
                  </p>
                </div>
              )}

              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Permissions</Label>
                  {!selectedRole.isDefault && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Select All
                      </Button>
                      <Button variant="outline" size="sm">
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>

                {permissionCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <h3 className="font-medium text-sm border-b pb-1">{category.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
                      {category.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`edit-${permission.id}`}
                            defaultChecked={selectedRole.permissions.includes(permission.id)}
                            disabled={selectedRole.isDefault && !selectedRole.permissions.includes(permission.id)}
                          />
                          <Label htmlFor={`edit-${permission.id}`} className="text-sm font-normal">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={() => setIsEditRoleDialogOpen(false)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
