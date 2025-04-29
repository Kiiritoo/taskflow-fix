"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import DashboardNav from "@/components/dashboard/nav"
import DashboardHeader from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="lg:pl-72">
        <DashboardHeader>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </DashboardHeader>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
