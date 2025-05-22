export interface Solicitud {
    id_solictud: number;
    id_solicitante: string;
    id_solicitado: string;
    id_proyecto: number;
    estado: string;
    fecha: string;
    id_rol: number;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface SolicitudInput {
    id_solicitante: string;
    id_solicitado: string;
    id_proyecto: number;
    estado: string;
    fecha_invitacion: string;
    id_rol: number;
  }