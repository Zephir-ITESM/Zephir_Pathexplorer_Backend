import { Router } from 'express';
import { addUserCourse, addCertification, getUserCertifications, getUserCourses, addCourse, getCertificationDetails, getCourseDetails} from '../controllers/cursos_certificacionesController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// there are no public routes in this file, all routes are protected
// Protected routes
router.get('/user/mis-cursos', authenticateToken, getUserCourses);
router.get('/user/mis-certificaciones', authenticateToken, getUserCertifications);
router.get('/user/certificacion', authenticateToken, getCertificationDetails);
router.get('/course/details', authenticateToken, getCourseDetails); // ver detalle curso, como no va necesariamente asociado a un usuario, no se tiene users en la url
router.post('/user/addUsuarioCurso', authenticateToken, addUserCourse);
router.post('/user/addCertificacion', authenticateToken, addCertification);
router.post('/addCourse', authenticateToken, addCourse);  // falta garantizar que se evalue que el usuario tiene permisos para agregar datos porq solo los delivery leads y admins pueden agregar cursos

export default router;
