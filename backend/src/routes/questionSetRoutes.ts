import { Router, Request, Response } from 'express';
import { QuestionSetService } from '../services/questionSetService.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, categoryId } = req.query;
    const sets = await QuestionSetService.getAll(
      status ? String(status) : undefined,
      categoryId ? String(categoryId) : undefined
    );
    res.json({ success: true, data: sets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const set = await QuestionSetService.getById(req.params.id);
    if (!set) {
      return res.status(404).json({ success: false, message: 'Paket soal tidak ditemukan.' });
    }
    res.json({ success: true, data: set });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { category_id, title, description, status } = req.body;
    if (!category_id || !title) {
      return res.status(400).json({
        success: false,
        message: 'Kategori dan judul paket soal wajib diisi.',
      });
    }

    const created = await QuestionSetService.create({
      category_id,
      title: title.trim(),
      description,
      status: status || 'draft',
    });

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await QuestionSetService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Paket soal tidak ditemukan.' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await QuestionSetService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Paket soal tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Paket soal berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
