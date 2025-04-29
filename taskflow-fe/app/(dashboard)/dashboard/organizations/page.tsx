"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { PlusCircle, Search, Settings, Users, UserPlus, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample data for organizations
const initialOrganizations = [
  {
    id: 1,
    name: "Acme Inc",
    logo: "/placeholder.svg",
    members: 12,
    teams: 4,
    role: "Owner",
  },
  {
    id: 2,
    name: "Globex Corporation",
    logo: "/placeholder.svg",
    members: 8,
    teams: 3,
    role: "Admin",
  },
  {
    id: 3,
    name: "Stark Industries",
    logo: "/placeholder.svg",
    members: 24,
    teams: 6,
    role: "Member",
  },
]

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState(initialOrganizations)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newOrg, setNewOrg] = useState({ name: "", description: "" })

  const handleCreateOrganization = () => {
    if (newOrg.name) {
      setOrganizations([
        ...organizations,
        {
          id: organizations.length + 1,
          name: newOrg.name,
          logo: "/placeholder.svg",
          members: 1,
          teams: 0,
          role: "Owner",
        },
      ])
      setNewOrg({ name: "", description: "" })
      setIsCreateDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>Create a new organization to manage your teams and projects.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-description">Description (Optional)</Label>
                <Input
                  id="org-description"
                  value={newOrg.description}
                  onChange={(e) => setNewOrg({ ...newOrg, description: e.target.value })}
                  placeholder="Brief description of your organization"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={handleCreateOrganization}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search organizations..." className="pl-9 focus-visible:ring-[#00B8D4]" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <Card key={org.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Image
                  src={org.logo || "/placeholder.svg"}
                  alt={org.name}
                  width={48}
                  height={48}
                  className="rounded-md"
                />
                <div>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Shield className="h-3.5 w-3.5 mr-1 text-[#00B8D4]" />
                    {org.role}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{org.members} members</span>
                </div>
                <div>
                  <span>{org.teams} teams</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 px-6 py-3">
              <div className="flex justify-between w-full">
                <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
                  <Link href={`/dashboard/organizations/${org.id}`}>
                    <Settings className="mr-1 h-3.5 w-3.5" />
                    Manage
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-8">
                  <UserPlus className="mr-1 h-3.5 w-3.5" />
                  Invite
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
