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
import { login, loginSchema, type LoginInput } from "@/lib/api/auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    try {
      const response = await login(data)
      
      if (response.success) {
        // Store user data in cookies
        document.cookie = `user=${JSON.stringify(response.data.user)}; path=/; max-age=86400` // 24 hours
        
        toast.success("Login successful!")
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        // Handle specific error cases based on backend responses
        if (response.status === 401) {
          setError("password", {
            type: "manual",
            message: "Invalid email or password"
          })
        } else if (response.status === 404) {
          setError("email", {
            type: "manual",
            message: "No account found with this email"
          })
        } else if (response.status === 400) {
          if (!data.email) {
            setError("email", {
              type: "manual",
              message: "Email is required"
            })
          }
          if (!data.password) {
            setError("password", {
              type: "manual",
              message: "Password is required"
            })
          }
        } else {
          toast.error(response.error, {
            duration: 5000,
            position: "top-center",
            style: {
              background: "#fff",
              color: "#dc2626",
              border: "1px solid #dc2626",
            },
          })
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred. Please try again later.", {
        duration: 5000,
        position: "top-center",
        style: {
          background: "#fff",
          color: "#dc2626",
          border: "1px solid #dc2626",
        },
      })
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
          <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
          <p className="text-lg opacity-90 mb-8">
            Sign in to continue managing your projects with TaskFlow.
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

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-2 text-center pb-8">
              <div className="flex justify-center mb-4 lg:hidden">
                <Link href="/">
                  <Image src="/placeholder.svg" alt="TaskFlow Logo" width={40} height={40} className="h-10 w-10" />
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`bg-white ${errors.email ? 'border-red-500' : ''}`}
                    {...formRegister("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className={`bg-white ${errors.password ? 'border-red-500' : ''}`}
                    {...formRegister("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00B8D4] to-[#0052D4] hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-[#00B8D4] hover:text-[#0052D4] transition-colors font-medium">
                    Sign up
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
