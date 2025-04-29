"use client"

import type React from "react"

import { useCallback, useEffect, useMemo, useState } from "react"
import { addDays, format, isSameMonth, parseISO, startOfToday } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  PlusCircle,
  Search,
  Video,
  Users,
  CalendarIcon,
  Menu,
  X,
  Bell,
} from "lucide-react"
import { AddTaskModal } from "@/components/dashboard/AddTaskModal"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Event {
  id: number
  title: string
  date: string
  endDate?: string
  time: string
  type: "meeting" | "deadline" | "call" | "event"
  description?: string
  attendees?: string[]
  location?: string
  isRecurring?: boolean
  color?: string
  reminder?: boolean
}

const eventTypes = {
  meeting: { color: "bg-blue-500", icon: Users },
  deadline: { color: "bg-red-500", icon: Clock },
  call: { color: "bg-green-500", icon: Video },
  event: { color: "bg-yellow-500", icon: CalendarIcon },
}

const initialEvents: Event[] = [
  {
    id: 1,
    title: "Team Meeting",
    date: format(addDays(startOfToday(), 1), "yyyy-MM-dd"),
    time: "10:00 AM",
    type: "meeting",
    description: "Weekly team sync meeting",
    attendees: ["John Doe", "Jane Smith"],
    location: "Conference Room A",
    reminder: true,
  },
  {
    id: 2,
    title: "Project Deadline",
    date: format(addDays(startOfToday(), 3), "yyyy-MM-dd"),
    endDate: format(addDays(startOfToday(), 5), "yyyy-MM-dd"),
    time: "6:00 PM",
    type: "deadline",
    description: "Final submission for Q3 project",
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "Client Call",
    date: format(addDays(startOfToday(), 2), "yyyy-MM-dd"),
    time: "2:00 PM",
    type: "call",
    description: "Product demo with client",
    attendees: ["Client A", "Product Manager"],
    reminder: true,
  },
]

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEventType, setSelectedEventType] = useState<string>("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter events based on search query and event type
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = selectedEventType === "all" || event.type === selectedEventType
      return matchesSearch && matchesType
    })
  }, [events, searchQuery, selectedEventType])

  // Group events by date for the upcoming events list
  const groupedEvents = useMemo(() => {
    return filteredEvents.reduce(
      (acc, event) => {
        const dates = []
        const startDate = parseISO(event.date)
        const endDate = event.endDate ? parseISO(event.endDate) : startDate

        let currentDate = startDate
        while (currentDate <= endDate) {
          const dateStr = format(currentDate, "yyyy-MM-dd")
          if (!acc[dateStr]) {
            acc[dateStr] = []
          }
          acc[dateStr].push(event)
          currentDate = addDays(currentDate, 1)
        }
        return acc
      },
      {} as Record<string, Event[]>,
    )
  }, [filteredEvents])

  const handleAddTask = useCallback((newTask: any) => {
    setEvents((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTask.title,
        date: newTask.dueDate,
        endDate: newTask.endDate,
        time: format(parseISO(`2000-01-01T${newTask.time}`), "h:mm a"),
        type: newTask.type,
        description: newTask.description,
        location: newTask.location,
        attendees: newTask.attendees,
        reminder: newTask.reminder,
        color: newTask.color,
      },
    ])
  }, [])

  const navigateDate = useCallback(
    (direction: "prev" | "next") => {
      setDate((prev) => {
        const days = view === "month" ? 30 : view === "week" ? 7 : 1
        return direction === "prev" ? addDays(prev, -days) : addDays(prev, days)
      })
    },
    [view],
  )

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    if (isMobile) {
      setSidebarOpen(true)
    }
  }

  const EventCard = ({ event }: { event: Event }) => {
    const EventIcon = eventTypes[event.type].icon
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "group relative flex items-center gap-2 rounded-lg border p-2 hover:bg-muted/50",
          "cursor-pointer transition-all duration-200 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-primary",
        )}
        onClick={() => handleEventClick(event)}
        tabIndex={0}
        role="button"
      >
        <div className={cn("rounded p-2", event.color || eventTypes[event.type].color)}>
          <EventIcon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium truncate">{event.title}</p>
            <div className="flex items-center gap-2">
              {event.reminder && <Bell className="h-3 w-3 text-muted-foreground" />}
              <Badge variant="outline" className="whitespace-nowrap">
                {event.time}
              </Badge>
            </div>
          </div>
          {event.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{event.description}</p>}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {isTablet && (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px]">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Upcoming Events</h3>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="flex-1 px-1">
                    <UpcomingEvents groupedEvents={groupedEvents} EventCard={EventCard} />
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddTaskModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous {view}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <h2 className="min-w-[150px] text-center text-lg font-semibold">{format(date, "MMMM yyyy")}</h2>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => navigateDate("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next {view}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "day")}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-2 p-2">
                  <Label>Event Type</Label>
                  <select
                    value={selectedEventType}
                    onChange={(e) => setSelectedEventType(e.target.value)}
                    className="rounded-md border p-1"
                  >
                    <option value="all">All</option>
                    <option value="meeting">Meetings</option>
                    <option value="deadline">Deadlines</option>
                    <option value="call">Calls</option>
                    <option value="event">Events</option>
                  </select>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="flex-1">
          <Card className="p-4">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-[600px] items-center justify-center"
                >
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    className="rounded-md border"
                    components={{
                      DayContent: (props) => {
                        const dayEvents = groupedEvents[format(props.date, "yyyy-MM-dd")] || []
                        const isCurrentMonth = isSameMonth(props.date, date)

                        return (
                          <motion.div
                            className={cn("relative h-full w-full p-2", !isCurrentMonth && "opacity-50")}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="absolute right-1 top-1 text-sm">{props.date.getDate()}</div>
                            <div className="mt-6 flex flex-col gap-1">
                              {dayEvents.slice(0, 3).map((event) => (
                                <TooltipProvider key={event.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <motion.div
                                        className={cn(
                                          "cursor-pointer rounded-sm px-1 py-0.5 text-xs text-white",
                                          event.color || eventTypes[event.type].color,
                                        )}
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => handleEventClick(event)}
                                      >
                                        <span className="line-clamp-1">{event.title}</span>
                                      </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="space-y-1">
                                        <p className="font-medium">{event.title}</p>
                                        <p className="text-xs">{event.time}</p>
                                        {event.description && <p className="text-xs">{event.description}</p>}
                                        {event.location && (
                                          <p className="text-xs text-muted-foreground">📍 {event.location}</p>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>
                              )}
                            </div>
                          </motion.div>
                        )
                      },
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        {/* Upcoming Events Sidebar */}
        {!isTablet && (
          <div className="mt-6 w-full lg:mt-0 lg:w-[400px]">
            <Card className="p-4">
              <h3 className="mb-4 font-semibold">Upcoming Events</h3>
              <ScrollArea className="h-[600px] pr-4">
                <UpcomingEvents groupedEvents={groupedEvents} EventCard={EventCard} />
              </ScrollArea>
            </Card>
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Event Details Sheet */}
      {selectedEvent && (
        <Sheet open={Boolean(selectedEvent)} onOpenChange={() => setSelectedEvent(null)}>
          <SheetContent className="w-full sm:max-w-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                <Badge variant="outline">{selectedEvent.type}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{format(parseISO(selectedEvent.date), "PPP")}</span>
                  <span>at {selectedEvent.time}</span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <div className="space-y-2">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Attendees</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.attendees.map((attendee) => (
                      <Badge key={attendee} variant="secondary">
                        {attendee}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

function UpcomingEvents({
  groupedEvents,
  EventCard,
}: {
  groupedEvents: Record<string, Event[]>
  EventCard: React.ComponentType<{ event: Event }>
}) {
  return (
    <div className="space-y-4">
      {Object.entries(groupedEvents)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, dayEvents]) => (
          <div key={date} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{format(new Date(date), "EEEE, MMMM d")}</h4>
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
