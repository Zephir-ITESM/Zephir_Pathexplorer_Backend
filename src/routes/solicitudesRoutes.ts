import { Router } from 'express';
import { inviteUser, getInvitationsByDeliveryLead, getInvitationsByInvitado, getInvitationsByProyecto, acceptApplication, acceptInvitation, rejectApplication, rejectInvitation, applyToProject} from '../controllers/solicitudController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// there are no public routes in this file, all routes are protected
// Protected routes
router.post('/user/invitations', authenticateToken, getInvitationsByInvitado);
router.post('/delivey-lead/invitations/', authenticateToken, getInvitationsByDeliveryLead);
router.post('/proyecto/invitations', authenticateToken, getInvitationsByProyecto);
router.post('/user/invitations/accept', authenticateToken, acceptInvitation);
router.post('/user/invitations/reject', authenticateToken, rejectInvitation);
router.post('/delivery-lead/application/accept', authenticateToken, acceptApplication);
router.post('/delivery-lead/application/reject', authenticateToken, rejectApplication);
router.post('/user/apply', authenticateToken, applyToProject);




export default router;