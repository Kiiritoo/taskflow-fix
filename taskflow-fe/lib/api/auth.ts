import { z } from "zod"

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

// API response types
interface LoginSuccessResponse {
  success: true;
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

interface LoginErrorResponse {
  success: false;
  error: string;
  status: number;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

// API endpoints
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5254/api"

// Helper function to hash password
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

export async function login(data: LoginInput): Promise<LoginResponse> {
  console.log("Making API call to:", `${API_URL}/auth/login`)
  
  // Hash the password before sending
  const hashedPassword = await hashPassword(data.password)
  
  const requestData = {
    email: data.email,
    password: hashedPassword
  }
  
  console.log("Request data:", requestData)
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })

    console.log("Response status:", response.status)
    const responseText = await response.text()
    console.log("Raw response:", responseText)

    if (!response.ok) {
      let errorMessage = "Login failed"
      try {
        const errorJson = JSON.parse(responseText)
        errorMessage = errorJson.message || errorMessage
        
        // Return error response instead of throwing
        return {
          success: false,
          error: errorMessage,
          status: response.status
        }
      } catch (e) {
        console.error("Error parsing error response:", e)
        return {
          success: false,
          error: "An unexpected error occurred",
          status: response.status
        }
      }
    }

    try {
      const result = JSON.parse(responseText)
      console.log("Success response:", result)
      return {
        success: true,
        data: result
      }
    } catch (e) {
      console.error("Error parsing success response:", e)
      return {
        success: false,
        error: "Invalid response from server",
        status: 500
      }
    }
  } catch (error) {
    console.error("Network error:", error)
    return {
      success: false,
      error: "Network error. Please check your connection.",
      status: 0
    }
  }
}

export async function register(data: RegisterInput) {
  console.log("Making API call to:", `${API_URL}/auth/register`)
  
  // Hash the password before sending
  const hashedPassword = await hashPassword(data.password)
  
  const requestData = {
    username: data.username,
    email: data.email,
    passwordHash: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName
  }
  
  console.log("Request data:", requestData)
  
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })

  console.log("Response status:", response.status)

  if (!response.ok) {
    const error = await response.json()
    console.error("Error response:", error)
    throw new Error(error.message || "Registration failed")
  }

  const result = await response.json()
  console.log("Success response:", result)
  return result
} 