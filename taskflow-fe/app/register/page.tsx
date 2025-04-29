"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { register, registerSchema, type RegisterInput } from "@/lib/api/auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    console.log("Form submitted with data:", data)
    setIsLoading(true)
    try {
      console.log("Sending registration request...")
      const response = await register(data)
      console.log("Registration response:", response)
      
      if (response && response.message) {
        toast.success(response.message)
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.user))
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        toast.success("Registration successful!")
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.user))
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (error) {
      console.error("Registration error:", error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#00B8D4] items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00B8D4] to-[#0052D4] opacity-90" />
        <div className="relative z-10 text-white max-w-md">
          <div className="mb-8">
            <Image src="/placeholder.svg" alt="TaskFlow Logo" width={48} height={48} className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold mb-6">Join TaskFlow Today</h1>
          <p className="text-lg opacity-90 mb-8">
            Start managing your projects more efficiently with TaskFlow's powerful project management tools.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { stat: "10k+", label: "Active Users" },
              { stat: "50k+", label: "Tasks Completed" },
              { stat: "99.9%", label: "Uptime" },
              { stat: "24/7", label: "Support" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold mb-1">{item.stat}</div>
                <div className="text-sm opacity-75">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-2 text-center pb-8">
              <div className="flex justify-center mb-4 lg:hidden">
                <Link href="/">
                  <Image src="/placeholder.svg" alt="TaskFlow Logo" width={40} height={40} className="h-10 w-10" />
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>Join TaskFlow and start managing your projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    className="bg-white"
                    {...formRegister("username")}
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="bg-white"
                    {...formRegister("email")}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-white"
                    {...formRegister("password")}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      className="bg-white"
                      {...formRegister("firstName")}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      className="bg-white"
                      {...formRegister("lastName")}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00B8D4] to-[#0052D4] hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#00B8D4] hover:text-[#0052D4] transition-colors font-medium">
                    Sign in
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
