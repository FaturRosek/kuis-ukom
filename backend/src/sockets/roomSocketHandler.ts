import { Server, Socket } from 'socket.io';
import { MultiplayerRoomService } from '../services/multiplayerRoomService.js';
import db from '../config/db.js';

interface ActiveRoomGameState {
  roomId: string;
  roomCode: string;
  sessionId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: any[];
  durationSeconds: number;
  deadlineTimestamp: number;
  timerHandle?: NodeJS.Timeout;
  submittedPlayers: Set<string>;
}

const activeGames = new Map<string, ActiveRoomGameState>();

export function setupRoomSocketHandler(io: Server) {
  io.on('connection', (socket: Socket) => {
    let currentRoomCode: string | null = null;
    let currentPlayerName: string | null = null;

    
    socket.on('join_room', async ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
      try {
        currentRoomCode = roomCode.toUpperCase();
        currentPlayerName = playerName;

        const room = await MultiplayerRoomService.getRoomByCode(currentRoomCode);
        if (!room) {
          socket.emit('error_message', 'Room tidak ditemukan.');
          return;
        }

        socket.join(`room:${currentRoomCode}`);
        await MultiplayerRoomService.updateSocket(room.id, playerName, socket.id, true);

        const updatedRoom = await MultiplayerRoomService.getRoomByCode(currentRoomCode);
        io.to(`room:${currentRoomCode}`).emit('room_updated', updatedRoom);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('toggle_ready', async ({ roomCode, playerName, isReady }: { roomCode: string; playerName: string; isReady: boolean }) => {
      try {
        const room = await MultiplayerRoomService.getRoomByCode(roomCode.toUpperCase());
        if (!room) return;

        await MultiplayerRoomService.setReady(room.id, playerName, isReady);
        const updatedRoom = await MultiplayerRoomService.getRoomByCode(roomCode.toUpperCase());
        io.to(`room:${roomCode.toUpperCase()}`).emit('room_updated', updatedRoom);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('start_game', async ({ roomCode }: { roomCode: string }) => {
      const code = roomCode.toUpperCase();
      try {
        const room = await MultiplayerRoomService.getRoomByCode(code);
        if (!room) return;

        const { session, questions } = await MultiplayerRoomService.startGame(room.id);

        const gameState: ActiveRoomGameState = {
          roomId: room.id,
          roomCode: code,
          sessionId: session.id,
          currentQuestionIndex: 0,
          totalQuestions: questions.length,
          questions,
          durationSeconds: room.duration_per_question,
          deadlineTimestamp: 0,
          submittedPlayers: new Set(),
        };

        activeGames.set(code, gameState);

        io.to(`room:${code}`).emit('game_starting', {
          countdownSeconds: 3,
          totalQuestions: questions.length,
        });

        setTimeout(() => {
          sendNextQuestion(io, code);
        }, 3000);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on(
      'submit_answer',
      async ({
        roomCode,
        playerName,
        questionId,
        selectedOptionId,
        isTimeout,
        timeTaken,
      }: {
        roomCode: string;
        playerName: string;
        questionId: string;
        selectedOptionId: string | null;
        isTimeout: boolean;
        timeTaken: number;
      }) => {
        const code = roomCode.toUpperCase();
        const game = activeGames.get(code);
        if (!game) return;

        try {
          const result = await MultiplayerRoomService.recordPlayerAnswer(
            game.sessionId,
            game.roomId,
            playerName,
            questionId,
            selectedOptionId,
            isTimeout,
            timeTaken
          );

          socket.emit('answer_feedback', {
            questionId,
            isCorrect: result.isCorrect,
            correctOptionId: result.correctOptionId,
            correctOptionLabel: result.correctOptionLabel,
            explanation: result.explanation,
          });

          game.submittedPlayers.add(playerName);

          const room = await MultiplayerRoomService.getRoomByCode(code);
          const activeParticipants = (room?.participants || []).filter((p) => p.connected);

          if (game.submittedPlayers.size >= activeParticipants.length) {
            if (game.timerHandle) {
              clearTimeout(game.timerHandle);
            }
            concludeRound(io, code);
          }
        } catch (err: any) {
          socket.emit('error_message', err.message);
        }
      }
    );

    socket.on('disconnect', async () => {
      if (currentRoomCode && currentPlayerName) {
        try {
          const room = await MultiplayerRoomService.getRoomByCode(currentRoomCode);
          if (room) {
            await MultiplayerRoomService.updateSocket(room.id, currentPlayerName, socket.id, false);
            const updatedRoom = await MultiplayerRoomService.getRoomByCode(currentRoomCode);
            io.to(`room:${currentRoomCode}`).emit('room_updated', updatedRoom);
          }
        } catch {
        }
      }
    });
  });
}


async function sendNextQuestion(io: Server, roomCode: string) {
  const game = activeGames.get(roomCode);
  if (!game) return;

  if (game.currentQuestionIndex >= game.totalQuestions) {
    finishMultiplayerGame(io, roomCode);
    return;
  }

  const currentQ = game.questions[game.currentQuestionIndex];
  const questionOrder = game.currentQuestionIndex + 1;
  game.submittedPlayers.clear();

  const options = await db('question_options')
    .where({ question_id: currentQ.id })
    .select('id', 'option_label', 'option_text')
    .orderBy('sort_order', 'asc');

  const deadline = Date.now() + game.durationSeconds * 1000;
  game.deadlineTimestamp = deadline;

  io.to(`room:${roomCode}`).emit('new_question', {
    questionId: currentQ.id,
    questionOrder,
    totalQuestions: game.totalQuestions,
    questionText: currentQ.question_text,
    options: options.map((o) => ({
      id: o.id,
      label: o.option_label,
      text: o.option_text,
    })),
    durationSeconds: game.durationSeconds,
    deadlineTimestamp: deadline,
  });

  game.timerHandle = setTimeout(() => {
    concludeRound(io, roomCode);
  }, game.durationSeconds * 1000);
}


async function concludeRound(io: Server, roomCode: string) {
  const game = activeGames.get(roomCode);
  if (!game) return;

  const currentQ = game.questions[game.currentQuestionIndex];

  const correctOpt = await db('question_options')
    .where({ question_id: currentQ.id, is_correct: true })
    .first();

  const leaderboard = await MultiplayerRoomService.getLeaderboard(game.roomId, game.sessionId);

  io.to(`room:${roomCode}`).emit('round_ended', {
    questionId: currentQ.id,
    correctOptionId: correctOpt ? correctOpt.id : '',
    correctOptionLabel: correctOpt ? correctOpt.option_label : '',
    explanation: currentQ.explanation,
    leaderboard,
  });

  game.currentQuestionIndex++;

  setTimeout(() => {
    sendNextQuestion(io, roomCode);
  }, 5000);
}


async function finishMultiplayerGame(io: Server, roomCode: string) {
  const game = activeGames.get(roomCode);
  if (!game) return;

  const finalLeaderboard = await MultiplayerRoomService.endGame(game.roomId, game.sessionId);

  io.to(`room:${roomCode}`).emit('game_over', {
    leaderboard: finalLeaderboard,
  });

  activeGames.delete(roomCode);
}
