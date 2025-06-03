import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminStatistics } from '../controllers/reportController';

const router = Router();

router.get('/statistics', authMiddleware, adminStatistics);

export default router; 