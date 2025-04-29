"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { PlusCircle, Search, Settings, Users, UserPlus, Shield, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

// Sample data for the organization
const organization = {
  id: 1,
  name: "Acme Inc",
  logo: "/placeholder.svg",
  description: "A leading software development company",
  members: 12,
  teams: 4,
  role: "Owner",
}

// Sample data for teams
const teams = [
  {
    id: 1,
    name: "Engineering",
    description: "Product development team",
    members: 6,
  },
  {
    id: 2,
    name: "Design",
    description: "UI/UX design team",
    members: 3,
  },
  {
    id: 3,
    name: "Marketing",
    description: "Marketing and growth team",
    members: 4,
  },
  {
    id: 4,
    name: "Operations",
    description: "Operations and support team",
    members: 5,
  },
]

// Sample data for members
const members = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg",
    role: "Owner",
    teams: ["Engineering", "Operations"],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg",
    role: "Admin",
    teams: ["Design"],
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "/placeholder.svg",
    role: "Member",
    teams: ["Marketing"],
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "/placeholder.svg",
    role: "Member",
    teams: ["Engineering"],
  },
]

// Sample data for roles
const roles = [
  {
    id: 1,
    name: "Owner",
    description: "Full access to all resources",
    isDefault: true,
    permissions: ["manage_organization", "manage_teams", "manage_members", "manage_roles", "manage_projects"],
  },
  {
    id: 2,
    name: "Admin",
    description: "Can manage teams and members",
    isDefault: true,
    permissions: ["manage_teams", "manage_members", "manage_projects"],
  },
  {
    id: 3,
    name: "Member",
    description: "Can view and work on assigned projects",
    isDefault: true,
    permissions: ["view_projects", "edit_assigned_tasks"],
  },
  {
    id: 4,
    name: "Project Manager",
    description: "Can manage specific projects",
    isDefault: false,
    permissions: ["manage_assigned_projects", "view_all_projects"],
  },
]

export default function OrganizationDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false)
  const [isInviteMemberDialogOpen, setIsInviteMemberDialogOpen] = useState(false)
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={organization.logo || "/placeholder.svg"}
            alt={organization.name}
            width={48}
            height={48}
            className="rounded-md"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{organization.name}</h1>
            <p className="text-muted-foreground">{organization.description}</p>
          </div>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Organization Settings
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Members",
                value: organization.members,
                icon: Users,
              },
              {
                title: "Teams",
                value: organization.teams,
                icon: Users,
              },
              {
                title: "Your Role",
                value: organization.role,
                icon: Shield,
              },
              {
                title: "Projects",
                value: "8",
                icon: PlusCircle,
              },
            ].map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.slice(0, 3).map((team) => (
                    <div key={team.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">{team.description}</p>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        {team.members}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center gap-4">
                      <Image
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="ml-auto flex items-center">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search teams..." className="pl-9 focus-visible:ring-[#00B8D4]" />
              </div>
            </div>
            <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button className="ml-4 bg-[#00B8D4] hover:bg-[#00A0B8]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>Create a new team to organize members and projects.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input id="team-name" placeholder="Enter team name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-description">Description (Optional)</Label>
                    <Input id="team-description" placeholder="Brief description of your team" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateTeamDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={() => setIsCreateTeamDialogOpen(false)}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{team.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{team.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Users className="mr-1 h-4 w-4 text-gray-400" />
                      {team.members} members
                    </div>
                    <Button variant="outline" size="sm">
                      <UserPlus className="mr-1 h-3.5 w-3.5" />
                      Add Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search members..." className="pl-9 focus-visible:ring-[#00B8D4]" />
              </div>
            </div>
            <Dialog open={isInviteMemberDialogOpen} onOpenChange={setIsInviteMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button className="ml-4 bg-[#00B8D4] hover:bg-[#00A0B8]">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New Member</DialogTitle>
                  <DialogDescription>Invite a new member to join your organization.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-email">Email Address</Label>
                    <Input id="member-email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-role">Role</Label>
                    <select id="member-role" className="w-full rounded-md border border-input bg-background px-3 py-2">
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-teams">Teams (Optional)</Label>
                    <select id="member-teams" className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="">Select a team</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.name}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteMemberDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#00B8D4] hover:bg-[#00A0B8]"
                    onClick={() => setIsInviteMemberDialogOpen(false)}
                  >
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teams
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {member.teams.map((team, index) => (
                            <span
                              key={index}
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                            >
                              {team}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Custom Roles</h2>
              <p className="text-sm text-muted-foreground">
                Manage custom roles and permissions for your organization.
              </p>
            </div>
            <Dialog open={isCreateRoleDialogOpen} onOpenChange={setIsCreateRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Custom Role</DialogTitle>
                  <DialogDescription>Define a new role with custom permissions.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input id="role-name" placeholder="Enter role name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description</Label>
                    <Input id="role-description" placeholder="Brief description of this role" />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      {[
                        "View projects",
                        "Edit projects",
                        "Create projects",
                        "Delete projects",
                        "Manage team members",
                        "Invite members",
                        "Manage roles",
                      ].map((permission, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input type="checkbox" id={`permission-${index}`} className="rounded" />
                          <Label htmlFor={`permission-${index}`}>{permission}</Label>
                        </div>
                      ))}
                    </div>
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

          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!role.isDefault && (
                          <>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              Delete
                            </Button>
                          </>
                        )}
                        {role.isDefault && (
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
