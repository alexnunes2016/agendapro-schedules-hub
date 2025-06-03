import { Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabaseService';

export function permissionMiddleware(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // O id do usuário deve estar no JWT (req.user.sub)
      // @ts-ignore
      const userId = req.user?.sub;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      // Busca as permissões do usuário
      const { data, error } = await supabase.rpc('get_user_permissions', { user_id: userId });
      if (error) throw error;
      const permissions = data?.permissions || [];
      if (!permissions.includes(permission)) {
        return res.status(403).json({ error: 'Permissão negada' });
      }
      next();
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };
} 