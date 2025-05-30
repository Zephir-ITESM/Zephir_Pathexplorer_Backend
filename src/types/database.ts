export interface Database {
  public: {
    Tables: {
      usuario: {
        Row: {
          id_usuario: number
          auth_user_id: string
          correo: string
          nombre: string | null
          apellido_p: string | null
          apellido_m: string | null
          id_tipo_usuario: number
          fecha_ingreso: string
          descripcion: string | null
          profesion: string | null
        }
        Insert: {
          id_usuario?: number
          auth_user_id: string
          correo: string
          nombre?: string | null
          apellido_p?: string | null
          apellido_m?: string | null
          id_tipo_usuario?: number
          fecha_ingreso?: string
          descripcion?: string | null
          profesion?: string | null
        }
        Update: {
          id_usuario?: number
          auth_user_id?: string
          correo?: string
          nombre?: string | null
          apellido_p?: string | null
          apellido_m?: string | null
          id_tipo_usuario?: number
          fecha_ingreso?: string
          descripcion?: string | null
          profesion?: string | null
        }
      }
      // Add other tables as needed
    }
  }
}
