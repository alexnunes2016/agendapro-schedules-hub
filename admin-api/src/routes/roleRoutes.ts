import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listRoles } from '../controllers/roleController';

const router = Router();

router.get('/', authMiddleware, listRoles);

export default router; 