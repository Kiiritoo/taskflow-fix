import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { OrganizationProvider } from "@/contexts/OrganizationContext"
import { UserProvider } from "@/contexts/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Project Management Made Simple",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <UserProvider>
          <OrganizationProvider>{children}</OrganizationProvider>
        </UserProvider>
      </body>
    </html>
  )
}
