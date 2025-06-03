import { Request, Response } from 'express';
import { getAllPermissions } from '../services/permissionService';

export const listPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await getAllPermissions();
    res.json(permissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}; 