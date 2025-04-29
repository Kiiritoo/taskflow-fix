"use client"

import { useOrganization } from "@/contexts/OrganizationContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Building, PlusCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Sample organizations
const organizations = [
  {
    id: 1,
    name: "Acme Inc",
    logo: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Globex Corporation",
    logo: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Stark Industries",
    logo: "/placeholder.svg",
  },
]

export default function OrganizationSwitcher() {
  const { currentOrg, setCurrentOrg } = useOrganization()
  const router = useRouter()

  const handleOrgChange = (org) => {
    setCurrentOrg(org)
    router.push("/dashboard")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full justify-start px-3">
          <Image
            src={currentOrg.logo || "/placeholder.svg"}
            alt={currentOrg.name}
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span className="truncate">{currentOrg.name}</span>
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem key={org.id} className="cursor-pointer" onClick={() => handleOrgChange(org)}>
            <div className="flex items-center gap-2">
              <Image
                src={org.logo || "/placeholder.svg"}
                alt={org.name}
                width={20}
                height={20}
                className="rounded-sm"
              />
              <span>{org.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/organizations")}>
          <Building className="h-4 w-4 mr-2" />
          Manage Organizations
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/organizations/new")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
