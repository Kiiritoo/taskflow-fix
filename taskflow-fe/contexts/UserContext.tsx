"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface UserData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  bio?: string
  username?: string
  profilePicture?: string
}

interface UserContextType {
  user: UserData | null
  setUser: (user: UserData | null) => void
  updateUser: (updates: Partial<UserData>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='))
      return userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])) : null
    }
    return null
  })

  const updateUser = (updates: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      const expirationDate = new Date()
      expirationDate.setFullYear(expirationDate.getFullYear() + 1)
      document.cookie = `user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; expires=${expirationDate.toUTCString()}`
      setUser(updatedUser)
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 