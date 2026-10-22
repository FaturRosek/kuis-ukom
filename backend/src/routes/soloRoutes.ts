import { Router, Request, Response } from 'express';
import { SoloGameService } from '../services/soloGameService.js';

const router = Router();

router.post('/start', async (req: Request, res: Response) => {
  try {
    const { questionSetId, durationPerQuestion, userId, playerName } = req.body;

    if (!questionSetId) {
      return res.status(400).json({ success: false, message: 'Paket soal wajib dipilih.' });
    }

    const duration = Number(durationPerQuestion) || 30;
    const result = await SoloGameService.startSession(
      questionSetId,
      duration,
      userId || null,
      playerName || 'Pengguna'
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/:sessionId/question/:order', async (req: Request, res: Response) => {
  try {
    const { sessionId, order } = req.params;
    const orderNum = parseInt(order, 10);

    const question = await SoloGameService.getQuestionByOrder(sessionId, orderNum);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Soal tidak ditemukan.' });
    }

    res.json({ success: true, data: question });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:sessionId/answer', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { questionId, selectedOptionId, isTimeout, timeTakenSeconds, userId, playerName } = req.body;

    if (!questionId) {
      return res.status(400).json({ success: false, message: 'ID soal wajib disertakan.' });
    }

    const feedback = await SoloGameService.submitAnswer(
      sessionId,
      questionId,
      selectedOptionId || null,
      !!isTimeout,
      parseFloat(timeTakenSeconds) || 0,
      userId || null,
      playerName || 'Pengguna'
    );

    res.json({ success: true, data: feedback });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:sessionId/finish', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { userId, playerName } = req.body;

    const summary = await SoloGameService.finishSession(sessionId, userId, playerName);
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:sessionId/review', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const review = await SoloGameService.getSessionReview(sessionId);
    res.json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/history', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const history = await SoloGameService.getHistory(userId ? String(userId) : undefined);
    res.json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
