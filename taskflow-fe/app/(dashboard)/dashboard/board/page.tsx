"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Edit,
  Eye,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Tag,
  Trash2,
  Download,
  Check,
} from "lucide-react"

// Define types
type Priority = "low" | "medium" | "high" | "urgent"
type Status = "backlog" | "todo" | "in-progress" | "review" | "done"

interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  dueDate?: Date
  assignees: User[]
  labels: string[]
  attachments: number
  comments: number
  checklist: { total: number; completed: number }
}

interface User {
  id: string
  name: string
  avatar?: string
  initials: string
}

interface Column {
  id: Status
  title: string
  tasks: Task[]
}

// Sample data
const users: User[] = [
  { id: "1", name: "John Doe", avatar: "/placeholder.svg", initials: "JD" },
  { id: "2", name: "Jane Smith", avatar: "/placeholder.svg", initials: "JS" },
  { id: "3", name: "Robert Johnson", avatar: "/placeholder.svg", initials: "RJ" },
  { id: "4", name: "Emily Davis", avatar: "/placeholder.svg", initials: "ED" },
  { id: "5", name: "Michael Wilson", avatar: "/placeholder.svg", initials: "MW" },
]

const labels = [
  { id: "bug", name: "Bug", color: "bg-red-500" },
  { id: "feature", name: "Feature", color: "bg-blue-500" },
  { id: "enhancement", name: "Enhancement", color: "bg-green-500" },
  { id: "documentation", name: "Documentation", color: "bg-yellow-500" },
  { id: "design", name: "Design", color: "bg-purple-500" },
]

const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Implement authentication flow",
    description: "Create login, registration, and password reset functionality",
    status: "todo",
    priority: "high",
    dueDate: new Date(2023, 7, 15),
    assignees: [users[0], users[1]],
    labels: ["feature"],
    attachments: 2,
    comments: 5,
    checklist: { total: 5, completed: 2 },
  },
  {
    id: "task-2",
    title: "Design dashboard layout",
    description: "Create wireframes and mockups for the main dashboard",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date(2023, 7, 10),
    assignees: [users[2]],
    labels: ["design"],
    attachments: 4,
    comments: 3,
    checklist: { total: 3, completed: 1 },
  },
  {
    id: "task-3",
    title: "Fix navigation bug on mobile",
    description: "The navigation menu doesn't close properly on mobile devices",
    status: "review",
    priority: "urgent",
    dueDate: new Date(2023, 7, 5),
    assignees: [users[0], users[3]],
    labels: ["bug"],
    attachments: 1,
    comments: 8,
    checklist: { total: 2, completed: 2 },
  },
  {
    id: "task-4",
    title: "Update API documentation",
    description: "Add examples and update endpoint descriptions",
    status: "done",
    priority: "low",
    dueDate: new Date(2023, 7, 1),
    assignees: [users[4]],
    labels: ["documentation"],
    attachments: 0,
    comments: 2,
    checklist: { total: 4, completed: 4 },
  },
  {
    id: "task-5",
    title: "Research competitor features",
    description: "Analyze top 5 competitors and document their key features",
    status: "backlog",
    priority: "medium",
    assignees: [users[1]],
    labels: ["enhancement"],
    attachments: 3,
    comments: 0,
    checklist: { total: 0, completed: 0 },
  },
  {
    id: "task-6",
    title: "Implement dark mode",
    description: "Add dark mode support to all components",
    status: "todo",
    priority: "medium",
    dueDate: new Date(2023, 7, 20),
    assignees: [users[2], users[3]],
    labels: ["feature", "enhancement"],
    attachments: 1,
    comments: 4,
    checklist: { total: 6, completed: 0 },
  },
  {
    id: "task-7",
    title: "Optimize image loading",
    description: "Implement lazy loading and image compression",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(2023, 7, 12),
    assignees: [users[0]],
    labels: ["enhancement"],
    attachments: 0,
    comments: 2,
    checklist: { total: 3, completed: 1 },
  },
  {
    id: "task-8",
    title: "Create onboarding tutorial",
    description: "Design and implement an interactive onboarding flow for new users",
    status: "backlog",
    priority: "low",
    assignees: [users[4], users[1]],
    labels: ["feature", "design"],
    attachments: 5,
    comments: 3,
    checklist: { total: 0, completed: 0 },
  },
  {
    id: "task-9",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for automated testing and deployment",
    status: "done",
    priority: "high",
    dueDate: new Date(2023, 6, 28),
    assignees: [users[0]],
    labels: ["enhancement"],
    attachments: 1,
    comments: 0,
    checklist: { total: 5, completed: 5 },
  },
  {
    id: "task-10",
    title: "Implement file upload functionality",
    description: "Add support for drag and drop file uploads with progress indicators",
    status: "review",
    priority: "medium",
    dueDate: new Date(2023, 7, 8),
    assignees: [users[2], users[4]],
    labels: ["feature"],
    attachments: 2,
    comments: 6,
    checklist: { total: 4, completed: 3 },
  },
]

