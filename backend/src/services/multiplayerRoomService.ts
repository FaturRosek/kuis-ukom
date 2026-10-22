import db from '../config/db.js';
import { MultiplayerRoom, RoomParticipant } from '../types/index.js';

export class MultiplayerRoomService {
  
  private static generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  
  static async createRoom(
    hostName: string,
    questionSetId: string,
    durationPerQuestion: number = 30,
    hostId?: string | null
  ): Promise<MultiplayerRoom> {
    const questionSet = await db('question_sets').where({ id: questionSetId }).first();
    if (!questionSet) {
      throw new Error('Paket soal tidak ditemukan.');
    }

    const questionCount = await db('questions')
      .where({ question_set_id: questionSetId, status: 'published' })
      .count('id as count')
      .first();

    if (!questionCount || parseInt(questionCount.count as string, 10) === 0) {
      throw new Error('Paket soal belum memiliki soal yang dipublikasikan.');
    }

    let code = this.generateRoomCode();
    
    let exists = await db('multiplayer_rooms').where({ room_code: code }).first();
    while (exists) {
      code = this.generateRoomCode();
      exists = await db('multiplayer_rooms').where({ room_code: code }).first();
    }

    return db.transaction(async (trx) => {
      const [room] = await trx('multiplayer_rooms')
        .insert({
          room_code: code,
          host_id: hostId || null,
          host_name: hostName,
          question_set_id: questionSetId,
          duration_per_question: durationPerQuestion,
          status: 'lobby',
        })
        .returning('*');

      const [hostParticipant] = await trx('room_participants')
        .insert({
          room_id: room.id,
          user_id: hostId || null,
          player_name: hostName,
          is_host: true,
          is_ready: true,
          score: 0,
          connected: true,
        })
        .returning('*');

      return {
        ...room,
        question_set_title: questionSet.title,
        participants: [hostParticipant],
      };
    });
  }

  
  static async getRoomByCode(code: string): Promise<MultiplayerRoom | null> {
    const room = await db('multiplayer_rooms as mr')
      .join('question_sets as qs', 'mr.question_set_id', 'qs.id')
      .select('mr.*', 'qs.title as question_set_title')
      .where({ room_code: code.toUpperCase() })
      .first();

    if (!room) return null;

    const participants = await db('room_participants')
      .where({ room_id: room.id })
      .orderBy('joined_at', 'asc');

    return {
      ...room,
      participants,
    };
  }

  
  static async joinRoom(
    roomCode: string,
    playerName: string,
    userId?: string | null
  ): Promise<{ room: MultiplayerRoom; participant: RoomParticipant }> {
    const room = await this.getRoomByCode(roomCode);
    if (!room) {
      throw new Error('Room dengan kode tersebut tidak ditemukan.');
    }

    if (room.status !== 'lobby') {
      throw new Error('Sesi permainan di room ini sudah berlangsung atau selesai.');
    }

    
    const existing = await db('room_participants')
      .where({ room_id: room.id, player_name: playerName })
      .first();

    let participant: RoomParticipant;
    if (existing) {
      participant = existing;
      await db('room_participants').where({ id: existing.id }).update({ connected: true });
    } else {
      const [created] = await db('room_participants')
        .insert({
          room_id: room.id,
          user_id: userId || null,
          player_name: playerName,
          is_host: false,
          is_ready: false,
          score: 0,
          connected: true,
        })
        .returning('*');
      participant = created;
    }

    const updatedRoom = (await this.getRoomByCode(roomCode))!;
    return { room: updatedRoom, participant };
  }

  
  static async setReady(roomId: string, playerName: string, isReady: boolean): Promise<RoomParticipant | null> {
    const [updated] = await db('room_participants')
      .where({ room_id: roomId, player_name: playerName })
      .update({ is_ready: isReady })
      .returning('*');
    return updated || null;
  }

  
  static async updateSocket(
    roomId: string,
    playerName: string,
    socketId: string,
    connected: boolean
  ): Promise<void> {
    await db('room_participants')
      .where({ room_id: roomId, player_name: playerName })
      .update({ socket_id: socketId, connected });
  }

  
  static async startGame(roomId: string): Promise<{ session: any; questions: any[] }> {
    const room = await db('multiplayer_rooms').where({ id: roomId }).first();
    if (!room) throw new Error('Room tidak ditemukan.');

    const questions = await db('questions')
      .where({ question_set_id: room.question_set_id, status: 'published' })
      .orderBy('created_at', 'asc');

    if (questions.length === 0) {
      throw new Error('Tidak ada soal yang dipublikasikan.');
    }

    const questionIds = questions.map((q) => q.id);
    const options = await db('question_options')
      .whereIn('question_id', questionIds)
      .orderBy('sort_order', 'asc');

    const optionsByQ = options.reduce((acc, opt) => {
      if (!acc[opt.question_id]) acc[opt.question_id] = [];
      acc[opt.question_id].push(opt);
      return acc;
    }, {} as Record<string, any[]>);

    return db.transaction(async (trx) => {
      
      await trx('multiplayer_rooms').where({ id: roomId }).update({ status: 'playing' });

      
      const [session] = await trx('game_sessions')
        .insert({
          room_id: roomId,
          question_set_id: room.question_set_id,
          mode: 'multiplayer',
          duration_per_question: room.duration_per_question,
          total_questions: questions.length,
          status: 'active',
        })
        .returning('*');

      
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const qOpts = optionsByQ[q.id] || [];
        await trx('game_session_questions').insert({
          session_id: session.id,
          question_id: q.id,
          question_order: i + 1,
          question_snapshot: JSON.stringify({
            id: q.id,
            question_text: q.question_text,
            explanation: q.explanation,
          }),
          options_snapshot: JSON.stringify(qOpts),
        });
      }

      return { session, questions };
    });
  }

  
  static async recordPlayerAnswer(
    sessionId: string,
    roomId: string,
    playerName: string,
    questionId: string,
    selectedOptionId: string | null,
    isTimeout: boolean,
    timeTakenSeconds: number
  ): Promise<{ isCorrect: boolean; correctOptionId: string; correctOptionLabel: string; explanation: string | null }> {
    const sessionQuestion = await db('game_session_questions')
      .where({ session_id: sessionId, question_id: questionId })
      .first();

    if (!sessionQuestion) throw new Error('Soal sesi tidak ditemukan.');

    const qSnapshot =
      typeof sessionQuestion.question_snapshot === 'string'
        ? JSON.parse(sessionQuestion.question_snapshot)
        : sessionQuestion.question_snapshot;
    const optsSnapshot =
      typeof sessionQuestion.options_snapshot === 'string'
        ? JSON.parse(sessionQuestion.options_snapshot)
        : sessionQuestion.options_snapshot;

    const correctOption = optsSnapshot.find((o: any) => o.is_correct);
    const correctOptionId = correctOption ? correctOption.id : '';
    const correctOptionLabel = correctOption ? correctOption.option_label : '';

    const isCorrect = !isTimeout && selectedOptionId === correctOptionId;

    
    const existing = await db('game_answers')
      .where({
        session_id: sessionId,
        player_name: playerName,
        question_id: questionId,
      })
      .first();

    if (!existing) {
      await db('game_answers').insert({
        session_id: sessionId,
        player_name: playerName,
        question_id: questionId,
        selected_option_id: selectedOptionId || null,
        is_correct: isCorrect,
        is_timeout: !!isTimeout,
        time_taken_seconds: timeTakenSeconds || 0,
      });

      if (isCorrect) {
        await db('room_participants')
          .where({ room_id: roomId, player_name: playerName })
          .increment('score', 10);
      }
    }

    return {
      isCorrect,
      correctOptionId,
      correctOptionLabel,
      explanation: qSnapshot.explanation || null,
    };
  }

  
  static async getLeaderboard(roomId: string, sessionId: string): Promise<any[]> {
    const participants = await db('room_participants').where({ room_id: roomId });
    const answers = await db('game_answers').where({ session_id: sessionId });

    const statsByPlayer: Record<
      string,
      { correct: number; totalTime: number; totalAnswered: number }
    > = {};

    for (const p of participants) {
      statsByPlayer[p.player_name] = { correct: 0, totalTime: 0, totalAnswered: 0 };
    }

    for (const a of answers) {
      const name = a.player_name || '';
      if (!statsByPlayer[name]) {
        statsByPlayer[name] = { correct: 0, totalTime: 0, totalAnswered: 0 };
      }
      if (a.is_correct) statsByPlayer[name].correct += 1;
      statsByPlayer[name].totalTime += parseFloat(a.time_taken_seconds) || 0;
      statsByPlayer[name].totalAnswered += 1;
    }

    const leaderboard = participants.map((p) => {
      const stats = statsByPlayer[p.player_name] || { correct: 0, totalTime: 0, totalAnswered: 0 };
      return {
        id: p.id,
        playerName: p.player_name,
        isHost: p.is_host,
        correctCount: stats.correct,
        totalAnswered: stats.totalAnswered,
        totalTimeSeconds: Math.round(stats.totalTime * 100) / 100,
        score: stats.correct * 100,
      };
    });

    
    leaderboard.sort((a, b) => {
      if (b.correctCount !== a.correctCount) {
        return b.correctCount - a.correctCount;
      }
      return a.totalTimeSeconds - b.totalTimeSeconds;
    });

    return leaderboard;
  }

  
  static async endGame(roomId: string, sessionId: string): Promise<any[]> {
    await db('multiplayer_rooms').where({ id: roomId }).update({ status: 'ended' });
    await db('game_sessions')
      .where({ id: sessionId })
      .update({ status: 'completed', ended_at: db.fn.now() });

    const session = await db('game_sessions').where({ id: sessionId }).first();
    const leaderboard = await this.getLeaderboard(roomId, sessionId);

    
    for (const item of leaderboard) {
      const accuracy =
        session.total_questions > 0
          ? (item.correctCount / session.total_questions) * 100
          : 0;

      await db('player_session_results')
        .insert({
          session_id: sessionId,
          player_name: item.playerName,
          total_questions: session.total_questions,
          correct_count: item.correctCount,
          incorrect_count: session.total_questions - item.correctCount,
          timeout_count: session.total_questions - item.totalAnswered,
          score_percentage: Math.round(accuracy * 10) / 10,
          total_time_seconds: item.totalTimeSeconds,
        })
        .onConflict(['session_id', 'player_name'] as any)
        .ignore();
    }

    return leaderboard;
  }
}
