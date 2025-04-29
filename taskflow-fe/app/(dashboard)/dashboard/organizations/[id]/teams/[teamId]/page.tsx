"use client"

import { Checkbox } from "@/components/ui/checkbox"

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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Settings, Users, UserPlus, Shield, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

// Sample data for the team
const initialTeam = {
  id: 1,
  name: "Engineering",
  description: "Product development team",
  members: [
    { id: 1, name: "John Doe", email: "john@example.com", avatar: "/placeholder.svg", role: "Team Lead" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", avatar: "/placeholder.svg", role: "Senior Developer" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", avatar: "/placeholder.svg", role: "Developer" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", avatar: "/placeholder.svg", role: "QA Engineer" },
  ],
  projects: [
    {
      id: 1,
      name: "Website Redesign",
      description: "Redesigning the company website",
      status: "In Progress",
      progress: 65,
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Building a new mobile app",
      status: "Planning",
      progress: 20,
    },
    {
      id: 3,
      name: "API Integration",
      description: "Integrating with third-party APIs",
      status: "In Progress",
      progress: 45,
    },
  ],
  roles: [
    {
      id: 1,
      name: "Team Lead",
      description: "Manages the team and projects",
      permissions: ["manage_team", "manage_projects", "view_reports"],
    },
    {
      id: 2,
      name: "Senior Developer",
      description: "Leads development efforts",
      permissions: ["view_projects", "edit_tasks", "create_tasks"],
    },
    {
      id: 3,
      name: "Developer",
      description: "Works on development tasks",
      permissions: ["view_projects", "edit_tasks"],
    },
    {
      id: 4,
      name: "QA Engineer",
      description: "Ensures quality of deliverables",
      permissions: ["view_projects", "create_tasks"],
    },
  ],
}

const allPermissions = [
  { id: "manage_team", name: "Manage Team" },
  { id: "manage_projects", name: "Manage Projects" },
  { id: "view_reports", name: "View Reports" },
  { id: "view_projects", name: "View Projects" },
  { id: "edit_tasks", name: "Edit Tasks" },
  { id: "create_tasks", name: "Create Tasks" },
  { id: "delete_tasks", name: "Delete Tasks" },
  { id: "invite_members", name: "Invite Members" },
]

export default function TeamDetailsPage() {
  const [team, setTeam] = useState(initialTeam)
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "" })
  const [newProject, setNewProject] = useState({ name: "", description: "", status: "Planning" })
  const [newRole, setNewRole] = useState({ name: "", description: "", permissions: [] })

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.role) {
      setTeam({
        ...team,
        members: [...team.members, { ...newMember, id: team.members.length + 1, avatar: "/placeholder.svg" }],
      })
      setNewMember({ name: "", email: "", role: "" })
      setIsAddMemberDialogOpen(false)
    }
  }

  const handleCreateProject = () => {
    if (newProject.name && newProject.description) {
      setTeam({
        ...team,
        projects: [...team.projects, { ...newProject, id: team.projects.length + 1, progress: 0 }],
      })
      setNewProject({ name: "", description: "", status: "Planning" })
      setIsCreateProjectDialogOpen(false)
    }
  }

  const handleCreateRole = () => {
    if (newRole.name && newRole.description) {
      setTeam({
        ...team,
        roles: [...team.roles, { ...newRole, id: team.roles.length + 1 }],
      })
      setNewRole({ name: "", description: "", permissions: [] })
      setIsCreateRoleDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-muted-foreground">{team.description}</p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Team Settings
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.members.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                <PlusCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Team Roles</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.roles.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.members.slice(0, 3).map((member) => (
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
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{project.name}</p>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {project.status}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#00B8D4] h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
            <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button className="ml-4 bg-[#00B8D4] hover:bg-[#00A0B8]">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>Add a new member to this team.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-name">Name</Label>
                    <Input
                      id="member-name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="Enter member name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-email">Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="Enter member email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-role">Role</Label>
                    <Select
                      value={newMember.role}
                      onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {team.roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={handleAddMember}>
                    Add to Team
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {team.members.map((member) => (
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
                        <div className="text-sm text-gray-900">{member.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm">
                          Edit Role
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

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search projects..." className="pl-9 focus-visible:ring-[#00B8D4]" />
              </div>
            </div>
            <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button className="ml-4 bg-[#00B8D4] hover:bg-[#00A0B8]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>Create a new project for this team.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Brief description of the project"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-status">Status</Label>
                    <Select
                      value={newProject.status}
                      onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Review">Review</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateProjectDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={handleCreateProject}>
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{project.name}</CardTitle>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{project.status}</span>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#00B8D4] h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search roles..." className="pl-9 focus-visible:ring-[#00B8D4]" />
              </div>
            </div>
            <Dialog open={isCreateRoleDialogOpen} onOpenChange={setIsCreateRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="ml-4 bg-[#00B8D4] hover:bg-[#00A0B8]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>Define a new role with specific permissions.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                      id="role-name"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description</Label>
                    <Input
                      id="role-description"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Brief description of the role"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {allPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewRole({ ...newRole, permissions: [...newRole.permissions, permission.id] })
                              } else {
                                setNewRole({
                                  ...newRole,
                                  permissions: newRole.permissions.filter((p) => p !== permission.id),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={permission.id}>{permission.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateRoleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={handleCreateRole}>
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle>{role.name}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
