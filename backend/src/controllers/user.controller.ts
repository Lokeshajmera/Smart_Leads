import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET /api/users — Admin only: list all users
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id — Admin only: delete a user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    await user.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/users/:id/role — Admin only: change user role
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    if (!['admin', 'sales'].includes(role)) {
      return next(new AppError('Invalid role', 400));
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
