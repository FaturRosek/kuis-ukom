import { Router, Request, Response } from 'express';
import { MultiplayerRoomService } from '../services/multiplayerRoomService.js';

const router = Router();

router.post('/room', async (req: Request, res: Response) => {
  try {
    const { hostName, questionSetId, durationPerQuestion, hostId } = req.body;
    if (!hostName || !questionSetId) {
      return res.status(400).json({ success: false, message: 'Nama host dan paket soal wajib diisi.' });
    }

    const room = await MultiplayerRoomService.createRoom(
      hostName.trim(),
      questionSetId,
      Number(durationPerQuestion) || 30,
      hostId || null
    );

    res.status(201).json({ success: true, data: room });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/room/:code', async (req: Request, res: Response) => {
  try {
    const room = await MultiplayerRoomService.getRoomByCode(req.params.code);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room tidak ditemukan.' });
    }
    res.json({ success: true, data: room });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/join', async (req: Request, res: Response) => {
  try {
    const { roomCode, playerName, userId } = req.body;
    if (!roomCode || !playerName) {
      return res.status(400).json({ success: false, message: 'Kode room dan nama pemain wajib diisi.' });
    }

    const result = await MultiplayerRoomService.joinRoom(
      roomCode.trim(),
      playerName.trim(),
      userId || null
    );

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/ready', async (req: Request, res: Response) => {
  try {
    const { roomId, playerName, isReady } = req.body;
    const updated = await MultiplayerRoomService.setReady(roomId, playerName, !!isReady);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
