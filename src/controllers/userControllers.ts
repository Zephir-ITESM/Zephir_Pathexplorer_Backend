import type { Response } from "express"
import { supabaseAdmin } from "../config/supabase"
import type { AuthenticatedRequest } from "../middleware/auth"

/**
 * Get the current user's profile
 */
export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    // Get user profile from usuario table
    const { data, error } = await supabaseAdmin.from("usuario").select("*").eq("auth_user_id", req.userId).single()

    if (error) {
      return res.status(404).json({ error: "User profile not found" })
    }

    res.json(data)
  } catch (error) {
    console.error("Get user profile error:", error)
    res.status(500).json({ error: "Failed to get user profile" })
  }
}

/**
 * Update the current user's profile
 */
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    const { nombre, apellido_p, apellido_m, profesion, telefono, intereses, descripcion } = req.body

    // Get the usuario id first
    const { data: userData, error: userError } = await supabaseAdmin
      .from("usuario")
      .select("id_usuario")
      .eq("auth_user_id", req.userId)
      .single()

    if (userError || !userData) {
      return res.status(404).json({ error: "User profile not found" })
    }

    // Update the user profile
    const { data, error } = await supabaseAdmin
      .from("usuario")
      .update({
        nombre,
        apellido_p,
        apellido_m,
        profesion,
        telefono,
        intereses,
        descripcion,
        updated_at: new Date().toISOString(),
      })
      .eq("id_usuario", userData.id_usuario)
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    console.error("Update user profile error:", error)
    res.status(500).json({ error: "Failed to update user profile" })
  }
}

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params

    // Get user profile
    const { data, error } = await supabaseAdmin.from("usuario").select("*").eq("id_usuario", id).single()

    if (error) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(data)
  } catch (error) {
    console.error("Get user by ID error:", error)
    res.status(500).json({ error: "Failed to get user" })
  }
}

/**
 * List all users (admin only)
 */
export const listUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Pagination parameters
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const offset = (page - 1) * limit

    // Get users with pagination
    const { data, error, count } = await supabaseAdmin
      .from("usuario")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)
      .order("fecha_ingreso", { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({
      users: data,
      pagination: {
        total: count,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0,
      },
    })
  } catch (error) {
    console.error("List users error:", error)
    res.status(500).json({ error: "Failed to list users" })
  }
}

/**
 * Change user type (admin only)
 */
export const changeUserType = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { id_tipo_usuario } = req.body

    if (!id_tipo_usuario) {
      return res.status(400).json({ error: "User type is required" })
    }

    // Update user type
    const { data, error } = await supabaseAdmin
      .from("usuario")
      .update({ id_tipo_usuario })
      .eq("id_usuario", id)
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    console.error("Change user type error:", error)
    res.status(500).json({ error: "Failed to change user type" })
  }
}

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params

    // Get auth_user_id first
    const { data: userData, error: userError } = await supabaseAdmin
      .from("usuario")
      .select("auth_user_id")
      .eq("id_usuario", id)
      .single()

    if (userError || !userData) {
      return res.status(404).json({ error: "User not found" })
    }

    // Delete from usuario table first
    const { error: deleteError } = await supabaseAdmin.from("usuario").delete().eq("id_usuario", id)

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message })
    }

    // Delete from auth.users
    if (userData.auth_user_id) {
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userData.auth_user_id)

      if (authError) {
        console.error("Failed to delete auth user:", authError)
        // Continue anyway as the usuario record is deleted
      }
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ error: "Failed to delete user" })
  }
}

/**
 * Create a new user (admin only)
 */
export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { correo, contraseña, nombre, apellido_p, apellido_m, id_tipo_usuario, profesion, telefono, descripcion } =
      req.body

    if (!correo || !contraseña) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: correo,
      password: contraseña,
      email_confirm: true,
      user_metadata: {
        nombre,
        apellido_p,
        apellido_m,
        profesion,
      },
    })

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    if (!authData.user) {
      return res.status(500).json({ error: "Failed to create user" })
    }

    // The trigger should automatically create the usuario record
    // But we can update it with additional fields
    const { data, error } = await supabaseAdmin
      .from("usuario")
      .update({
        telefono,
        descripcion,
        id_tipo_usuario: id_tipo_usuario || 2, // Default to employee
      })
      .eq("auth_user_id", authData.user.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating usuario record:", error)
      // Continue anyway as the user is created
    }

    res.status(201).json({
      message: "User created successfully",
      user: data || { auth_user_id: authData.user.id, correo },
    })
  } catch (error) {
    console.error("Create user error:", error)
    res.status(500).json({ error: "Failed to create user" })
  }
}

/**
 * Get user's path carrera
 */
export const getUserPathCarrera = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    // Get user's ID from usuario table
    const { data: userData, error: userError } = await supabaseAdmin
      .from("usuario")
      .select("id_usuario")
      .eq("auth_user_id", req.userId)
      .single()

    if (userError || !userData) {
      return res.status(404).json({ error: "User profile not found" })
    }

    // Get user's path carrera
    const { data, error } = await supabaseAdmin.from("path_carrera").select("*").eq("usuario_id", userData.id_usuario)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    console.error("Get user path carrera error:", error)
    res.status(500).json({ error: "Failed to get user path carrera" })
  }
}
