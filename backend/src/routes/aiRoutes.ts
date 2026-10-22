import { Router, Request, Response } from 'express';
import { AISolverService, QuestionToSolve } from '../services/aiSolverService.js';

const router = Router();


router.get('/status', (req: Request, res: Response) => {
  const hasServerKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10);
  res.json({
    success: true,
    data: {
      hasServerKey,
      supportedModels: ['gemini-2.0-flash', 'gemini-1.5-flash'],
      heuristicEngineReady: true,
    },
  });
});


router.post('/solve-questions', async (req: Request, res: Response) => {
  try {
    const { questions, apiKey } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Daftar pertanyaan tidak boleh kosong.',
      });
    }

    
    const key = (req.headers['x-gemini-api-key'] as string) || apiKey;

    const formattedQuestions: QuestionToSolve[] = questions.map((q: any, idx: number) => ({
      index: q.index || idx + 1,
      id: q.id,
      question_text: q.question_text || q.questionText,
      options: (q.options || []).map((opt: any) => ({
        id: opt.id,
        option_label: opt.option_label || opt.optionLabel,
        option_text: opt.option_text || opt.optionText,
      })),
    }));

    const results = await AISolverService.solveBatch(formattedQuestions, key);

    res.json({
      success: true,
      message: `Berhasil menganalisis ${results.length} butir soal dengan AI.`,
      data: results,
    });
  } catch (err: any) {
    console.error('[AI Route] Error solving questions:', err);
    res.status(500).json({
      success: false,
      message: `Gagal menganalisis soal dengan AI: ${err.message}`,
    });
  }
});

/**
 * Solve and update an existing Question Set in DB
 */
router.post('/solve-set/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { apiKey } = req.body;
    const key = (req.headers['x-gemini-api-key'] as string) || apiKey;

    const result = await AISolverService.solveAndSaveQuestionSet(id, key);

    res.json({
      success: true,
      message: `Berhasil menganalisis dan memperbarui ${result.totalSolved} butir soal pada paket ini.`,
      data: result,
    });
  } catch (err: any) {
    console.error('[AI Route] Error solving question set:', err);
    res.status(500).json({
      success: false,
      message: `Gagal memperbarui paket soal dengan AI: ${err.message}`,
    });
  }
});

export default router;
