// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import User from '../models/User';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Please authenticate' });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ error: 'Please authenticate' });
      return;
    }

    // Attach user to request
    req.user = user;
    
    // Proceed to next middleware
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export default authMiddleware;