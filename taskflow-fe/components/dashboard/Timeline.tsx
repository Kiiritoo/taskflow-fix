import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "lucide-react"

interface Task {
  id: number
  name: string
  startDate: string
  endDate: string
  status: "completed" | "in-progress" | "upcoming"
  priority?: "critical" | "high" | "medium" | "low"
  assignees?: number[]
  description?: string
  dependencies?: number[]
}

interface TimelineProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  showDependencies?: boolean
}

const Timeline: React.FC<TimelineProps> = ({ tasks, onTaskClick, showDependencies = true }) => {
  // Sort tasks by start date
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  // Find the earliest start date and latest end date
  let startDate = new Date(sortedTasks[0].startDate)
  let endDate = new Date(sortedTasks[0].endDate)

  sortedTasks.forEach((task) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)

    if (taskStart < startDate) startDate = taskStart
    if (taskEnd > endDate) endDate = taskEnd
  })

  // Add some padding
  startDate.setDate(startDate.getDate() - 5)
  endDate.setDate(endDate.getDate() + 5)

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))

  const getTaskWidth = (task: Task) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)
    const taskDays = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 3600 * 24)) + 1
    return `${(taskDays / totalDays) * 100}%`
  }

  const getTaskOffset = (task: Task) => {
    const taskStart = new Date(task.startDate)
    const daysDiff = Math.ceil((taskStart.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    return `${(daysDiff / totalDays) * 100}%`
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "upcoming":
        return "bg-gray-300"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-600"
      case "high":
        return "bg-red-400"
      case "medium":
        return "bg-yellow-400"
      case "low":
        return "bg-green-400"
      default:
        return "bg-gray-300"
    }
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

      const startOffset = Math.max(0, (monthStart.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
      const width = Math.min(
        (monthEnd.getTime() - monthStart.getTime()) / (1000 * 3600 * 24) + 1,
        (monthEnd.getTime() - startDate.getTime()) / (1000 * 3600 * 24) - startOffset + 1,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Project Timeline</span>
          <Badge>{tasks.length} Tasks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto" style={{ minHeight: "400px" }}>
          {/* Timeline header with month labels */}
          <div className="sticky top-0 z-10 bg-white border-b mb-2">
            <div className="relative h-8">
              {generateMonthLabels().map((month, index) => (
                <div
                  key={index}
                  className="absolute top-0 h-full border-l flex items-center px-2 text-xs font-medium text-gray-500"
                  style={{ left: month.left, width: month.width }}
                >
                  {month.name} {month.year}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline grid */}
          <div className="relative" style={{ minHeight: `${tasks.length * 50 + 20}px` }}>
            {/* Task bars */}
            {sortedTasks.map((task, index) => (
              <TooltipProvider key={task.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute h-10 rounded-md cursor-pointer transition-all hover:opacity-90 hover:shadow-md"
                      style={{
                        left: getTaskOffset(task),
                        width: getTaskWidth(task),
                        top: `${index * 50 + 10}px`,
                      }}
                      onClick={() => onTaskClick && onTaskClick(task)}
                    >
                      <div className={`absolute inset-0 rounded-md ${getStatusColor(task.status)} opacity-75`}></div>
                      {task.priority && (
                        <div
                          className={`absolute top-0 left-0 h-full w-1 rounded-l-md ${getPriorityColor(task.priority)}`}
                        ></div>
                      )}
                      <div className="relative z-10 flex items-center h-full px-3">
                        <span className="font-medium text-sm text-white truncate">{task.name}</span>
                      </div>

                      {/* Task dependencies (arrows) */}
                      {showDependencies &&
                        task.dependencies &&
                        task.dependencies.map((depId) => {
                          const depTask = sortedTasks.find((t) => t.id === depId)
                          if (!depTask) return null

                          const depIndex = sortedTasks.findIndex((t) => t.id === depId)
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
                                  height: `${Math.abs((index - depIndex) * 50)}px`,
                                  width: "2px",
                                  top: index > depIndex ? "0" : "100%",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  zIndex: -1,
                                }}
                              ></div>
                            </div>
                          )
                        })}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-medium">{task.name}</p>
                      <p className="text-xs">
                        {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                      </p>
                      {task.description && <p className="text-xs max-w-xs">{task.description}</p>}
                      {task.dependencies && task.dependencies.length > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Link className="h-3 w-3" />
                          <span>Has dependencies</span>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {/* Task labels */}
            {sortedTasks.map((task, index) => (
              <div
                key={`label-${task.id}`}
                className="absolute flex items-center h-10"
                style={{
                  left: 0,
                  top: `${index * 50 + 10}px`,
                  width: "200px",
                }}
              >
                <span className="font-medium text-sm truncate pr-4">{task.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Timeline
