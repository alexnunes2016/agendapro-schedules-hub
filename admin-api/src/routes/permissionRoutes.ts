import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listPermissions } from '../controllers/permissionController';

const router = Router();

router.get('/', authMiddleware, listPermissions);

export default router; 