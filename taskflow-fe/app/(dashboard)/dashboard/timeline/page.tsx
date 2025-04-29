"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ZoomIn,
  ZoomOut,
  Edit,
  Trash2,
  Link,
  Search,
  ListFilter,
  Group,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddTaskModal } from "@/components/dashboard/AddTaskModal"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useMediaQuery } from "@/hooks/use-media-query.ts"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Sample project data with more detailed tasks
const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of the company website with new design and features",
    progress: 45,
    tasks: [
      {
        id: 1,
        name: "Design mockups",
        startDate: "2023-07-01",
        endDate: "2023-07-10",
        status: "completed",
        priority: "high",
        assignees: [1, 2],
        description: "Create design mockups for all main pages including homepage, about, services, and contact",
        dependencies: [],
      },
      {
        id: 2,
        name: "Frontend development",
        startDate: "2023-07-11",
        endDate: "2023-07-25",
        status: "in-progress",
        priority: "high",
        assignees: [3],
        description: "Implement responsive frontend using React and Tailwind CSS",
        dependencies: [1],
      },
      {
        id: 3,
        name: "Backend integration",
        startDate: "2023-07-20",
        endDate: "2023-08-05",
        status: "in-progress",
        priority: "medium",
        assignees: [4],
        description: "Connect frontend to backend APIs and implement data flow",
        dependencies: [2],
      },
      {
        id: 4,
        name: "Testing and QA",
        startDate: "2023-08-06",
        endDate: "2023-08-15",
        status: "upcoming",
        priority: "medium",
        assignees: [5],
        description:
          "Perform comprehensive testing including unit tests, integration tests, and user acceptance testing",
        dependencies: [3],
      },
      {
        id: 5,
        name: "Content migration",
        startDate: "2023-08-10",
        endDate: "2023-08-20",
        status: "upcoming",
        priority: "low",
        assignees: [2, 6],
        description: "Migrate existing content to the new website structure",
        dependencies: [2],
      },
      {
        id: 6,
        name: "Launch preparation",
        startDate: "2023-08-21",
        endDate: "2023-08-25",
        status: "upcoming",
        priority: "high",
        assignees: [1, 3, 4],
        description: "Prepare for website launch including DNS configuration and server setup",
        dependencies: [4, 5],
      },
      {
        id: 7,
        name: "Go live",
        startDate: "2023-08-26",
        endDate: "2023-08-26",
        status: "upcoming",
        priority: "critical",
        assignees: [1, 3, 4, 5],
        description: "Launch the new website and monitor for any issues",
        dependencies: [6],
      },
    ],
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Develop a new mobile app for iOS and Android platforms",
    progress: 30,
    tasks: [
      {
        id: 8,
        name: "Requirements gathering",
        startDate: "2023-07-05",
        endDate: "2023-07-15",
        status: "completed",
        priority: "high",
        assignees: [1, 7],
        description: "Collect and document all requirements for the mobile app",
        dependencies: [],
      },
      {
        id: 9,
        name: "UI/UX design",
        startDate: "2023-07-16",
        endDate: "2023-07-31",
        status: "in-progress",
        priority: "high",
        assignees: [2],
        description: "Design user interface and experience for the mobile app",
        dependencies: [8],
      },
      {
        id: 10,
        name: "App development",
        startDate: "2023-08-01",
        endDate: "2023-08-31",
        status: "upcoming",
        priority: "high",
        assignees: [3, 4],
        description: "Develop the mobile app using React Native for cross-platform compatibility",
        dependencies: [9],
      },
      {
        id: 11,
        name: "Testing and deployment",
        startDate: "2023-09-01",
        endDate: "2023-09-15",
        status: "upcoming",
        priority: "medium",
        assignees: [5],
        description: "Test the app on various devices and deploy to app stores",
        dependencies: [10],
      },
    ],
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Q3 marketing campaign for product launch",
    progress: 15,
    tasks: [
      {
        id: 12,
        name: "Campaign strategy",
        startDate: "2023-07-10",
        endDate: "2023-07-20",
        status: "completed",
        priority: "high",
        assignees: [7, 8],
        description: "Develop comprehensive marketing strategy for the campaign",
        dependencies: [],
      },
      {
        id: 13,
        name: "Content creation",
        startDate: "2023-07-21",
        endDate: "2023-08-10",
        status: "in-progress",
        priority: "medium",
        assignees: [6, 9],
        description: "Create all content assets including copy, images, and videos",
        dependencies: [12],
      },
      {
        id: 14,
        name: "Channel setup",
        startDate: "2023-08-05",
        endDate: "2023-08-15",
        status: "upcoming",
        priority: "medium",
        assignees: [8],
        description: "Set up all marketing channels including social media, email, and paid advertising",
        dependencies: [12],
      },
      {
        id: 15,
        name: "Campaign launch",
        startDate: "2023-08-16",
        endDate: "2023-08-20",
        status: "upcoming",
        priority: "critical",
        assignees: [7, 8, 9],
        description: "Launch the marketing campaign across all channels",
        dependencies: [13, 14],
      },
      {
        id: 16,
        name: "Performance monitoring",
        startDate: "2023-08-21",
        endDate: "2023-09-20",
        status: "upcoming",
        priority: "low",
        assignees: [8],
        description: "Monitor campaign performance and make adjustments as needed",
        dependencies: [15],
      },
    ],
  },
]

