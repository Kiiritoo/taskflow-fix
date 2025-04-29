"use client"

import { useState, useEffect } from "react"
import { useOrganization } from "@/contexts/OrganizationContext"
import AssignProjectDialog from "@/components/dashboard/assign-project-dialog"
import { AddTaskModal } from "@/components/dashboard/AddTaskModal"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Search, Filter, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample tasks for different organizations
const orgTasks = {
  1: [
    {
      id: 1,
      title: "Design new landing page",
      project: "Website Redesign",
      priority: "High",
      dueDate: "2023-07-15",
      status: "In Progress",
      assignees: [1, 2],
    },
    {
      id: 2,
      title: "Implement user authentication",
      project: "Mobile App",
      priority: "Medium",
      dueDate: "2023-07-20",
      status: "To Do",
      assignees: [],
    },
  ],
  2: [
    {
      id: 1,
      title: "Create marketing campaign",
      project: "Product Launch",
      priority: "High",
      dueDate: "2023-07-18",
      status: "In Progress",
      assignees: [1, 3],
    },
    {
      id: 2,
      title: "Analyze competitor products",
      project: "Market Research",
      priority: "Medium",
      dueDate: "2023-07-25",
      status: "To Do",
      assignees: [],
    },
  ],
  3: [
    {
      id: 1,
      title: "Develop new AI model",
      project: "R&D",
      priority: "High",
      dueDate: "2023-07-30",
      status: "In Progress",
      assignees: [1, 2, 4],
    },
    {
      id: 2,
      title: "Optimize manufacturing process",
      project: "Operations",
      priority: "Medium",
      dueDate: "2023-08-05",
      status: "To Do",
      assignees: [],
    },
  ],
}

export default function TasksPage() {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState({ id: 0, title: "" })
  const [tasks, setTasks] = useState([])
  const { currentOrg } = useOrganization()

  useEffect(() => {
    setTasks(orgTasks[currentOrg.id] || [])
  }, [currentOrg])

  const handleOpenAssignDialog = (taskId: number, taskTitle: string) => {
    setSelectedTask({ id: taskId, title: taskTitle })
    setIsAssignDialogOpen(true)
  }

  const handleAssignTask = (memberIds: number[]) => {
    console.log(`Assigned task ${selectedTask.id} to members:`, memberIds)
    setTasks(tasks.map((task) => (task.id === selectedTask.id ? { ...task, assignees: memberIds } : task)))
  }

  const handleAddTask = (newTask) => {
    const taskId = tasks.length + 1
    const task = {
      id: taskId,
      title: newTask.title,
      project: newTask.project,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      status: "To Do",
      assignees: [],
    }
    setTasks([...tasks, task])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Tasks - {currentOrg.name}</h1>
        <Button className="bg-[#00B8D4] hover:bg-[#00A0B8]" onClick={() => setIsAddTaskModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input type="search" placeholder="Search tasks..." className="pl-9 focus-visible:ring-[#00B8D4]" />
          </div>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="website">Website Redesign</SelectItem>
            <SelectItem value="mobile">Mobile App</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Checkbox />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignees
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{task.project}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === "To Do"
                        ? "bg-gray-100 text-gray-800"
                        : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : task.status === "In Review"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex -space-x-1">
                    {task.assignees.length > 0 ? (
                      task.assignees.slice(0, 3).map((assigneeId) => (
                        <div
                          key={assigneeId}
                          className="h-6 w-6 rounded-full bg-[#E5F9FF] border-2 border-white flex items-center justify-center text-xs"
                        >
                          {assigneeId}
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                    {task.assignees.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                        +{task.assignees.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleOpenAssignDialog(task.id, task.title)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Change Status</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AssignProjectDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        projectName={selectedTask.title}
        onAssign={handleAssignTask}
        initialAssignees={tasks.find((t) => t.id === selectedTask.id)?.assignees || []}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  )
}
