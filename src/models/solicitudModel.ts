import { supabase } from "../config/supabase";
import type { Solicitud, SolicitudInput } from "../types/solicitud";

export class SolicitudModel {
    static async create(data: SolicitudInput): Promise<Solicitud> {
        const { data: result, error } = await supabase
            .from("solicitud")
            .insert([data])
            .select();

        if (error) {
            throw new Error(`Error creando solicitud: ${error.message}`);
        }

        return result[0] as Solicitud;
    }

    static async findById(id: number): Promise<Solicitud | null> {
        const { data, error } = await supabase
            .from("solicitud")
            .select("*")
            .eq("id_solicitud", id)
            .single();

        if (error) {
            throw new Error(`Error encontrando solicitud con ese id: ${error.message}`);
        }

        return data as Solicitud;
    }

    static async findBySolicitante(solicitante: string): Promise<Solicitud[]> {
        const { data, error } = await supabase
            .from("solicitud")
            .select("*")
            .eq("id_solicitante", solicitante);

        if (error) {
            throw new Error(`Error encontrando solicitudes del usuario: ${error.message}`);
        }

        return data as Solicitud[];
    }

    static async findBySolicitado(solicitado: string): Promise<Solicitud[]> {
        const { data, error } = await supabase
            .from("solicitud")
            .select("*")
            .eq("id_solicitado", solicitado);

        if (error) {
            throw new Error(`Error encontrando solicitudes de ese usuario: ${error.message}`);
        }

        return data as Solicitud[];
    }

    static async findByProyecto(idProyecto: number): Promise<Solicitud[]> {
        const { data, error } = await supabase
            .from("solicitud")
            .select("*")
            .eq("id_proyecto", idProyecto);

        if (error) {
            throw new Error(`Error encontrando solicitudes de ese proyecto: ${error.message}`);
        }
        return data as Solicitud[];
    }

    static async findByProyectoSolicitado(idProyecto: number, id_solicitado: string): Promise<Solicitud[]> {
        const { data, error } = await supabase
            .from("solicitud")
            .select("*")
            .eq("id_proyecto", idProyecto)
            .eq("id_solicitado", id_solicitado);

        if (error) {
            throw new Error(`Error encontrando solicitudes de ese proyecto y usuario: ${error.message}`);
        }

        return data as Solicitud[];
    }


    static async findByProyectoSolicitante(idProyecto: number, id_solicitante: string): Promise<Solicitud[]> {
        const { data, error } = await supabase
            .from("solicitud")
            .select("*")
            .eq("id_proyecto", idProyecto)
            .eq("id_solicitante", id_solicitante);

        if (error) {
            throw new Error(`Error encontrando solicitudes de ese proyecto y usuario: ${error.message}`);
        }

        return data as Solicitud[];
    }

    static async delete(id: number): Promise<void> {
        const { error } = await supabase.from("solicitud").delete().eq("id_solicitud", id);

        if (error) {
            throw new Error(`Error eliminando solicitud: ${error.message}`);
        }
    }

    static async update(id: number, data: Partial<SolicitudInput>): Promise<Solicitud> {
        const { data: result, error } = await supabase
            .from("solicitud")
            .update(data)
            .eq("id_solicitud", id)
            .select();

        if (error) {
            throw new Error(`Error actualizando solicitud: ${error.message}`);
        }

        return result[0] as Solicitud;
    }

}

