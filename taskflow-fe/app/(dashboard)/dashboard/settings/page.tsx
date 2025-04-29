"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Shield, CreditCard, Upload, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Toaster } from "sonner"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  profilePicture: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateUser } = useUser()
  const [activeTab, setActiveTab] = useState("account")
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    profilePicture: "",
  })

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
      })
    }
  }, [user])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileForm(prev => ({
          ...prev,
          profilePicture: base64String
        }))
        updateUser({ profilePicture: base64String })
        toast.success("Profile picture updated successfully")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProfilePicture = () => {
    setProfileForm(prev => ({ ...prev, profilePicture: "" }))
    updateUser({ profilePicture: "" })
    toast.success("Profile picture removed successfully")
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      updateUser({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phone: profileForm.phone,
        bio: profileForm.bio,
        profilePicture: profileForm.profilePicture
      })

      toast.success("Profile updated successfully", {
        description: "Your changes have been saved",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        duration: 3000,
        position: "bottom-right",
      })
    } catch (error) {
      toast.error("Failed to update profile", {
        description: "Please try again later",
        duration: 3000,
        position: "bottom-right",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push("/login")
  }

  if (!user) return null

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || user.username?.[0] || 'U'

  return (
    <div className="container mx-auto py-6">
      <Toaster position="bottom-right" richColors />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and public profile.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24">
                        {profileForm.profilePicture ? (
                          <AvatarImage src={profileForm.profilePicture} alt="Profile picture" />
                        ) : (
                          <AvatarFallback className="bg-[#00B8D4] text-white text-xl font-semibold">
                            {initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Change
                        </Button>
                        {profileForm.profilePicture && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={handleRemoveProfilePicture}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <CardFooter className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDeleteAccountDialog(true)}
                      className="text-destructive"
                    >
                      Delete Account
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your security preferences and account access.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Password</Label>
                      <p className="text-sm text-muted-foreground">
                        Change your password
                      </p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your billing and subscription details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Current Plan</Label>
                      <p className="text-sm text-muted-foreground">
                        Free Plan
                      </p>
                    </div>
                    <Button variant="outline">Upgrade</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteAccountDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}