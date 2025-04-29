// Replace the entire file with a simplified version that should work without errors

"use client"

import { useState } from "react"
import { format, subDays, subMonths, startOfMonth, endOfMonth, startOfYear } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  BarChart2,
  CalendarIcon,
  Download,
  FileText,
  Filter,
  LineChartIcon,
  RefreshCw,
  Settings,
  Share2,
  Users,
  AlertCircle,
  CheckCircle,
  Activity,
} from "lucide-react"

// Define types
type TimeRange = "7days" | "30days" | "90days" | "thisMonth" | "lastMonth" | "thisYear" | "custom"
type GroupBy = "team" | "individual" | "project" | "status" | "priority" | "time"
type ChartType = "bar" | "line" | "pie" | "area"
type MetricType = "completion" | "overdue" | "created" | "inProgress"

interface DateRange {
  from: Date
  to: Date
}

// Sample data
const teamData = [
  { name: "Product Team", completion: 80, completed: 119, total: 148, overdue: 5 },
  { name: "Engineering Team", completion: 87, completed: 188, total: 217, overdue: 8 },
]

const individualData = [
  { name: "John Doe", role: "Product Manager", completion: 78, completed: 45, total: 58, overdue: 3 },
  { name: "Jane Smith", role: "UI Designer", completion: 80, completed: 32, total: 40, overdue: 1 },
  { name: "Robert Johnson", role: "Frontend Developer", completion: 89, completed: 67, total: 75, overdue: 2 },
  { name: "Emily Davis", role: "Backend Developer", completion: 87, completed: 54, total: 62, overdue: 4 },
  { name: "Michael Wilson", role: "QA Engineer", completion: 84, completed: 38, total: 45, overdue: 2 },
]

const projectData = [
  { name: "Website Redesign", completion: 71, completed: 85, total: 120, overdue: 5 },
  { name: "Mobile App Development", completion: 86, completed: 95, total: 110, overdue: 3 },
  { name: "API Integration", completion: 80, completed: 56, total: 70, overdue: 4 },
]

const statusData = [
  { name: "To Do", value: 35, color: "#94a3b8" },
  { name: "In Progress", value: 25, color: "#3b82f6" },
  { name: "Review", value: 15, color: "#f59e0b" },
  { name: "Done", value: 65, color: "#10b981" },
  { name: "Backlog", value: 20, color: "#6b7280" },
]

const priorityData = [
  { name: "Low", value: 30, color: "#94a3b8" },
  { name: "Medium", value: 45, color: "#3b82f6" },
  { name: "High", value: 20, color: "#f59e0b" },
  { name: "Urgent", value: 10, color: "#ef4444" },
]

// Generate daily data for the past 30 days
const generateDailyData = () => {
  const data = []
  for (let i = 30; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, "MMM d")
    data.push({
      date: dateStr,
      completed: Math.floor(Math.random() * 8) + 2,
      created: Math.floor(Math.random() * 10) + 5,
      overdue: Math.max(0, Math.floor(Math.random() * 3) - 1),
      inProgress: Math.floor(Math.random() * 6) + 3,
    })
  }
  return data
}

// Generate monthly data for the past 12 months
const generateMonthlyData = () => {
  const data = []
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    const monthStr = format(date, "MMM yyyy")
    data.push({
      date: monthStr,
      completed: Math.floor(Math.random() * 80) + 40,
      created: Math.floor(Math.random() * 100) + 50,
      overdue: Math.floor(Math.random() * 20) + 5,
      inProgress: Math.floor(Math.random() * 60) + 30,
    })
  }
  return data
}

