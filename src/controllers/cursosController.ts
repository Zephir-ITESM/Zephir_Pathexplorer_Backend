import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { CursoModel } from "../models/cursos-certificados/cursoModel"
import { Top10CursosService } from "../services/top10CursosService";

export const getTop10Cursos = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; // assuming `authenticateToken` attaches user to `req`
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const proyectos = await Top10CursosService.getTop10Cursos();
        res.status(200).json(proyectos);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};