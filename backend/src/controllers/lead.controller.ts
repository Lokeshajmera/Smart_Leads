import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead.model';
import { AppError } from '../utils/AppError';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';
import { parse } from 'json2csv';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsedData = leadSchema.parse(req.body);
    
    const lead = await Lead.create({
      ...parsedData,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    const query: any = {};

    // Filters
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.source) {
      query.source = req.query.source;
    }

    // Search by Name or Email using regex for partial match
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search as string, $options: 'i' } },
        { email: { $regex: req.query.search as string, $options: 'i' } },
      ];
    }

    // Sorting
    const sortBy = req.query.sortBy === 'Oldest' ? 1 : -1;

    const leads = await Lead.find(query)
      .sort({ createdAt: sortBy })
      .skip(startIndex)
      .limit(limit)
      .populate('createdBy', 'name email');

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

export const getLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      return next(new AppError(`Lead not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const updateLeadSchema = z.object({
  name: z.string().min(2, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
});

export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(new AppError(`Lead not found with id of ${req.params.id}`, 404));
    }

    const parsedData = updateLeadSchema.parse(req.body);

    lead = await Lead.findByIdAndUpdate(req.params.id, parsedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(new AppError(`Lead not found with id of ${req.params.id}`, 404));
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const query: any = {};

    if (req.query.status) query.status = req.query.status;
    if (req.query.source) query.source = req.query.source;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search as string, $options: 'i' } },
        { email: { $regex: req.query.search as string, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).lean();
    
    if (leads.length === 0) {
      return res.status(404).json({ success: false, error: 'No leads found to export' });
    }

    const fields = ['_id', 'name', 'email', 'status', 'source', 'createdAt'];
    const opts = { fields };
    
    const csv = parse(leads, opts);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
