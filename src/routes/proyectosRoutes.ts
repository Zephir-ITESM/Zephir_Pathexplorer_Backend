import { Router } from 'express';
import { addProject, addProjectToUser, getProjectAssignedUsers, getProjectsByDeliveryLead, getUserProjects, getProyectosSemana, getProyectosMes, getProyectosNoventaDias, getProyectosSemestre, getProyectosAnio } from '../controllers/proyectosController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// there are no public routes in this file, all routes are protected
// Protected routes
router.post('/user/proyectoUsuario', authenticateToken, addProjectToUser);
router.post('/user/proyecto', authenticateToken, addProject);
router.get('/user/mis-proyectos', authenticateToken, getUserProjects);
router.get('/user/proyectos/deliverylead', authenticateToken, getProjectsByDeliveryLead);
router.get('/user/proyectos/usuarios', authenticateToken, getProjectAssignedUsers);
router.get('/user/proyectos/semana', authenticateToken, getProyectosSemana);
router.get('/user/proyectos/mes', authenticateToken, getProyectosMes);
router.get('/user/proyectos/noventaDias', authenticateToken, getProyectosNoventaDias);
router.get('/user/proyectos/semestre', authenticateToken, getProyectosSemestre);
router.get('/user/proyectos/anio', authenticateToken, getProyectosAnio);

// falta implementar la parte de confirmar permisos para poder ejecutar el endpoint de agregar un proyecto a un usuario



export default router;
