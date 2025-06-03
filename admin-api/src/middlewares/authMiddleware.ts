import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware para autenticação via JWT (Supabase)
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    // O segredo deve ser o JWT_SECRET do Supabase (coloque no .env)
    const secret = process.env.SUPABASE_JWT_SECRET as string;
    if (!secret) {
      return res.status(500).json({ error: 'Configuração do servidor ausente (SUPABASE_JWT_SECRET)' });
    }
    const payload = jwt.verify(token, secret);
    // @ts-ignore
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}; 