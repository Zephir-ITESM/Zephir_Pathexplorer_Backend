import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { getAuthenticatedClient } from "../config/supabase"

// Extend the Request interface to include user and supabaseAuth
declare global {
  namespace Express {
    interface Request {
      user: any
      supabaseAuth: ReturnType<typeof getAuthenticatedClient>
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    res.status(401).json({ error: "Authentication required" })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = decoded
    
    // Create an authenticated Supabase client with the user's token
    req.supabaseAuth = getAuthenticatedClient(token)
    
    console.log("Decoded token:", decoded)
    next()
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" })
    return
  }
}