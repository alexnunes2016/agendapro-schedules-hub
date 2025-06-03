import { Request, Response } from 'express';
import { getAllUsers } from '../services/userService';

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}; 