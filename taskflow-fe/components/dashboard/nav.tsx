"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  GanttChart,
  Users,
  Settings,
  PlusCircle,
  BarChart3,
  Kanban,
  Inbox,
  Building,
} from "lucide-react"
import Image from "next/image"
import OrganizationSwitcher from "./organization-switcher"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Organizations",
    href: "/dashboard/organizations",
    icon: Building,
  },
  {
    name: "My Tasks",
    href: "/dashboard/tasks",
    icon: ListTodo,
  },
  {
    name: "Inbox",
    href: "/dashboard/inbox",
    icon: Inbox,
    badge: "3",
  },
  {
    name: "Board",
    href: "/dashboard/board",
    icon: Kanban,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    name: "Timeline",
    href: "/dashboard/timeline",
    icon: GanttChart,
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardNav({ open, setOpen }) {
  const pathname = usePathname()

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  )
}

// Update the SidebarContent function to include the organization switcher
function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r">
      <div className="flex h-16 shrink-0 items-center">
        <Image src="/placeholder.svg" alt="TaskFlow Logo" width={32} height={32} className="h-8 w-8" />
        <span className="ml-2 font-bold text-xl">TaskFlow</span>
      </div>
      <div className="flex flex-1 flex-col gap-y-7">
        {/* Add the organization switcher here */}
        <div>
          <OrganizationSwitcher />
        </div>
        <Button className="w-full bg-[#00B8D4] hover:bg-[#00A0B8]">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href ? "bg-[#E5F9FF] text-[#00B8D4]" : "text-gray-700 hover:bg-gray-50",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-6 w-6 shrink-0",
                          pathname === item.href ? "text-[#00B8D4]" : "text-gray-400 group-hover:text-gray-500",
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                      {item.badge && (
                        <span className="ml-auto w-5 min-w-max whitespace-nowrap rounded-full bg-[#00B8D4] px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mt-auto">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="h-8 w-8 rounded-full bg-[#00B8D4] text-white flex items-center justify-center font-semibold">
            T
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">Team Workspace</p>
            <p className="text-gray-500">12 members</p>
          </div>
        </div>
      </div>
    </div>
  )
}
