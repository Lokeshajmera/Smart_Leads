import express from 'express';
import { getUsers, deleteUser, updateUserRole } from '../controllers/user.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.delete('/:id', deleteUser);
router.patch('/:id/role', updateUserRole);

export default router;
