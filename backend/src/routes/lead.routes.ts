import express from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/lead.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protect); // All lead routes are protected

// Export route needs to be before /:id
router.get('/export', exportLeads);

router
  .route('/')
  .get(getLeads)
  .post(createLead);

router
  .route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(authorize('admin'), deleteLead); // Only admin can delete

export default router;
