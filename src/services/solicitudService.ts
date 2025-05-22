import { SolicitudModel } from "../models/solicitudModel";
import { UserModel } from "../models/userModels";
import { TipoUsuarioModel } from "../models/tipoUsuarioModel";
import { ProyectoModel } from "../models/proyectos/proyectoModel";
import { UsuarioProyectoModel } from "../models/proyectos/usuarioProyectoModel";
import{ RolModel } from "../models/proyectos/rolModel";

export class SolicitudService {
    // encontrar invitaciones de un usuario
    static async userInvitations(idUsuario: string) {
        const usuarioInvitaciones = await SolicitudModel.findBySolicitado(idUsuario);
        if (!usuarioInvitaciones) {
            throw new Error("No se encontraron invitaciones para este usuario");
        }

        const invitaciones = [];

        for (const invitacion of usuarioInvitaciones) {
            const proyecto = await ProyectoModel.findById(invitacion.id_proyecto);
            if (!proyecto) {
                throw new Error("No se encontró el proyecto para esta invitación");
            }
            const deliveryLead = await UserModel.findById(invitacion.id_solicitante);
            if (!deliveryLead) {
                throw new Error("No se encontró el delivery lead para esta invitación");
            }
            const rol = await RolModel.findById(invitacion.id_rol);
            if (!rol) {
                throw new Error("No se encontró el rol para esta invitación");
            }

            invitaciones.push({
                ...invitacion,
                proyecto,
                deliveryLead,
                rol
            });
        }

        return invitaciones;

    }

    // encontrar invitaciones de un delivery lead
    static async deliveryLeadInvitations(idDeliveryLead: string) {
        const deliveryLeadInvitaciones = await SolicitudModel.findBySolicitante(idDeliveryLead);
        if (!deliveryLeadInvitaciones) {
            throw new Error("No se encontraron invitaciones para este delivery lead");
        }

        const invitaciones = [];

        for (const invitacion of deliveryLeadInvitaciones) {
            const proyecto = await ProyectoModel.findById(invitacion.id_proyecto);
            if (!proyecto) {
                throw new Error("No se encontró el proyecto para esta invitación");
            }
            const usuarioInvitado = await UserModel.findById(invitacion.id_solicitado);
            if (!usuarioInvitado) {
                throw new Error("No se encontró el usuario invitado para esta invitación");
            }
            const rol = await RolModel.findById(invitacion.id_rol);
            if (!rol) {
                throw new Error("No se encontró el rol para esta invitación");
            }

            invitaciones.push({
                ...invitacion,
                proyecto,
                usuarioInvitado,
                rol
            });
        }

        return invitaciones;
    }

    // encontrar invitaciones de un proyecto
    static async projectInvitations(idProyecto: number) {
        const proyectoInvitaciones = await SolicitudModel.findByProyecto(idProyecto);
        if (!proyectoInvitaciones) {
            throw new Error("No se encontraron invitaciones para este proyecto");
        }

        const invitaciones = [];

        for (const invitacion of proyectoInvitaciones) {
            const usuarioInvitado = await UserModel.findById(invitacion.id_solicitado);
            if (!usuarioInvitado) {
                throw new Error("No se encontró el usuario invitado para esta invitación");
            }
            const deliveryLead = await UserModel.findById(invitacion.id_solicitante);
            if (!deliveryLead) {
                throw new Error("No se encontró el delivery lead para esta invitación");
            }
            const rol = await RolModel.findById(invitacion.id_rol);
            if (!rol) {
                throw new Error("No se encontró el rol para esta invitación");
            }
            invitaciones.push({
                ...invitacion,
                usuarioInvitado,
                deliveryLead,
                rol
            });
        }

        return invitaciones;
    }

    // encontrar aplicaciones de un usuario, usuario (solicitante) aplica a proyecto de delivery lead (solicitado)
    static async userApplications(idUsuario: string) {
        const usuarioAplicaciones = await SolicitudModel.findBySolicitante(idUsuario);
        if (!usuarioAplicaciones) {
            throw new Error("No se encontraron aplicaciones para este usuario");
        }

        const aplicaciones = [];

        for (const aplicacion of usuarioAplicaciones) {
            const proyecto = await ProyectoModel.findById(aplicacion.id_proyecto);
            if (!proyecto) {
                throw new Error("No se encontró el proyecto para esta aplicación");
            }
            const deliveryLead = await UserModel.findById(aplicacion.id_solicitado);
            if (!deliveryLead) {
                throw new Error("No se encontró el delivery lead para esta aplicación");
            }
            const rol = await RolModel.findById(aplicacion.id_rol);
            if (!rol) {
                throw new Error("No se encontró el rol para esta aplicación");
            }
            aplicaciones.push({
                ...aplicacion,
                proyecto,
                deliveryLead,
                rol
            });
        }

        return aplicaciones;
    }

    // encontrar aplicaciones de un delivery lead, el delivery lead obtiene las aplicaciones que recibió a sus proyectos
    static async deliveryLeadApplications(idDeliveryLead: string) {
        const deliveryLeadAplicaciones = await SolicitudModel.findBySolicitado(idDeliveryLead);
        if (!deliveryLeadAplicaciones) {
            throw new Error("No se encontraron aplicaciones para este delivery lead");
        }

        const aplicaciones = [];

        for (const aplicacion of deliveryLeadAplicaciones) {
            const proyecto = await ProyectoModel.findById(aplicacion.id_proyecto);
            if (!proyecto) {
                throw new Error("No se encontró el proyecto para esta aplicación");
            }
            const usuarioSolicitante = await UserModel.findById(aplicacion.id_solicitante);
            if (!usuarioSolicitante) {
                throw new Error("No se encontró el usuario solicitante para esta aplicación");
            }
            const rol = await RolModel.findById(aplicacion.id_rol);
            if (!rol) {
                throw new Error("No se encontró el rol para esta aplicación");
            }

            aplicaciones.push({
                ...aplicacion,
                proyecto,
                usuarioSolicitante,
                rol
            });
        }

        return aplicaciones;
    }

    // encontrar aplicaciones de un proyecto
    static async projectApplications(idProyecto: number) {
        const proyectoAplicaciones = await SolicitudModel.findByProyecto(idProyecto);
        if (!proyectoAplicaciones) {
            throw new Error("No se encontraron aplicaciones para este proyecto");
        }

        const aplicaciones = [];

        for (const aplicacion of proyectoAplicaciones) {
            const usuarioSolicitante = await UserModel.findById(aplicacion.id_solicitante);
            if (!usuarioSolicitante) {
                throw new Error("No se encontró el usuario solicitante para esta aplicación");
            }
            const deliveryLead = await UserModel.findById(aplicacion.id_solicitado);
            if (!deliveryLead) {
                throw new Error("No se encontró el delivery lead para esta aplicación");
            }
            const rol = await RolModel.findById(aplicacion.id_rol);
            if (!rol) {
                throw new Error("No se encontró el rol para esta aplicación");
            }
            aplicaciones.push({
                ...aplicacion,
                usuarioSolicitante,
                deliveryLead,
                rol
            });
        }

        return aplicaciones;
    }


}