// Sample team members
const teamMembers = [
  { id: 1, name: "John Doe", avatar: "/placeholder.svg", role: "Project Manager" },
  { id: 2, name: "Jane Smith", avatar: "/placeholder.svg", role: "UI/UX Designer" },
  { id: 3, name: "Mike Johnson", avatar: "/placeholder.svg", role: "Frontend Developer" },
  { id: 4, name: "Sarah Williams", avatar: "/placeholder.svg", role: "Backend Developer" },
  { id: 5, name: "Alex Brown", avatar: "/placeholder.svg", role: "QA Engineer" },
  { id: 6, name: "Lisa Chen", avatar: "/placeholder.svg", role: "Content Specialist" },
  { id: 7, name: "David Wilson", avatar: "/placeholder.svg", role: "Marketing Manager" },
  { id: 8, name: "Emily Davis", avatar: "/placeholder.svg", role: "Marketing Specialist" },
  { id: 9, name: "Ryan Taylor", avatar: "/placeholder.svg", role: "Graphic Designer" },
]

// View options for the timeline
const viewOptions = [
  { id: "month", name: "Month" },
  { id: "week", name: "Week" },
  { id: "day", name: "Day" },
]

export default function TimelinePage() {
  const [currentDate, setCurrentDate] = useState(new Date("2023-07-01"))
  const [selectedProject, setSelectedProject] = useState(projects[0])
  const [currentView, setCurrentView] = useState("month")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [filteredStatus, setFilteredStatus] = useState("all")
  const [filteredPriority, setFilteredPriority] = useState("all")
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [groupBy, setGroupBy] = useState("none")
  const [isLoading, setIsLoading] = useState(true)
  const timelineRef = useRef(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter tasks based on selected filters
  const filteredTasks = selectedProject.tasks.filter((task) => {
    if (filteredStatus !== "all" && task.status !== filteredStatus) return false
    if (filteredPriority !== "all" && task.priority !== filteredPriority) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        task.name.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Group tasks based on selected grouping
  const groupedTasks = () => {
    if (groupBy === "none") return { "All Tasks": filteredTasks }

    return filteredTasks.reduce((groups, task) => {
      const key =
        groupBy === "status"
          ? task.status
          : groupBy === "priority"
            ? task.priority
            : groupBy === "assignee"
              ? task.assignees[0]
                ? teamMembers.find((m) => m.id === task.assignees[0])?.name || "Unassigned"
                : "Unassigned"
              : "All Tasks"

      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(task)
      return groups
    }, {})
  }

  // Handle date navigation
  const navigateDate = (direction) => {
    if (currentView === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
    } else if (currentView === "week") {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + direction * 7)
      setCurrentDate(newDate)
    } else if (currentView === "day") {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + direction)
      setCurrentDate(newDate)
    }
  }

  // Get date range for display
  const getDateRangeText = () => {
    if (currentView === "month") {
      return currentDate.toLocaleString("default", { month: "long", year: "numeric" })
    } else if (currentView === "week") {
      const endDate = new Date(currentDate)
      endDate.setDate(endDate.getDate() + 6)
      return `${currentDate.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`
    } else {
      return currentDate.toLocaleDateString("default", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    }
  }

  // Handle task selection
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsTaskDetailsOpen(true)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "upcoming":
        return "bg-gray-300"
      default:
        return "bg-gray-300"
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-red-400 text-white"
      case "medium":
        return "bg-yellow-400"
      case "low":
        return "bg-green-400"
      default:
        return "bg-gray-300"
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-600 hover:bg-red-700">Critical</Badge>
      case "high":
        return <Badge className="bg-red-400 hover:bg-red-500">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-400 hover:bg-yellow-500 text-black">Medium</Badge>
      case "low":
        return <Badge className="bg-green-400 hover:bg-green-500 text-black">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
      case "upcoming":
        return <Badge className="bg-gray-400 hover:bg-gray-500">Upcoming</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Calculate timeline dimensions
  const calculateTimelineDimensions = () => {
    // Get all tasks for the selected project
    const tasks = selectedProject.tasks

    // Find the earliest start date and latest end date
    let earliestDate = new Date(tasks[0].startDate)
    let latestDate = new Date(tasks[0].endDate)

    tasks.forEach((task) => {
      const startDate = new Date(task.startDate)
      const endDate = new Date(task.endDate)

      if (startDate < earliestDate) earliestDate = startDate
      if (endDate > latestDate) latestDate = endDate
    })

    // Add some padding
    earliestDate.setDate(earliestDate.getDate() - 5)
    latestDate.setDate(latestDate.getDate() + 5)

    return { startDate: earliestDate, endDate: latestDate }
  }

  const { startDate, endDate } = calculateTimelineDimensions()
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

  // Calculate task position and width
  const getTaskStyle = (task) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)

    const startOffset = Math.ceil((taskStart - startDate) / (1000 * 60 * 60 * 24))
    const duration = Math.ceil((taskEnd - taskStart) / (1000 * 60 * 60 * 24)) + 1

    const left = `${(startOffset / totalDays) * 100}%`
    const width = `${(duration / totalDays) * 100}%`

    return { left, width }
  }

  // Generate month labels for the timeline
  const generateMonthLabels = () => {
    const months = []
    const currentMonth = new Date(startDate)
    currentMonth.setDate(1)

    while (currentMonth <= endDate) {
      const monthStart = new Date(currentMonth)
      currentMonth.setMonth(currentMonth.getMonth() + 1)
      const monthEnd = new Date(currentMonth)
      monthEnd.setDate(monthEnd.getDate() - 1)

      const startOffset = Math.max(0, (monthStart - startDate) / (1000 * 60 * 60 * 24))
      const width = Math.min(
        (monthEnd - monthStart) / (1000 * 60 * 60 * 24) + 1,
        (monthEnd - startDate) / (1000 * 60 * 60 * 24) - startOffset + 1,
      )

      months.push({
        name: monthStart.toLocaleString("default", { month: "short" }),
        year: monthStart.getFullYear(),
        left: `${(startOffset / totalDays) * 100}%`,
        width: `${(width / totalDays) * 100}%`,
      })
    }

    return months
  }

  const handleAddTask = (task) => {
    console.log("New task:", task)
    setIsAddTaskModalOpen(false)
  }

  // Handle drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return

    const sourceGroup = result.source.droppableId
    const destinationGroup = result.destination.droppableId
    const taskId = Number.parseInt(result.draggableId)

    // Update task status or group based on where it was dropped
    console.log(`Moving task ${taskId} from ${sourceGroup} to ${destinationGroup}`)
    // Implement your task update logic here
  }

  // Touch handlers for mobile zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setTouchStart(getTouchDistance(e.touches))
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchStart) {
      const currentDistance = getTouchDistance(e.touches)
      const difference = currentDistance - touchStart
      const newZoom = Math.max(50, Math.min(200, zoomLevel + difference / 2))
      setZoomLevel(newZoom)
      setTouchStart(currentDistance)
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  const getTouchDistance = (touches) => {
    return Math.hypot(touches[1].clientX - touches[0].clientX, touches[1].clientY - touches[0].clientY)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT") return

      switch (e.key) {
        case "ArrowLeft":
          navigateDate(-1)
          break
        case "ArrowRight":
          navigateDate(1)
          break
        case "+":
          setZoomLevel((prev) => Math.min(200, prev + 10))
          break
        case "-":
          setZoomLevel((prev) => Math.max(50, prev - 10))
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, []) // Removed navigateDate from dependencies

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Timeline</h1>
          <p className="text-sm text-muted-foreground">Manage and track your project timeline</p>
        </div>
        <Button
          className="bg-[#00B8D4] hover:bg-[#00A0B8] w-full sm:w-auto"
          onClick={() => setIsAddTaskModalOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Controls */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Select
                value={selectedProject.id.toString()}
                onValueChange={(value) => setSelectedProject(projects.find((p) => p.id.toString() === value))}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="flex-1">
                  <Group className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Grouping</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="assignee">Assignee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Card className="flex-1">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-sm font-medium">{getDateRangeText()}</h2>
                <Button variant="outline" size="sm" onClick={() => navigateDate(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Tabs defaultValue={currentView} className="hidden sm:block">
                  <TabsList className="grid w-[180px] grid-cols-3">
                    {viewOptions.map((option) => (
                      <TabsTrigger key={option.id} value={option.id} onClick={() => setCurrentView(option.id)}>
                        {option.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <Select value={currentView} onValueChange={setCurrentView} className="sm:hidden">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    {viewOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none border-r"
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="px-2 text-xs font-medium">{zoomLevel}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none border-l"
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <ListFilter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Filter by Status</h4>
                <Select value={filteredStatus} onValueChange={setFilteredStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Filter by Priority</h4>
                <Select value={filteredPriority} onValueChange={setFilteredPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilteredStatus("all")
                  setFilteredPriority("all")
                }}
              >
                Reset Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Timeline */}
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(groupedTasks()).map(([groupName, tasks]) => (
          <Card key={groupName} className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{groupName}</span>
                <Badge>{tasks.length} Tasks</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea
                ref={timelineRef}
                className="relative"
                style={{ height: Math.max(400, tasks.length * 60) }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Droppable droppableId={groupName}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="relative"
                        style={{
                          width: `${zoomLevel}%`,
                          minWidth: "100%",
                        }}
                      >
                        {/* Month labels */}
                        <div className="sticky top-0 z-10 bg-background border-b mb-2">
                          <div className="relative h-8">
                            {generateMonthLabels().map((month, index) => (
                              <div
                                key={index}
                                className="absolute top-0 h-full border-l flex items-center px-2 text-xs font-medium text-muted-foreground"
                                style={{ left: month.left, width: month.width }}
                              >
                                {month.name} {month.year}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tasks */}
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => {
                              const { left, width } = getTaskStyle(task)
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "absolute h-12 rounded-md cursor-pointer transition-all",
                                    snapshot.isDragging ? "shadow-lg" : "hover:shadow-md",
                                  )}
                                  style={{
                                    ...provided.draggableProps.style,
                                    left,
                                    width,
                                    top: `${index * 60 + 40}px`,
                                  }}
                                  onClick={() => handleTaskClick(task)}
                                >
                                  <div
                                    className={cn(
                                      "absolute inset-0 rounded-md opacity-90",
                                      getStatusColor(task.status),
                                    )}
                                  />
                                  <div
                                    className={cn(
                                      "absolute top-0 left-0 h-full w-1 rounded-l-md",
                                      getPriorityColor(task.priority),
                                    )}
                                  />
                                  <div className="relative z-10 flex items-center h-full px-3">
                                    <span className="font-medium text-sm text-white truncate">{task.name}</span>
                                    {task.assignees.length > 0 && (
                                      <div className="ml-2 flex -space-x-1">
                                        {task.assignees.slice(0, 3).map((assigneeId) => {
                                          const member = teamMembers.find((m) => m.id === assigneeId)
                                          return member ? (
                                            <Image
                                              key={member.id}
                                              src={member.avatar || "/placeholder.svg"}
                                              alt={member.name}
                                              width={24}
                                              height={24}
                                              className="rounded-full border-2 border-white"
                                            />
                                          ) : null
                                        })}
                                        {task.assignees.length > 3 && (
                                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 border-2 border-white text-xs font-medium">
                                            +{task.assignees.length - 3}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Dependencies */}
                                  {task.dependencies.map((depId) => {
                                    const depTask = tasks.find((t) => t.id === depId)
                                    if (!depTask) return null

                                    const depIndex = tasks.findIndex((t) => t.id === depId)
                                    if (depIndex === -1) return null

                                    return (
                                      <div
                                        key={`${task.id}-${depId}`}
                                        className="absolute w-2 h-2 rounded-full bg-gray-500"
                                        style={{
                                          left: "-4px",
                                          top: "50%",
                                          transform: "translateY(-50%)",
                                        }}
                                      >
                                        <div
                                          className="absolute bg-gray-300"
                                          style={{
                                            height: `${Math.abs((index - depIndex) * 60)}px`,
                                            width: "2px",
                                            top: index > depIndex ? "0" : "100%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            zIndex: -1,
                                          }}
                                        />
                                      </div>
                                    )
                                  })}
                                </div>
                              )
                            }}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </DragDropContext>

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedTask.name}</DialogTitle>
              <DialogDescription>Task details and management</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="flex flex-wrap gap-2 items-center">
                {getStatusBadge(selectedTask.status)}
                {getPriorityBadge(selectedTask.priority)}
                <Badge variant="outline" className="ml-auto">
                  {new Date(selectedTask.startDate).toLocaleDateString()} -{" "}
                  {new Date(selectedTask.endDate).toLocaleDateString()}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Assignees</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.assignees.map((assigneeId) => {
                      const member = teamMembers.find((m) => m.id === assigneeId)
                      return member ? (
                        <div key={member.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                          <Image
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-sm">{member.name}</span>
                        </div>
                      ) : null
                    })}
                    {selectedTask.assignees.length === 0 && (
                      <span className="text-sm text-muted-foreground">No assignees</span>
                    )}
                  </div>
                </div>

                {selectedTask.dependencies.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Dependencies</h3>
                    <div className="space-y-2">
                      {selectedTask.dependencies.map((depId) => {
                        const depTask = selectedProject.tasks.find((t) => t.id === depId)
                        return depTask ? (
                          <div key={depId} className="flex items-center gap-2 text-sm">
                            <Link className="h-4 w-4 text-muted-foreground" />
                            <span>Depends on: {depTask.name}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Tabs defaultValue="comments">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="p-4 bg-muted rounded-md min-h-[100px]">
                  <div className="text-center text-sm text-muted-foreground">
                    No comments yet. Be the first to comment.
                  </div>
                </TabsContent>
                <TabsContent value="activity" className="p-4 bg-muted rounded-md min-h-[100px]">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground text-xs">2023-07-05 09:30</span>
                      <span>Task created by John Doe</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground text-xs">2023-07-06 14:15</span>
                      <span>Jane Smith assigned to task</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter>
              <div className="flex items-center gap-2 mr-auto">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
              <Button onClick={() => setIsTaskDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  )
}
