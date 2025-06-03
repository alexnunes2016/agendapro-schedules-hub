import { Request, Response } from 'express';
import { getAdminStatistics } from '../services/reportService';

export const adminStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await getAdminStatistics();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}; 