/**
 * Validar la entrada para una prioridad
 */

export function validatePriority_Objetivo_Interes(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
        if (!data.nombre) {
            errors.push("El nombre es obligatorio")
        }
    
        return {
            isValid: errors.length === 0,
            errors,
        }
}
