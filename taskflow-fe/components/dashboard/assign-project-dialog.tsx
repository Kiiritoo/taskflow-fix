"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Sample team members data
const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg",
    role: "Frontend Developer",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg",
    role: "UX Designer",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "/placeholder.svg",
    role: "Backend Developer",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "/placeholder.svg",
    role: "Project Manager",
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex@example.com",
    avatar: "/placeholder.svg",
    role: "QA Engineer",
  },
]

interface AssignProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  onAssign: (memberIds: number[]) => void
  initialAssignees?: number[]
}

export default function AssignProjectDialog({
  open,
  onOpenChange,
  projectName,
  onAssign,
  initialAssignees = [],
}: AssignProjectDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<number[]>(initialAssignees)

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleToggleMember = (memberId: number) => {
    setSelectedMembers((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const handleAssign = () => {
    onAssign(selectedMembers)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogDescription>
            Assign team members to <span className="font-medium">{projectName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search team members..."
              className="pl-9 focus-visible:ring-[#00B8D4]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
            {filteredMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                <Checkbox
                  id={`member-${member.id}`}
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleToggleMember(member.id)}
                />
                <Label htmlFor={`member-${member.id}`} className="flex items-center space-x-3 flex-1 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </Label>
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="text-center py-4 text-gray-500">No team members found</div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={handleAssign}>
            Assign {selectedMembers.length > 0 ? `(${selectedMembers.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
