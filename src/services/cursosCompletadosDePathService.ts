import { supabase } from "../config/supabase";


export class CursosCompletadosDePathService {
    /*
    Obtiene todos los cursos que hay en un path de carrera y si el usuario los ha completado o no.
    Estatus:
    - Null =  No ha empezado el curso
    - false = Ha empezado el curso pero no lo ha completado
    - true = Ha completado el curso
    Input: id del usuario
    Output: JSON con los cursos y su estatus
    */
    static async getProyectosSemestre(userId: string) {
        const { data, error } = await supabase
            .rpc("", { user_id: userId });

        if (error) {
            throw new Error(`Error obteniendo proyectos del semestre: ${error.message}`);
        }

        return data;
    }
    
}