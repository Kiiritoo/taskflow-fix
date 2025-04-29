"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Filter, MoreHorizontal, Mail, Phone } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const initialTeamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Frontend Developer",
    phone: "+1 234 567 890",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "UX Designer",
    phone: "+1 234 567 891",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Backend Developer",
    phone: "+1 234 567 892",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "Project Manager",
    phone: "+1 234 567 893",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex@example.com",
    role: "QA Engineer",
    phone: "+1 234 567 894",
    avatar: "/placeholder.svg",
  },
]

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "UX Designer",
  "Project Manager",
  "QA Engineer",
  "DevOps Engineer",
  "Data Scientist",
]

export default function TeamPage() {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "" })
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers)

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    setTeamMembers([
      ...teamMembers,
      {
        id: teamMembers.length + 1,
        ...newMember,
        phone: "+1 234 567 890", // You might want to add a phone field to the form
        avatar: "/placeholder.svg",
      },
    ])
    setNewMember({ name: "", email: "", role: "" })
    setIsAddMemberModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={() => setIsAddMemberModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search team members..." className="pl-9 focus-visible:ring-[#00B8D4]" />
          </div>
        </div>
        <div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role.toLowerCase().replace(" ", "-")}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Image
                src={member.avatar || "/placeholder.svg"}
                alt={member.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-gray-400" />
                {member.email}
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-gray-400" />
                {member.phone}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddMemberModalOpen} onOpenChange={setIsAddMemberModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
            <DialogDescription>Add a new member to your team.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMember}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div>
                  <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddMemberModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Member</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
