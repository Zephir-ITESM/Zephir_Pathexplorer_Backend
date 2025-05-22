import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { InvitacionModel } from "../models/invitacionModel"
import { UserModel } from "../models/userModels"
import { TipoUsuarioModel } from "../models/tipoUsuarioModel"
import { ProyectoModel } from "../models/proyectos/proyectoModel"
import { UsuarioProyectoModel } from "../models/proyectos/usuarioProyectoModel"
import { InvitacionService } from "../services/invitacionService"
import e from "express"

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id_usuario

        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
    }

    const { idInvitado, idProyecto } = req.params

    if (!idProyecto) {
        return res.status(400).json({ error: "Falta el parámetro idProyecto" })
    }

    if (!idInvitado) {
        return res.status(400).json({ error: "Falta el parámetro idUsuario" })
    }

    // checar que usuario que hace el request sea delivery lead
    const idTipoUsuario = await UserModel.findTipoUsuarioById(userId)
    if (idTipoUsuario === null) {
        return res.status(400).json({ error: "Id delivery lead inválido" })
    }
    const tipoUsuario = await TipoUsuarioModel.findById(idTipoUsuario)
    if (tipoUsuario?.nombre !== "Delivery Lead") {
        return res.status(400).json({ error: "El id proporcionado no corresponde a un Delivery Lead" })
    }

    // checar que el usuario invitado existe
    const usuarioInvitado = await UserModel.findById(idInvitado)
    if (!usuarioInvitado) {
        return res.status(404).json({ error: "Usuario invitado no encontrado" })
    }

    // checar que el proyecto existe
    const proyecto = await ProyectoModel.findById(Number(idProyecto))
    if (!proyecto) {
        return res.status(404).json({ error: "Proyecto no encontrado" })
    }

    // checar que el usuario no este ya en el proyecto
    const usuarioProyecto = await UsuarioProyectoModel.findByProyectoUsuario(idInvitado, Number(idProyecto))
    if (usuarioProyecto) {
        return res.status(400).json({ error: "El usuario ya está en el proyecto" })
    }

    // checar que el usuario no haya sido invitado antes
    const invitacion = await InvitacionModel.findByProyectoInvitado(Number(idProyecto), idInvitado)
    if (invitacion) {
        return res.status(400).json({ error: "El usuario ya ha sido invitado" })
    }


    console.log("Invite user request body:", req.body)

    const newInvitacion = await InvitacionModel.create({
        id_delivery_lead: userId,
        id_invitado: idInvitado,
        id_proyecto: Number(idProyecto),
        estado: "Pendiente",
        fecha: new Date().toISOString(),
    })
    res.status(201).json(newInvitacion)

  } catch (error: any) {
    console.error("Error inviting user:", error)
    res.status(500).json({ error: error.message || "Internal server error" })
  }
}

export const getInvitationsByDeliveryLead = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id_usuario
    
        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }
    
        const { idDeliveryLead } = req.params
    
        if (!idDeliveryLead) {
            return res.status(400).json({ error: "Falta el parámetro idDeliveryLead" })
        }
    
        // checar que el usuario existe
        const usuario = await UserModel.findById(idDeliveryLead)
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }
    
        // checar que el usuario que hace el request sea delivery lead
        const idTipoUsuario = await UserModel.findTipoUsuarioById(userId)
        if (idTipoUsuario === null) {
            return res.status(400).json({ error: "Id delivery lead inválido" })
        }
        const tipoUsuario = await TipoUsuarioModel.findById(idTipoUsuario)
        if (tipoUsuario?.nombre !== "Delivery Lead") {
            return res.status(400).json({ error: "El id proporcionado no corresponde a un Delivery Lead" })
        }
    
        const invitaciones = await InvitacionService.deliveryLeadInvitations(idDeliveryLead)
        return res.status(200).json(invitaciones)
    } catch (error: any) {
        console.error("Error al obtener invitaciones por id de delivery lead:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

const getInvitationsByInvitado = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id_usuario
    
        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }
    
        const { idInvitado } = req.params
    
        if (!idInvitado) {
            return res.status(400).json({ error: "Falta el parámetro idInvitado" })
        }
    
        // checar que el usuario existe
        const usuario = await UserModel.findById(idInvitado)
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }
    
        const invitaciones = await InvitacionService.userInvitations(idInvitado)
        return res.status(200).json(invitaciones)
    } catch (error: any) {
        console.error("Error al obtener invitaciones por id de invitado:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

const getInvitationsByProyecto = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id_usuario
    
        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }
    
        const { idProyecto } = req.params
    
        if (!idProyecto) {
            return res.status(400).json({ error: "Falta el parámetro idProyecto" })
        }
    
        // checar que el proyecto existe
        const proyecto = await ProyectoModel.findById(Number(idProyecto))
        if (!proyecto) {
            return res.status(404).json({ error: "Proyecto no encontrado" })
        }
    
        const invitaciones = await InvitacionService.projectInvitations(Number(idProyecto))
        return res.status(200).json(invitaciones)
    } catch (error: any) {
        console.error("Error al obtener invitaciones por id de proyecto:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

const acceptInvitation = async (req: Request, res: Response) => {

}

const rejectInvitation = async (req: Request, res: Response) => {

}


