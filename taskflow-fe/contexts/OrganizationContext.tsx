"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

type Organization = {
  id: number
  name: string
  logo: string
}

type OrganizationContextType = {
  currentOrg: Organization
  setCurrentOrg: (org: Organization) => void
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider")
  }
  return context
}

type OrganizationProviderProps = {
  children: ReactNode
}

export const OrganizationProvider = ({ children }: OrganizationProviderProps) => {
  const [currentOrg, setCurrentOrg] = useState<Organization>({
    id: 1,
    name: "Acme Inc",
    logo: "/placeholder.svg",
  })

  return <OrganizationContext.Provider value={{ currentOrg, setCurrentOrg }}>{children}</OrganizationContext.Provider>
}
