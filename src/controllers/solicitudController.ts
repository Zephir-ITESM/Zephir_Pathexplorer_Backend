import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { SolicitudModel } from "../models/solicitudModel"
import { UserModel } from "../models/userModels"
import { TipoUsuarioModel } from "../models/tipoUsuarioModel"
import { ProyectoModel } from "../models/proyectos/proyectoModel"
import { UsuarioProyectoModel } from "../models/proyectos/usuarioProyectoModel"
import { SolicitudService } from "../services/solicitudService"
import e from "express"

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id_usuario

        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
    }

    const { idInvitado, idProyecto, idRol } = req.params

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

    // checar que el usuario no haya sido invitado antes ni aplicado antes
    const invitacion = await SolicitudModel.findByProyectoSolicitado(Number(idProyecto), idInvitado)
    if (invitacion) {
        return res.status(400).json({ error: "El usuario ya ha sido invitado" })
    }

    const aplicacion = await SolicitudModel.findByProyectoSolicitante(Number(idProyecto), idInvitado)
    if (aplicacion) {
        return res.status(400).json({ error: "El usuario ya ha aplicado" })
    }


    console.log("Invite user request body:", req.body)

    const newInvitacion = await SolicitudModel.create({
        id_solicitante: userId,
        id_solicitado: idInvitado,
        id_proyecto: Number(idProyecto),
        estado: "Pendiente",
        fecha_invitacion: new Date().toISOString(),
        id_rol: Number(idRol)
    })
    res.status(201).json(newInvitacion)

  } catch (error: any) {
    console.error("Error inviting user:", error)
    res.status(500).json({ error: error.message || "Internal server error" })
  }
}

