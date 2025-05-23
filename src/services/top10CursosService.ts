import { supabase } from "../config/supabase";
import { Curso } from "../types/curso";

export class Top10CursosService {
    static async getTop10Cursos(): Promise<Array<Curso & { total_usuarios: number }>> {
        const { data, error } = await supabase
            .rpc("get_top_10_cursos");

        if (error) {
            throw new Error(`Error obteniendo los top 10 cursos: ${error.message}`);
        }

        return data as Array<Curso & { total_usuarios: number }>;
    }
}