// Helper function to get date range based on time range
const getDateRange = (timeRange: TimeRange): DateRange => {
  const today = new Date()

  switch (timeRange) {
    case "7days":
      return { from: subDays(today, 7), to: today }
    case "30days":
      return { from: subDays(today, 30), to: today }
    case "90days":
      return { from: subDays(today, 90), to: today }
    case "thisMonth":
      return { from: startOfMonth(today), to: today }
    case "lastMonth":
      const lastMonth = subMonths(today, 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    case "thisYear":
      return { from: startOfYear(today), to: today }
    default:
      return { from: subDays(today, 30), to: today }
  }
}

// Main Reports component
export default function ReportsPage() {
  // State for filters
  const [timeRange, setTimeRange] = useState<TimeRange>("30days")
  const [groupBy, setGroupBy] = useState<GroupBy>("team")
  const [chartType, setChartType] = useState<ChartType>("bar")
  const [metricType, setMetricType] = useState<MetricType>("completion")
  const [dateRange, setDateRange] = useState<DateRange>(getDateRange("30days"))
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()

  // State for data
  const [dailyData] = useState(generateDailyData())
  const [monthlyData] = useState(generateMonthlyData())

  // Format date range for display
  const formatDateRange = () => {
    if (timeRange === "7days") return "Last 7 Days"
    if (timeRange === "30days") return "Last 30 Days"
    if (timeRange === "90days") return "Last 90 Days"
    if (timeRange === "thisMonth") return "This Month"
    if (timeRange === "lastMonth") return "Last Month"
    if (timeRange === "thisYear") return "This Year"
    if (timeRange === "custom") {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
    }
    return ""
  }

  // Get chart title based on metric type
  const getChartTitle = () => {
    if (metricType === "completion") return "Task Completion Rate"
    if (metricType === "overdue") return "Overdue Tasks"
    if (metricType === "created") return "Tasks Created"
    if (metricType === "inProgress") return "Tasks In Progress"
    return ""
  }

  // Get chart data key based on metric type
  const getDataKey = () => {
    if (metricType === "completion") return "completion"
    if (metricType === "overdue") return "overdue"
    if (metricType === "created") return "created"
    if (metricType === "inProgress") return "inProgress"
    return "completed"
  }

  // Get chart color based on metric type
  const getChartColor = () => {
    if (metricType === "completion") return "#10b981"
    if (metricType === "overdue") return "#ef4444"
    if (metricType === "created") return "#3b82f6"
    if (metricType === "inProgress") return "#f59e0b"
    return "#10b981"
  }

  // Render the appropriate chart based on chart type and data
  const renderChart = () => {
    const dataKey = getDataKey()
    const chartColor = getChartColor()

    // Determine which data to use based on groupBy
    let data = []
    if (groupBy === "team") {
      data = teamData
    } else if (groupBy === "individual") {
      data = individualData
    } else if (groupBy === "project") {
      data = projectData
    } else if (groupBy === "status") {
      data = statusData
    } else if (groupBy === "priority") {
      data = priorityData
    } else {
      // Time-based data
      data = timeRange === "thisYear" ? monthlyData : dailyData
    }

    // Safety check for empty data
    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p>No data available for the selected filters</p>
        </div>
      )
    }

    if (groupBy === "status") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    if (groupBy === "priority") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={priorityData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={groupBy === "time" ? "date" : "name"} />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={chartColor} name={getChartTitle()} />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={groupBy === "time" ? "date" : "name"} />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={chartColor} name={getChartTitle()} />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={groupBy === "time" ? "date" : "name"} />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={chartColor}
              fill={`${chartColor}33`}
              name={getChartTitle()}
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={groupBy === "time" ? "date" : "name"}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    return null
  }

  // Render summary cards
  const renderSummaryCards = () => {
    // Calculate summary metrics
    const totalTasks = individualData.reduce((sum, member) => sum + member.total, 0)
    const completedTasks = individualData.reduce((sum, member) => sum + member.completed, 0)
    const overdueTasks = individualData.reduce((sum, member) => sum + member.overdue, 0)
    const completionRate = Math.round((completedTasks / totalTasks) * 100)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">+18.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">+5.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">-2.5% from last month</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render team performance table
  const renderTeamPerformanceTable = () => {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Task completion rates by team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamData.map((team, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{team.name}</span>
                  </div>
                  <span className="text-sm">{team.completion}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${team.completion}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Completed: {team.completed}</span>
                  <span>Total: {team.total}</span>
                  <span>Overdue: {team.overdue}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render individual performance table
  const renderIndividualPerformanceTable = () => {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Individual Performance</CardTitle>
            <CardDescription>Task completion rates by team member</CardDescription>
          </div>
          <div>
            <Select defaultValue="completion">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completion">Completion Rate</SelectItem>
                <SelectItem value="total">Total Tasks</SelectItem>
                <SelectItem value="overdue">Overdue Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-6">
              {individualData.map((member, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{member.completion}%</Badge>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${member.completion}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Completed: {member.completed}</span>
                    <span>Total: {member.total}</span>
                    <span>Overdue: {member.overdue}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  // Define COLORS array for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track team performance and project progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {renderSummaryCards()}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="time-range">Time Range:</Label>
          <div>
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger id="time-range" className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {timeRange === "custom" && (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateRange
                    ? `${format(customDateRange.from, "MMM d, yyyy")} - ${format(customDateRange.to, "MMM d, yyyy")}`
                    : "Select date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: customDateRange?.from || new Date(), to: customDateRange?.to || new Date() }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setCustomDateRange({ from: range.from, to: range.to })
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Label htmlFor="group-by">Group By:</Label>
          <div>
            <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupBy)}>
              <SelectTrigger id="group-by" className="w-[180px]">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="time">Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="metric-type">Metric:</Label>
          <div>
            <Select value={metricType} onValueChange={(value) => setMetricType(value as MetricType)}>
              <SelectTrigger id="metric-type" className="w-[180px]">
                <SelectValue placeholder="Metric type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completion">Completion Rate</SelectItem>
                <SelectItem value="overdue">Overdue Tasks</SelectItem>
                <SelectItem value="created">Tasks Created</SelectItem>
                <SelectItem value="inProgress">Tasks In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="flex border rounded-md">
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 rounded-none rounded-l-md p-0 flex items-center justify-center"
              onClick={() => setChartType("bar")}
            >
              <BarChart2 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant={chartType === "line" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 rounded-none p-0 flex items-center justify-center"
              onClick={() => setChartType("line")}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant={chartType === "area" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 rounded-none p-0 flex items-center justify-center"
              onClick={() => setChartType("area")}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant={chartType === "pie" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 rounded-none rounded-r-md p-0 flex items-center justify-center"
              onClick={() => setChartType("pie")}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Filter by Project</DropdownMenuItem>
              <DropdownMenuItem>Filter by Label</DropdownMenuItem>
              <DropdownMenuItem>Filter by Assignee</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Customize
          </Button>
        </div>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {getChartTitle()} - {formatDateRange()}
          </CardTitle>
          <CardDescription>
            {groupBy === "team" && "Performance metrics by team"}
            {groupBy === "individual" && "Performance metrics by team member"}
            {groupBy === "project" && "Performance metrics by project"}
            {groupBy === "status" && "Task distribution by status"}
            {groupBy === "priority" && "Task distribution by priority"}
            {groupBy === "time" && "Performance metrics over time"}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Hover over chart elements for more details</span>
          </div>
          <div>Last updated: {format(new Date(), "MMM d, yyyy h:mm a")}</div>
        </CardFooter>
      </Card>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {renderTeamPerformanceTable()}
        {renderIndividualPerformanceTable()}
      </div>

      {/* Project Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Project Performance</CardTitle>
          <CardDescription>Task completion rates by project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projectData.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{project.name}</div>
                  <Badge variant="outline">{project.completion}%</Badge>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${project.completion}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Completed: {project.completed}</span>
                  <span>Total: {project.total}</span>
                  <span>Overdue: {project.overdue}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Additional Reports */}
      <Tabs defaultValue="productivity">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="productivity">Productivity Trends</TabsTrigger>
          <TabsTrigger value="workload">Team Workload</TabsTrigger>
          <TabsTrigger value="timeline">Project Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="productivity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Trends</CardTitle>
              <CardDescription>Task completion over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed Tasks" />
                  <Line type="monotone" dataKey="created" stroke="#3b82f6" name="Created Tasks" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="workload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Workload</CardTitle>
              <CardDescription>Current task distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={individualData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Total Tasks" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed Tasks" />
                  <Bar dataKey="overdue" fill="#ef4444" name="Overdue Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Task completion over project lifecycle</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b98133"
                    name="Completed"
                  />
                  <Area
                    type="monotone"
                    dataKey="inProgress"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b33"
                    name="In Progress"
                  />
                  <Area
                    type="monotone"
                    dataKey="overdue"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef444433"
                    name="Overdue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
