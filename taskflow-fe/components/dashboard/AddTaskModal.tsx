"use client"

import type React from "react"

import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useOrganization } from "@/contexts/OrganizationContext"

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: any) => void
}

const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4)
  const minute = (i % 4) * 15
  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return {
    value: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
    label: `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`,
  }
})

export function AddTaskModal({ isOpen, onClose, onAddTask }: AddTaskModalProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: "",
    priority: "",
    dueDate: "",
    time: "09:00",
    type: "event",
    location: "",
    attendees: "",
  })
  const { currentOrg } = useOrganization()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddTask({
      ...newTask,
      id: Date.now(),
      attendees: newTask.attendees
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })
    setNewTask({
      title: "",
      description: "",
      project: "",
      priority: "",
      dueDate: "",
      time: "09:00",
      type: "event",
      location: "",
      attendees: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>Create a new event for {currentOrg.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Select value={newTask.time} onValueChange={(value) => setNewTask({ ...newTask, time: value })}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {time.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Event Type</Label>
              <Select value={newTask.type} onValueChange={(value: any) => setNewTask({ ...newTask, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newTask.location}
                onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                placeholder="Room name or meeting link"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                value={newTask.attendees}
                onChange={(e) => setNewTask({ ...newTask, attendees: e.target.value })}
                placeholder="Enter email addresses separated by commas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
