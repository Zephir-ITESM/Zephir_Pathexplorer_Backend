import {
    differenceInCalendarDays,
    max,
    min,
    parseISO,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subDays,
    startOfYear,
    endOfYear
} from 'date-fns';
import { Proyecto } from "../types/proyecto";

type Cargabilidad = number;

export class ProyectosEnPeriodosService {
    /**
     * Calcula la cargabilidad de los proyectos en un periodo dado.
     * @param proyectos Proyecto[] - Lista de proyectos del usuario.
     * @param inicioPeriodo Date - Fecha de inicio del periodo a evaluar.
     * @param finPeriodo Date - Fecha de fin del periodo a evaluar.
     * @returns Cargabilidad - Porcentaje de ocupación en el periodo especificado.
     */
    static calcularCargabilidad(proyectos: Proyecto[], inicioPeriodo: Date, finPeriodo: Date): Cargabilidad {
        const totalDiasPeriodo = differenceInCalendarDays(finPeriodo, inicioPeriodo) + 1;
        let diasActivos = 0;

        for (const proyecto of proyectos) {
            const inicioProyecto = parseISO(proyecto.fecha_inicio);
            const finProyecto = parseISO(proyecto.fecha_fin);

            const inicioActivo = max([inicioProyecto, inicioPeriodo]);
            const finActivo = min([finProyecto, finPeriodo]);

            const diasEnPeriodo = differenceInCalendarDays(finActivo, inicioActivo) + 1;
            if (diasEnPeriodo > 0) {
                diasActivos += diasEnPeriodo;
            }
        }

        const cargabilidad = (diasActivos / totalDiasPeriodo) * 100;
        return Math.min(100, Number(cargabilidad.toFixed(2))); // 100% máx
    }

    /**
     * Calcula la cargabilidad semanal de los proyectos.
     * @param proyectos Proyecto[] - Lista de proyectos activos en la semana.
     * @returns Cargabilidad - Porcentaje de ocupación en la semana actual.
     */
    static cargabilidadSemanal(proyectos: Proyecto[]): Cargabilidad {
        const hoy = new Date();
        const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 }); // lunes
        const finSemana = endOfWeek(hoy, { weekStartsOn: 1 }); // domingo
        return this.calcularCargabilidad(proyectos, inicioSemana, finSemana);
    }

    /**
     * Calcula la cargabilidad mensual de los proyectos.
     * @param proyectos Proyecto[] - Lista de proyectos activos en el mes.
     * @returns Cargabilidad - Porcentaje de ocupación en el mes actual.
     */
    static cargabilidadMensual(proyectos: Proyecto[]): Cargabilidad {
        const hoy = new Date();
        const inicioMes = startOfMonth(hoy);
        const finMes = endOfMonth(hoy);
        return this.calcularCargabilidad(proyectos, inicioMes, finMes);
    }

    /**
     * Calcula la cargabilidad de los proyectos en los últimos 90 días.
     * @param proyectos Proyecto[] - Lista de proyectos activos en los últimos 90 días.
     * @returns Cargabilidad - Porcentaje de ocupación en los últimos 90 días.
     */
    static cargabilidadNoventaDias(proyectos: Proyecto[]): Cargabilidad {
        const hoy = new Date();
        const inicio = subDays(hoy, 89); // hoy incluido
        return this.calcularCargabilidad(proyectos, inicio, hoy);
    }

    /**
     * Calcula la cargabilidad de los proyectos en el semestre actual.
     * @param proyectos Proyecto[] - Lista de proyectos activos en el semestre actual.
     * @returns Cargabilidad - Porcentaje de ocupación en el semestre actual.
     */
    static cargabilidadSemestral(proyectos: Proyecto[]): Cargabilidad {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const esPrimerSemestre = hoy.getMonth() < 6;
        const inicio = new Date(anio, esPrimerSemestre ? 0 : 6, 1);
        const fin = new Date(anio, esPrimerSemestre ? 5 : 11, 30); // fin de junio o diciembre
        return this.calcularCargabilidad(proyectos, inicio, fin);
    }

    /**
     * Calcula la cargabilidad de los proyectos en el año actual.
     * @param proyectos Proyecto[] - Lista de proyectos activos en el año actual.
     * @returns Cargabilidad - Porcentaje de ocupación en el año actual.
     */
    static cargabilidadAnual(proyectos: Proyecto[]): Cargabilidad {
        const hoy = new Date();
        const inicio = startOfYear(hoy);
        const fin = endOfYear(hoy);
        return this.calcularCargabilidad(proyectos, inicio, fin);
    }
}