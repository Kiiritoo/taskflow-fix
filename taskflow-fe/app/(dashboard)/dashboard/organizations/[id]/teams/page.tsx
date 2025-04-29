"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { PlusCircle, Users } from "lucide-react"
import { useParams } from "next/navigation"

// Sample data for teams
const initialTeams = {
  1: [
    {
      id: 1,
      name: "Engineering",
      description: "Product development team",
      members: 6,
      roles: ["Developer", "Designer", "Product Manager"],
    },
    {
      id: 2,
      name: "Marketing",
      description: "Marketing and growth team",
      members: 4,
      roles: ["Marketing Specialist", "Content Writer"],
    },
  ],
  2: [
    {
      id: 1,
      name: "Sales",
      description: "Sales and customer relations team",
      members: 5,
      roles: ["Sales Representative", "Account Manager"],
    },
    {
      id: 2,
      name: "Customer Support",
      description: "Customer service and support team",
      members: 3,
      roles: ["Support Specialist", "Technical Support"],
    },
  ],
  3: [
    {
      id: 1,
      name: "Research",
      description: "R&D team",
      members: 8,
      roles: ["Researcher", "Data Scientist", "Lab Technician"],
    },
    {
      id: 2,
      name: "Operations",
      description: "Operations and logistics team",
      members: 6,
      roles: ["Operations Manager", "Supply Chain Specialist"],
    },
  ],
}

export default function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [activeTab, setActiveTab] = useState("teams")
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: "", description: "" })

  const params = useParams()
  const organizationId = params.id

  useEffect(() => {
    // In a real application, you would fetch the teams for the current organization
    // For now, we'll use the sample data
    setTeams(initialTeams[organizationId] || [])
  }, [organizationId])

  const handleCreateTeam = () => {
    if (newTeam.name) {
      setTeams([...teams, { ...newTeam, id: teams.length + 1, members: 0, roles: [] }])
      setNewTeam({ name: "", description: "" })
      setIsCreateTeamDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
        <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>Create a new team for your organization.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder="Enter team name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Input
                  id="team-description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  placeholder="Brief description of the team"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateTeamDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={handleCreateTeam}>
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>{team.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{team.members} members</span>
                </div>
                <div>
                  <span>{team.roles.length} roles</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {team.roles.map((role, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {role}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
