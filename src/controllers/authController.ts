import type { Request, Response } from "express"
import { supabaseAdmin, supabase } from "../config/supabase"
import type { AuthenticatedRequest } from "../middleware/auth"

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { correo, contraseña } = req.body

    if (!correo || !contraseña) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: contraseña,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    if (!data.session) {
      return res.status(500).json({ error: "Failed to create session" })
    }

    // Get user profile from usuario table
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("usuario")
      .select("*")
      .eq("auth_user_id", data.user.id)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
      // Continue anyway, as authentication succeeded
    }

    // Return session and user data
    res.json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        ...data.user,
        profile: userProfile || null,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Authentication failed" })
  }
}

// Logout user
export const logoutUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(400).json({ error: "No token provided" })
    }

    // Create a client with the user's token
    const { error } = await supabaseAdmin.auth.admin.signOut(token)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ error: "Logout failed" })
  }
}

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" })
    }

    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    if (!data.session) {
      return res.status(401).json({ error: "Failed to refresh session" })
    }

    res.json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    })
  } catch (error) {
    console.error("Token refresh error:", error)
    res.status(500).json({ error: "Token refresh failed" })
  }
}

// Get current user
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    // Get user profile
    const { data, error } = await supabaseAdmin.from("usuario").select("*").eq("auth_user_id", req.userId).single()

    if (error) {
      return res.status(404).json({ error: "User profile not found" })
    }

    res.json(data)
  } catch (error) {
    console.error("Get current user error:", error)
    res.status(500).json({ error: "Failed to get user data" })
  }
}
