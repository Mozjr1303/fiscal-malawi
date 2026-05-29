import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

import prisma from '../utils/db';

export const authenticateApiKey = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key is required in x-api-key header' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { apiKey } });
    if (!user) {
      return res.status(403).json({ error: 'Invalid API Key' });
    }
    req.user = { userId: user.id, role: user.role, email: user.email };
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error verifying API Key' });
  }
};
