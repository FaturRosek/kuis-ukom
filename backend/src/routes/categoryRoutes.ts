import { Router, Request, Response } from 'express';
import { CategoryService } from '../services/categoryService.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAll();
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });
    }
    const created = await CategoryService.create(name.trim(), description);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
