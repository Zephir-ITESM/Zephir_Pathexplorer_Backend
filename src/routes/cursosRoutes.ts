import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getTop10Cursos } from '../controllers/cursosController';
import { get } from 'http';

const router = Router();

router.get('/top-10-cursos', getTop10Cursos);
