import type { Request, Response, NextFunction } from "express"
import { supabaseAdmin } from "../config/supabase"

// Define a custom interface to extend Express Request
export interface AuthenticatedRequest extends Request {
  user?: any
  userId?: string
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }

    // Verify token with Supabase
    const { data, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" })
    }

    // Add user info to request
    req.user = data.user
    req.userId = data.user.id // This is the auth.uid()

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ error: "Token verification failed" })
  }
}

// Optional middleware to check if user has admin role
export const requireAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Authentication required" })
    }

    // Get user type from usuario table
    const { data, error } = await supabaseAdmin
      .from("usuario")
      .select("id_tipo_usuario")
      .eq("auth_user_id", req.userId)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: "User profile not found" })
    }

    // Check if user is admin (assuming id_tipo_usuario = 1 is admin)
    if (data.id_tipo_usuario !== 1) {
      return res.status(403).json({ error: "Admin access required" })
    }

    next()
  } catch (error) {
    console.error("Admin check error:", error)
    res.status(500).json({ error: "Server error" })
  }
}
