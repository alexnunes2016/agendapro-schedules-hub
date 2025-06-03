import { Request, Response } from 'express';
import { getAllRoles } from '../services/roleService';

export const listRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.json(roles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}; 