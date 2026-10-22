import { Router, Request, Response } from 'express';
import { QuestionService } from '../services/questionService.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { questionSetId, categoryId, status } = req.query;
    const questions = await QuestionService.getAll({
      questionSetId: questionSetId ? String(questionSetId) : undefined,
      categoryId: categoryId ? String(categoryId) : undefined,
      status: status ? String(status) : undefined,
    });
    res.json({ success: true, data: questions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const question = await QuestionService.getById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Soal tidak ditemukan.' });
    }
    res.json({ success: true, data: question });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { category_id, question_set_id, question_text, explanation, difficulty, status, image_url, options } = req.body;
    if (!category_id || !question_set_id || !question_text || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Kategori, paket soal, pertanyaan, dan minimal 2 opsi jawaban wajib diisi.',
      });
    }

    const hasCorrect = options.some((o: any) => !!o.is_correct);
    if (!hasCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Setidaknya satu opsi harus ditandai sebagai kunci jawaban benar.',
      });
    }

    const created = await QuestionService.create({
      category_id,
      question_set_id,
      question_text: question_text.trim(),
      explanation,
      difficulty,
      image_url,
      status: status || 'draft',
      options,
    });

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await QuestionService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Soal tidak ditemukan.' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await QuestionService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Soal tidak ditemukan.' });
    }
    res.json({ success: true, message: 'Soal berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
