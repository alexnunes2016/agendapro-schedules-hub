import { Request, Response } from 'express';
import { getAllOrganizations } from '../services/orgService';

export const listOrganizations = async (req: Request, res: Response) => {
  try {
    const orgs = await getAllOrganizations();
    res.json(orgs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}; 