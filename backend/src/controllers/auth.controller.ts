import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import { AppError } from '../utils/AppError';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales']).optional(),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = registerSchema.parse(req.body);
    
    const userExists = await User.findOne({ email: parsedData.email });
    if (userExists) {
      return next(new AppError('User already exists', 400));
    }

    const user = await User.create(parsedData);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id as unknown as string),
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: parsedData.email }).select('+password');

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(parsedData.password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id as unknown as string),
      },
    });
  } catch (error) {
    next(error);
  }
};
