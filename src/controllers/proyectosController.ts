import type { Request, Response } from "express"
import { UsuarioProyectosService } from "../services/usuarioProyectosService"
import e from "express"
import { ProyectoModel } from "../models/proyectos/proyectoModel"
import { validateProject, validateUserProject } from "../utils/proyectosValidation"
import { UsuarioProyectoModel } from "../models/proyectos/usuarioProyectoModel"
import { UserModel } from "../models/userModels"
import { TipoUsuarioModel } from "../models/tipoUsuarioModel"
import { RolModel } from "../models/proyectos/rolModel"

// obtener proyectos de un usuario
export const getUserProjects = async (req: Request, res: Response) => {
    try {
        const { idUsuario } = req.params

        if (!idUsuario) {
            return res.status(400).json({ error: "Falta el parámetro idUsuario" })
        }

        const proyectos = await UsuarioProyectosService.getUserProjects(idUsuario)
        return res.status(200).json(proyectos)
    } catch (error: any) {
        console.error("Error al obtener proyectos del usuario:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

// obtener proyectos por id de delivery lead
export const getProjectsByDeliveryLead = async (req: Request, res: Response) => {
    try {
        const { idDeliveryLead } = req.params

        if (!idDeliveryLead) {
            return res.status(400).json({ error: "Falta el parámetro idDeliveryLead" })
        }

        // Verificar que exista el delivery lead
        const idTipoUsuario = await UserModel.findTipoUsuarioById(idDeliveryLead)
        if (idTipoUsuario === null) {
            return res.status(400).json({ error: "Id delivery lead inválido" })
        }

        const tipoUsuario = await TipoUsuarioModel.findById(idTipoUsuario)
        if (tipoUsuario?.nombre === "Delivery Lead") {
            return res.status(400).json({ error: "El id proporcionado no corresponde a un Delivery Lead" })
        }

        const proyectos = await ProyectoModel.findByPeopleLead(idDeliveryLead)
        return res.status(200).json(proyectos)
    } catch (error: any) {
        console.error("Error al obtener proyectos por id de delivery lead:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

// obtener usuarios asignados a un proyecto
export const getProjectAssignedUsers = async (req: Request, res: Response) => {
    try {
        const { idProyecto } = req.params

        if (!idProyecto) {
            return res.status(400).json({ error: "Falta el parámetro idProyecto" })
        }

        const usuarios = await UsuarioProyectosService.getProjectAssignedUsers(Number(idProyecto))
        return res.status(200).json(usuarios)
    } catch (error: any) {
        console.error("Error al obtener usuarios asignados a un proyecto:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

// agregar un proyecto al usuario
export const addProjectToUser = async (req: Request, res: Response) => {
    try {
        console.log("Add project to user request body:", req.body)

        const userId = req.user?.id_usuario

        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }

        // Validate input
        const validation = validateUserProject(req.body)
        if (!validation.isValid) {
            res.status(400).json({ error: validation.errors.join(", ") })
            return
        }

        // validar que el usuario no tenga el proyecto asignado ya
        const {id_proyecto, id_rol} = req.body

        // validar que el usuario no tenga el proyecto asignado ya
        if (UsuarioProyectoModel.findByProyectoUsuario(userId, id_proyecto) != null) {
            return res.status(400).json({ error: "El usuario ya tiene el proyecto asignado" })
        }


        //  validar que el proyecto exista
        const proyecto = await ProyectoModel.findById(id_proyecto)
        if (!proyecto) {
            return res.status(400).json({ error: "El proyecto no existe" })
        }

        // validar que el rol exista
        const rol = await RolModel.findById(id_rol)
        if (!rol) {
            return res.status(400).json({ error: "El rol no existe" })
        }

        // Create user project
        const newProject = await UsuarioProyectoModel.create({ id_usuario: userId, id_proyecto, id_rol, feedback: undefined, calificacion: 0 })

        res.status(201).json(newProject)
    } catch (error: any) {
        console.error("Error al agregar proyecto al usuario:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

// agregar un nuevo proyecto
export const addProject = async (req: Request, res: Response) => {
    try {
        console.log("Add project request body:", req.body)

        // Validate input
        const validation = validateProject(req.body)
        if (!validation.isValid) {
            res.status(400).json({ error: validation.errors.join(", ") })
            return
        }

        const { nombre, descripcion, fecha_inicio, fecha_fin, id_people_lead, cupo_limite, horas } = req.body

        // Create project
        const newProject = await ProyectoModel.create({ nombre, descripcion, fecha_inicio, fecha_fin, id_people_lead, cupo_limite, horas })

        res.status(201).json(newProject)
    } catch (error: any) {
        console.error("Error al agregar proyecto:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}



// obtener proyectos completados del usuario

// obtener proyectos en progreso del usuario

// obtener proyectos no iniciados del usuario

