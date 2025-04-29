"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle2, Clock, ListTodo, Users, ArrowUp, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import AssignProjectDialog from "@/components/dashboard/assign-project-dialog"

export default function DashboardPage() {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState({ id: 0, name: "" })

  const handleOpenAssignDialog = (projectId: number, projectName: string) => {
    setSelectedProject({ id: projectId, name: projectName })
    setIsAssignDialogOpen(true)
  }

  const handleAssignProject = (memberIds: number[]) => {
    console.log(`Assigned project ${selectedProject.id} to members:`, memberIds)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, John!</h1>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Export Report</Button>
          <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]">Add Project</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Tasks",
            value: "246",
            change: "+12%",
            icon: ListTodo,
          },
          {
            title: "Completed",
            value: "182",
            change: "+8%",
            icon: CheckCircle2,
          },
          {
            title: "Active Projects",
            value: "12",
            change: "+2",
            icon: Activity,
          },
          {
            title: "Team Members",
            value: "24",
            change: "+4",
            icon: Users,
          },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects & Tasks */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  name: "Website Redesign",
                  progress: 65,
                  members: 4,
                  dueDate: "2 days left",
                },
                {
                  id: 2,
                  name: "Mobile App Development",
                  progress: 32,
                  members: 6,
                  dueDate: "1 week left",
                },
                {
                  id: 3,
                  name: "Marketing Campaign",
                  progress: 89,
                  members: 3,
                  dueDate: "3 days left",
                },
              ].map((project) => (
                <div key={project.id} className="flex items-center p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{project.name}</p>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        {project.members} members
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {project.dueDate}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-4"
                    onClick={() => handleOpenAssignDialog(project.id, project.name)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: "Sarah K.",
                  action: "completed task",
                  target: "Homepage Design",
                  time: "2m ago",
                },
                {
                  user: "Mike R.",
                  action: "commented on",
                  target: "API Integration",
                  time: "15m ago",
                },
                {
                  user: "Anna M.",
                  action: "created task",
                  target: "User Testing",
                  time: "1h ago",
                },
                {
                  user: "David L.",
                  action: "updated",
                  target: "Project Timeline",
                  time: "3h ago",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-[#E5F9FF] flex items-center justify-center">
                    {activity.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Design Review",
                date: "Today, 2:00 PM",
                priority: "High",
                members: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
              },
              {
                title: "Client Meeting",
                date: "Tomorrow, 10:00 AM",
                priority: "Medium",
                members: ["/placeholder.svg", "/placeholder.svg"],
              },
              {
                title: "Project Deadline",
                date: "Friday, 6:00 PM",
                priority: "High",
                members: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
              },
            ].map((deadline, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{deadline.title}</h3>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      deadline.priority === "High" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700",
                    )}
                  >
                    {deadline.priority}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {deadline.date}
                </div>
                <div className="flex items-center -space-x-2">
                  {deadline.members.map((member, i) => (
                    <Image
                      key={i}
                      src={member || "/placeholder.svg"}
                      alt={`Team member ${i + 1}`}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Assignment Dialog */}
      <AssignProjectDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        projectName={selectedProject.name}
        onAssign={handleAssignProject}
        initialAssignees={[]}
      />
    </div>
  )
}
