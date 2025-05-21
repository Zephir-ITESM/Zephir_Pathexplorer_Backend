import { supabase } from "../config/supabase"
import type { User, UserInput } from "../types/user"
import type { SupabaseClient } from "@supabase/supabase-js"
import bcrypt from "bcrypt"
import { BaseModel } from "./baseModel"

export class UserModel extends BaseModel {
  /**
   * Create a new user
   */
  static async create(userData: UserInput, authClient?: SupabaseClient): Promise<User> {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.contraseña, 10)

    // Insert user into database
    const { data, error } = await this.getClient(authClient)
      .from("usuario")
      .insert([
        {
          id_tipo_usuario: userData.id_tipo_usuario,
          correo: userData.correo,
          contraseña: hashedPassword,
          profesion: userData.profesion,
          nombre: userData.nombre,
          apellido_p: userData.apellido_p,
          apellido_m: userData.apellido_m,
          fecha_ingreso: userData.fecha_ingreso,
          descripcion: userData.descripcion
        }
      ])
      .select()

    if (error) {
      throw new Error(`Error creating user: ${error.message}`)
    }

    return data[0] as User
  }

  /**
   * Find a user by email
   */
  static async findByEmail(email: string, authClient?: SupabaseClient): Promise<User | null> {
    const { data, error } = await this.getClient(authClient)
      .from("usuario")
      .select("*")
      .eq("correo", email)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // PGRST116 is the error code for "no rows returned"
        return null
      }
      throw new Error(`Error finding user: ${error.message}`)
    }

    return data as User
  }

  /**
   * Find a user by ID
   */
  static async findById(id: string, authClient?: SupabaseClient): Promise<User | null> {
    const { data, error } = await this.getClient(authClient)
      .from("usuario")
      .select("id_usuario, id_tipo_usuario, correo, created_at")
      .eq("id_usuario", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Error finding user: ${error.message}`)
    }

    return data as User
  }

  /**
   * Obtain id_tipo_usuario by id_usuario
   */
  static async findTipoUsuarioById(id: string, authClient?: SupabaseClient): Promise<number | null> {
    const { data, error } = await this.getClient(authClient)
      .from("usuario")
      .select("id_tipo_usuario")
      .eq("id_usuario", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Error finding user: ${error.message}`)
    }

    return data.id_tipo_usuario as number
  }

  /**
   * Update a user
   */
  static async update(id: string, userData: Partial<UserInput>, authClient?: SupabaseClient): Promise<User> {
    // If password is being updated, hash it
    if (userData.contraseña) {
      userData.contraseña = await bcrypt.hash(userData.contraseña, 10)
    }

    const { data, error } = await this.getClient(authClient)
      .from("usuario")
      .update(userData)
      .eq("id_usuario", id)
      .select()

    if (error) {
      throw new Error(`Error updating user: ${error.message}`)
    }

    return data[0] as User
  }

  /**
   * Delete a user
   */
  static async delete(id: string, authClient?: SupabaseClient): Promise<void> {
    const { error } = await this.getClient(authClient)
      .from("usuario")
      .delete()
      .eq("id_usuario", id)

    if (error) {
      throw new Error(`Error deleting user: ${error.message}`)
    }
  }

  /**
   * Verify password
   */
  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.contraseña)
  }
}