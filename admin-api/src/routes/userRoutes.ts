import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listUsers } from '../controllers/userController';

const router = Router();

// Rota protegida: listar usuários reais do banco
router.get('/', authMiddleware, listUsers);

export default router; 