export const applyToProject = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id_usuario

        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }

        const { idProyecto, idRol } = req.params

        if (!idProyecto) {
            return res.status(400).json({ error: "Falta el parámetro idProyecto" })
        }

        // checar que el proyecto existe
        const proyecto = await ProyectoModel.findById(Number(idProyecto))
        if (!proyecto) {
            return res.status(404).json({ error: "Proyecto no encontrado" })
        }

        // checar que el usuario no este ya en el proyecto
        const usuarioProyecto = await UsuarioProyectoModel.findByProyectoUsuario(userId, Number(idProyecto))
        if (usuarioProyecto) {
            return res.status(400).json({ error: "El usuario ya está en el proyecto" })
        }

        // checar que el usuario no haya sido invitado antes ni aplicado antes
        const invitacion = await SolicitudModel.findByProyectoSolicitado(Number(idProyecto), userId)
        if (invitacion) {
            return res.status(400).json({ error: "El usuario ya ha sido invitado" })
        }

        const aplicacion = await SolicitudModel.findByProyectoSolicitante(Number(idProyecto), userId)
        if (aplicacion) {
            return res.status(400).json({ error: "El usuario ya ha aplicado" })
        }

        const newAplicacion = await SolicitudModel.create({
            id_solicitante: userId,
            id_solicitado: proyecto[0].id_delivery_lead,
            id_proyecto: Number(idProyecto),
            estado: "Pendiente",
            fecha_invitacion: new Date().toISOString(),
            id_rol: Number(idRol)
        })
        res.status(201).json(newAplicacion)
    }
    catch (error: any) {
        console.error("Error applying to project:", error)
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
    
        const invitaciones = await SolicitudService.deliveryLeadInvitations(idDeliveryLead)
        return res.status(200).json(invitaciones)
    } catch (error: any) {
        console.error("Error al obtener invitaciones por id de delivery lead:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

export const getInvitationsByInvitado = async (req: Request, res: Response) => {
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
    
        const invitaciones = await SolicitudService.userInvitations(idInvitado)
        return res.status(200).json(invitaciones)
    } catch (error: any) {
        console.error("Error al obtener invitaciones por id de invitado:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

export const getInvitationsByProyecto = async (req: Request, res: Response) => {
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
    
        const invitaciones = await SolicitudService.projectInvitations(Number(idProyecto))
        return res.status(200).json(invitaciones)
    } catch (error: any) {
        console.error("Error al obtener invitaciones por id de proyecto:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

export const acceptInvitation = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id_usuario
    
        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }
    
        const { idSolicitud } = req.params
    
        if (!idSolicitud) {
            return res.status(400).json({ error: "Falta el parámetro idSolicitud" })
        }
    
        // checar que la solicitud existe
        const solicitud = await SolicitudModel.findById(Number(idSolicitud))
        if (!solicitud) {
            return res.status(404).json({ error: "Solicitud no encontrada" })
        }
    
        // checar que el usuario que hace el request sea el solicitado
        if (solicitud.id_solicitado !== userId) {
            return res.status(400).json({ error: "El usuario no es el solicitado" })
        }
    
        // checar que la solicitud no haya sido aceptada antes
        if (solicitud.estado === "Aceptada") {
            return res.status(400).json({ error: "La solicitud ya ha sido aceptada" })
        }
    
        // checar que la solicitud no haya sido rechazada antes
        if (solicitud.estado === "Rechazada") {
            return res.status(400).json({ error: "La solicitud ya ha sido rechazada" })
        }
    
        // aceptar la invitacion
        const updatedSolicitud = await SolicitudModel.update(Number(idSolicitud), { estado: "Aceptada" })
    
        // agregar al usuario al proyecto
        const newUsuarioProyecto = await UsuarioProyectoModel.create({
            id_usuario: userId,
            id_proyecto: solicitud.id_proyecto,
            id_rol: solicitud.id_rol,
            feedback: "",
            calificacion: 0
        })
    
        res.status(200).json(updatedSolicitud)
    } catch (error: any) {
        console.error("Error al aceptar invitacion:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

export const rejectInvitation = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id_usuario
    
        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }
    
        const { idSolicitud } = req.params
    
        if (!idSolicitud) {
            return res.status(400).json({ error: "Falta el parámetro idSolicitud" })
        }
    
        // checar que la solicitud existe
        const solicitud = await SolicitudModel.findById(Number(idSolicitud))
        if (!solicitud) {
            return res.status(404).json({ error: "Solicitud no encontrada" })
        }
    
        // checar que el usuario que hace el request sea el solicitado
        if (solicitud.id_solicitado !== userId) {
            return res.status(400).json({ error: "El usuario no es el solicitado" })
        }
    
        // checar que la solicitud no haya sido aceptada antes
        if (solicitud.estado === "Aceptada") {
            return res.status(400).json({ error: "La solicitud ya ha sido aceptada" })
        }
    
        // checar que la solicitud no haya sido rechazada antes
        if (solicitud.estado === "Rechazada") {
            return res.status(400).json({ error: "La solicitud ya ha sido rechazada" })
        }
    
        // rechazar la invitacion
        const updatedSolicitud = await SolicitudModel.update(Number(idSolicitud), { estado: "Rechazada" }) // se eliminarán??????
    
        res.status(200).json(updatedSolicitud)
    } catch (error: any) {
        console.error("Error al rechazar invitacion:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

export const deleteInvitation = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id_usuario
    
        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }
    
        const { idSolicitud } = req.params
    
        if (!idSolicitud) {
            return res.status(400).json({ error: "Falta el parámetro idSolicitud" })
        }
    
        // checar que la solicitud existe
        const solicitud = await SolicitudModel.findById(Number(idSolicitud))
        if (!solicitud) {
            return res.status(404).json({ error: "Solicitud no encontrada" })
        }
    
        // checar que el usuario que hace el request sea el solicitante
        if (solicitud.id_solicitante !== userId) {
            return res.status(400).json({ error: "El usuario no es el solicitante" })
        }
    
        // checar que la solicitud no haya sido aceptada antes
        if (solicitud.estado === "Aceptada") {
            return res.status(400).json({ error: "La solicitud ya ha sido aceptada" })
        }
    
        // checar que la solicitud no haya sido rechazada antes
        if (solicitud.estado === "Rechazada") {
            return res.status(400).json({ error: "La solicitud ya ha sido rechazada" })
        }
    
        // eliminar la invitacion
        const deletedSolicitud = await SolicitudModel.delete(Number(idSolicitud))
    
        res.status(200).json(deletedSolicitud)
    } catch (error: any) {
        console.error("Error al eliminar invitacion:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

export const acceptApplication = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id_usuario
    
        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }
    
        const { idSolicitud } = req.params
    
        if (!idSolicitud) {
            return res.status(400).json({ error: "Falta el parámetro idSolicitud" })
        }
    
        // checar que la solicitud existe
        const solicitud = await SolicitudModel.findById(Number(idSolicitud))
        if (!solicitud) {
            return res.status(404).json({ error: "Solicitud no encontrada" })
        }


        // checar que la solicitud no haya sido aceptada antes
        if (solicitud.estado === "Aceptada") {
            return res.status(400).json({ error: "La solicitud ya ha sido aceptada" })
        }
    
        // checar que la solicitud no haya sido rechazada antes
        if (solicitud.estado === "Rechazada") {
            return res.status(400).json({ error: "La solicitud ya ha sido rechazada" })
        }
    
        // aceptar la aplicacion
        const updatedSolicitud = await SolicitudModel.update(Number(idSolicitud), { estado: "Aceptada" })
    
        // agregar al usuario al proyecto
        const newUsuarioProyecto = await UsuarioProyectoModel.create({
            id_usuario: solicitud.id_solicitante,
            id_proyecto: solicitud.id_proyecto,
            id_rol: solicitud.id_rol,
            feedback: "",
            calificacion: 0
        })
    
        res.status(200).json(updatedSolicitud)
    } catch (error: any) {
        console.error("Error al aceptar aplicacion:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}

export const rejectApplication = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id_usuario
    
        if (!userId) {
            res.status(400).json({ error: "User ID is required" })
            return
        }
    
        const { idSolicitud } = req.params
    
        if (!idSolicitud) {
            return res.status(400).json({ error: "Falta el parámetro idSolicitud" })
        }
    
        // checar que la solicitud existe
        const solicitud = await SolicitudModel.findById(Number(idSolicitud))
        if (!solicitud) {
            return res.status(404).json({ error: "Solicitud no encontrada" })
        }
    
        // checar que la solicitud no haya sido aceptada antes
        if (solicitud.estado === "Aceptada") {
            return res.status(400).json({ error: "La solicitud ya ha sido aceptada" })
        }
    
        // checar que la solicitud no haya sido rechazada antes
        if (solicitud.estado === "Rechazada") {
            return res.status(400).json({ error: "La solicitud ya ha sido rechazada" })
        }
    
        // rechazar la aplicacion
        const updatedSolicitud = await SolicitudModel.update(Number(idSolicitud), { estado: "Rechazada" }) // se eliminarán??????
    
        res.status(200).json(updatedSolicitud)
    } catch (error: any) {
        console.error("Error al rechazar aplicacion:", error.message)
        return res.status(500).json({ error: "Error del servidor" })
    }
}