// Initial columns
const initialColumns: Column[] = [
  { id: "backlog", title: "Backlog", tasks: [] },
  { id: "todo", title: "To Do", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "review", title: "Review", tasks: [] },
  { id: "done", title: "Done", tasks: [] },
]

// Populate columns with tasks
initialTasks.forEach((task) => {
  const column = initialColumns.find((col) => col.id === task.status)
  if (column) {
    column.tasks.push(task)
  }
})

// Priority badge component
const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const getColor = () => {
    switch (priority) {
      case "low":
        return "bg-slate-200 text-slate-700 hover:bg-slate-200"
      case "medium":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "high":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100"
      case "urgent":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      default:
        return "bg-slate-200 text-slate-700 hover:bg-slate-200"
    }
  }

  return (
    <Badge variant="outline" className={`${getColor()} border-none`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

// Label badge component
const LabelBadge = ({ labelId }: { labelId: string }) => {
  const label = labels.find((l) => l.id === labelId)
  if (!label) return null

  return (
    <Badge variant="outline" className={`${label.color} bg-opacity-20 text-xs border-none`}>
      {label.name}
    </Badge>
  )
}

// Task card component
const TaskCard = ({ task, index }: { task: Task; index: number }) => {
  const [showTaskDialog, setShowTaskDialog] = useState(false)

  const getDaysRemaining = () => {
    if (!task.dueDate) return null

    const today = new Date()
    const dueDate = new Date(task.dueDate)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return (
        <span className="text-red-500 text-xs flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" /> Overdue by {Math.abs(diffDays)} days
        </span>
      )
    } else if (diffDays === 0) {
      return (
        <span className="text-amber-500 text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" /> Due today
        </span>
      )
    } else if (diffDays === 1) {
      return (
        <span className="text-amber-500 text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" /> Due tomorrow
        </span>
      )
    } else {
      return (
        <span className="text-muted-foreground text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" /> {diffDays} days left
        </span>
      )
    }
  }

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-3">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-3 pb-0">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5 w-full">
                    <div className="flex gap-1.5 flex-wrap mb-2">
                      {task.labels.map((labelId) => (
                        <LabelBadge key={labelId} labelId={labelId} />
                      ))}
                    </div>
                    <h3
                      className="font-medium text-sm cursor-pointer hover:text-primary"
                      onClick={() => setShowTaskDialog(true)}
                    >
                      {task.title}
                    </h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowTaskDialog(true)}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
                {task.checklist.total > 0 && (
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {task.checklist.completed}/{task.checklist.total}
                  </div>
                )}
                {task.dueDate && <div className="mb-2">{getDaysRemaining()}</div>}
              </CardContent>
              <CardFooter className="p-3 pt-0 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 3).map((user, i) => (
                    <TooltipProvider key={user.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>{user.name}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {task.assignees.length > 3 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="text-[10px] bg-muted">
                              +{task.assignees.length - 3}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          {task.assignees
                            .slice(3)
                            .map((user) => user.name)
                            .join(", ")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </Draggable>

      {/* Task Detail Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              {task.labels.map((labelId) => (
                <LabelBadge key={labelId} labelId={labelId} />
              ))}
              <PriorityBadge priority={task.priority} />
            </div>
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              Created by John Doe •{" "}
              {task.dueDate ? `Due ${format(new Date(task.dueDate), "MMM d, yyyy")}` : "No due date"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden flex-1">
            <div className="md:col-span-2 overflow-auto pr-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>

                {task.checklist.total > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Checklist</h3>
                      <span className="text-xs text-muted-foreground">
                        {task.checklist.completed}/{task.checklist.total} completed
                      </span>
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: task.checklist.total }).map((_, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Checkbox id={`checklist-${i}`} checked={i < task.checklist.completed} />
                          <Label htmlFor={`checklist-${i}`} className="text-sm">
                            {i < task.checklist.completed ? "Completed checklist item" : "Pending checklist item"}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium mb-2">Comments ({task.comments})</h3>
                  {task.comments > 0 ? (
                    <div className="space-y-4">
                      {Array.from({ length: Math.min(3, task.comments) }).map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={users[i % users.length].avatar} />
                            <AvatarFallback>{users[i % users.length].initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{users[i % users.length].name}</span>
                              <span className="text-xs text-muted-foreground">2 days ago</span>
                            </div>
                            <p className="text-sm">
                              This is a sample comment on the task. It provides feedback or additional context.
                            </p>
                          </div>
                        </div>
                      ))}
                      {task.comments > 3 && (
                        <Button variant="link" className="px-0">
                          View all {task.comments} comments
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  )}

                  <div className="mt-4">
                    <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
                    <div className="flex justify-end mt-2">
                      <Button>Add Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <Select defaultValue={task.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Assignees</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {task.assignees.map((user) => (
                    <div key={user.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{user.name}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Assignee
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Due Date</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {task.dueDate ? format(new Date(task.dueDate), "PPP") : "No due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={task.dueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Labels</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {task.labels.map((labelId) => (
                    <LabelBadge key={labelId} labelId={labelId} />
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Label
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Attachments ({task.attachments})</h3>
                {task.attachments > 0 ? (
                  <div className="space-y-2">
                    {Array.from({ length: task.attachments }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs">.pdf</span>
                          </div>
                          <div>
                            <p className="text-xs font-medium">document-{i + 1}.pdf</p>
                            <p className="text-xs text-muted-foreground">250 KB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No attachments</p>
                )}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-1" /> Add Attachment
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-1" /> Duplicate
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Column component
const Column = ({ column, tasks, index }: { column: Column; tasks: Task[]; index: number }) => {
  return (
    <Droppable droppableId={column.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-muted/50 rounded-lg p-3 min-h-[200px] w-[300px] flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <h3 className="font-medium text-sm">{column.title}</h3>
              <Badge variant="outline" className="ml-2 bg-background">
                {tasks.length}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div>
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

// Create task dialog component
const CreateTaskDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [date, setDate] = useState<Date>()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your board. Fill in the details below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter task title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter task description" className="min-h-[100px]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="todo">
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignees">Assignees</Label>
              <Select>
                <SelectTrigger id="assignees">
                  <SelectValue placeholder="Select assignees" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="dueDate">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="labels">Labels</Label>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <div key={label.id} className="flex items-center gap-2">
                  <Checkbox id={`label-${label.id}`} />
                  <Label htmlFor={`label-${label.id}`} className="text-sm">
                    <span className={`inline-block w-3 h-3 rounded-full ${label.color} mr-1`}></span>
                    {label.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              toast({
                title: "Task created",
                description: "Your task has been created successfully.",
              })
              onOpenChange(false)
            }}
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main board page component
export default function BoardPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all")
  const [filterAssignee, setFilterAssignee] = useState<string | "all">("all")
  const [viewMode, setViewMode] = useState<"board" | "list">("board")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Filter tasks based on search query and filters
  const getFilteredTasks = (columnId: Status) => {
    return (
      columns
        .find((col) => col.id === columnId)
        ?.tasks.filter((task) => {
          // Search filter
          const matchesSearch =
            searchQuery === "" ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())

          // Priority filter
          const matchesPriority = filterPriority === "all" || task.priority === filterPriority

          // Assignee filter
          const matchesAssignee =
            filterAssignee === "all" || task.assignees.some((assignee) => assignee.id === filterAssignee)

          return matchesSearch && matchesPriority && matchesAssignee
        }) || []
    )
  }

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Find the task that was dragged
    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    if (!sourceColumn) return

    const task = sourceColumn.tasks.find((task) => task.id === draggableId)
    if (!task) return

    // Create a new array of columns
    const newColumns = columns.map((column) => {
      // Remove the task from the source column
      if (column.id === source.droppableId) {
        const newTasks = [...column.tasks]
        newTasks.splice(source.index, 1)
        return { ...column, tasks: newTasks }
      }

      // Add the task to the destination column
      if (column.id === destination.droppableId) {
        const newTasks = [...column.tasks]
        newTasks.splice(destination.index, 0, { ...task, status: destination.droppableId as Status })
        return { ...column, tasks: newTasks }
      }

      return column
    })

    setColumns(newColumns)

    // Show toast notification
    toast({
      title: "Task moved",
      description: `"${task.title}" moved to ${destination.droppableId.replace("-", " ")}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Board</h1>
          <p className="text-muted-foreground">Manage and track your project tasks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Star className="mr-2 h-4 w-4" />
            Save View
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 pb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterPriority("all")}>
                {filterPriority === "all" && <Check className="mr-2 h-4 w-4" />}
                <span className={filterPriority === "all" ? "ml-6" : ""}>All Priorities</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("low")}>
                {filterPriority === "low" && <Check className="mr-2 h-4 w-4" />}
                <span className={filterPriority === "low" ? "ml-6" : ""}>Low</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("medium")}>
                {filterPriority === "medium" && <Check className="mr-2 h-4 w-4" />}
                <span className={filterPriority === "medium" ? "ml-6" : ""}>Medium</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("high")}>
                {filterPriority === "high" && <Check className="mr-2 h-4 w-4" />}
                <span className={filterPriority === "high" ? "ml-6" : ""}>High</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("urgent")}>
                {filterPriority === "urgent" && <Check className="mr-2 h-4 w-4" />}
                <span className={filterPriority === "urgent" ? "ml-6" : ""}>Urgent</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterAssignee("all")}>
                {filterAssignee === "all" && <Check className="mr-2 h-4 w-4" />}
                <span className={filterAssignee === "all" ? "ml-6" : ""}>All Assignees</span>
              </DropdownMenuItem>
              {users.map((user) => (
                <DropdownMenuItem key={user.id} onClick={() => setFilterAssignee(user.id)}>
                  {filterAssignee === user.id && <Check className="mr-2 h-4 w-4" />}
                  <div className={`flex items-center gap-2 ${filterAssignee === user.id ? "ml-6" : ""}`}>
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                Group
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Check className="mr-2 h-4 w-4" />
                By Status
              </DropdownMenuItem>
              <DropdownMenuItem>By Assignee</DropdownMenuItem>
              <DropdownMenuItem>By Priority</DropdownMenuItem>
              <DropdownMenuItem>By Due Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Columns</DropdownMenuItem>
              <DropdownMenuItem>Manage Labels</DropdownMenuItem>
              <DropdownMenuItem>Board Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="border rounded-md flex">
            <Button
              variant={viewMode === "board" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none rounded-l-md"
              onClick={() => setViewMode("board")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-none rounded-r-md"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "board" ? (
        <div className="overflow-x-auto pb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4">
              {columns.map((column, index) => (
                <Column key={column.id} column={column} tasks={getFilteredTasks(column.id)} index={index} />
              ))}
            </div>
          </DragDropContext>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted p-3 flex items-center gap-4 font-medium text-sm">
            <div className="w-6"></div>
            <div className="flex-1">Task</div>
            <div className="w-24 text-center">Status</div>
            <div className="w-24 text-center">Priority</div>
            <div className="w-32 text-center">Assignees</div>
            <div className="w-32 text-center">Due Date</div>
            <div className="w-10"></div>
          </div>
          <ScrollArea className="h-[calc(100vh-300px)]">
            {columns.flatMap((column) =>
              getFilteredTasks(column.id).map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-3 border-b hover:bg-muted/50">
                  <div className="w-6">
                    <Checkbox />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
                    <div className="flex gap-1 mt-1">
                      {task.labels.map((labelId) => (
                        <LabelBadge key={labelId} labelId={labelId} />
                      ))}
                    </div>
                  </div>
                  <div className="w-24 text-center">
                    <Badge variant="outline" className="bg-muted">
                      {column.title}
                    </Badge>
                  </div>
                  <div className="w-24 text-center">
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className="w-32 flex justify-center">
                    <div className="flex -space-x-2">
                      {task.assignees.slice(0, 3).map((user) => (
                        <TooltipProvider key={user.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-[10px]">{user.initials}</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>{user.name}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                      {task.assignees.length > 3 && (
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-[10px] bg-muted">+{task.assignees.length - 3}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                  <div className="w-32 text-center text-sm">
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "-"}
                  </div>
                  <div className="w-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )),
            )}
          </ScrollArea>
        </div>
      )}

      <CreateTaskDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  )
}
