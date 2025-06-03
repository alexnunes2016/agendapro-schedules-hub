import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listOrganizations } from '../controllers/orgController';

const router = Router();

router.get('/', authMiddleware, listOrganizations);

export default router; 