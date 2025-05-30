import { supabase } from "../config/supabase";
import { Proyecto } from "../types/proyecto";



export class ProyectosEnPeriodosService {
    /**
     * Obtiene los proyectos activos en la semana actual.
     * @param userId: string
     * @returns Proyecto[]: Proyectos del usuario en la semana según el día de hoy.
     */
    static async getProyectosSemana(userId: string): Promise<Proyecto[]> {
        const { data, error } = await supabase
            .rpc("sp_get_proyectos_semana", { user_id: userId });

        if (error) {
            throw new Error(`Error obteniendo proyectos de la semana: ${error.message}`);
        }

        return data as Proyecto[];
    }
    /**
     * Obtiene los proyectos activos del mes actual.
     * @param userId: string
     * @returns Proyecto[]: Proyectos del usuario el mes actual
     */
    static async getProyectosMes(userId: string): Promise<Proyecto[]> {
        const { data, error } = await supabase
            .rpc("sp_get_proyectos_mes", { user_id: userId });

        if (error) {
            throw new Error(`Error obteniendo proyectos del mes: ${error.message}`);
        }

        return data as Proyecto[];
    }

    /**
     * Obitiene los proyectos activos de los últimos 90 días.
     * @param userId: string
     * @returns Proyecto[]: Proyectos del usuario en los últimos 90 días
     */
    static async getProyectosNoventaDias(userId: string): Promise<Proyecto[]> {
        const { data, error } = await supabase
            .rpc("sp_get_proyectos_90_dias", { user_id: userId });

        if (error) {
            throw new Error(`Error obteniendo proyectos de los últimos 90 días: ${error.message}`);
        }

        return data as Proyecto[];
    }

    /**
     * Obtiene los proyectos activos del semestre actual (Primera mitad o segunda mitad del año).
     * @param userId: string
     * @returns Proyecto[]: Proyectos del usuario en el semestre actual
     */
    static async getProyectosSemestre(userId: string): Promise<Proyecto[]> {
        const { data, error } = await supabase
            .rpc("sp_get_proyectos_semestre", { user_id: userId });

        if (error) {
            throw new Error(`Error obteniendo proyectos del semestre: ${error.message}`);
        }

        return data as Proyecto[];
    }

    /**
     * Obtiene los proyectos activos del año actual.
     * @param userId: string
     * @returns Proyecto[]: Proyectos activos del usuario del año actual
     */
    static async getProyectosAnio(userId: string): Promise<Proyecto[]> {
        const { data, error } = await supabase
            .rpc("sp_get_proyectos_anio", { user_id: userId });

        if (error) {
            throw new Error(`Error obteniendo proyectos del año: ${error.message}`);
        }

        return data as Proyecto[];
    }

}