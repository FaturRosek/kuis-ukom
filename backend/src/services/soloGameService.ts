import db from '../config/db.js';
import {
  SoloSession,
  SoloQuestionClientView,
  AnswerFeedback,
  SessionResultSummary,
  ReviewQuestionItem,
} from '../types/index.js';

export class SoloGameService {
  
  static async startSession(
    questionSetId: string,
    durationPerQuestion: number = 30,
    userId?: string | null,
    playerName: string = 'Pengguna'
  ): Promise<{ session: SoloSession; firstQuestion: SoloQuestionClientView | null }> {
    return db.transaction(async (trx) => {
      
      const questions = await trx('questions')
        .where({
          question_set_id: questionSetId,
          status: 'published',
        })
        .orderBy('created_at', 'asc');

      if (questions.length === 0) {
        throw new Error('Paket soal ini belum memiliki soal yang dipublikasikan.');
      }

      const questionIds = questions.map((q) => q.id);
      const options = await trx('question_options')
        .whereIn('question_id', questionIds)
        .orderBy('sort_order', 'asc');

      const optionsByQuestion = options.reduce((acc, opt) => {
        if (!acc[opt.question_id]) acc[opt.question_id] = [];
        acc[opt.question_id].push(opt);
        return acc;
      }, {} as Record<string, any[]>);

      
      const [session] = await trx('game_sessions')
        .insert({
          user_id: userId || null,
          question_set_id: questionSetId,
          mode: 'solo',
          duration_per_question: durationPerQuestion,
          total_questions: questions.length,
          status: 'active',
        })
        .returning('*');

      
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const qOptions = optionsByQuestion[q.id] || [];

        await trx('game_session_questions').insert({
          session_id: session.id,
          question_id: q.id,
          question_order: i + 1,
          question_snapshot: JSON.stringify({
            id: q.id,
            question_text: q.question_text,
            explanation: q.explanation,
            difficulty: q.difficulty,
            image_url: q.image_url || null,
          }),
          options_snapshot: JSON.stringify(qOptions),
        });
      }

      const firstQ = questions[0];
      const firstQOptions = optionsByQuestion[firstQ.id] || [];

      const firstQuestionClient: SoloQuestionClientView = {
        id: firstQ.id,
        order: 1,
        total: questions.length,
        question_text: firstQ.question_text,
        image_url: firstQ.image_url || null,
        duration_seconds: durationPerQuestion,
        options: firstQOptions.map((o: any) => ({
          id: o.id,
          label: o.option_label,
          text: o.option_text,
        })),
      };

      return {
        session,
        firstQuestion: firstQuestionClient,
      };
    });
  }

  
  static async getQuestionByOrder(
    sessionId: string,
    order: number
  ): Promise<SoloQuestionClientView | null> {
    const session = await db('game_sessions').where({ id: sessionId }).first();
    if (!session) return null;

    const row = await db('game_session_questions')
      .where({
        session_id: sessionId,
        question_order: order,
      })
      .first();

    if (!row) return null;

    const qSnapshot =
      typeof row.question_snapshot === 'string'
        ? JSON.parse(row.question_snapshot)
        : row.question_snapshot;
    const optsSnapshot =
      typeof row.options_snapshot === 'string'
        ? JSON.parse(row.options_snapshot)
        : row.options_snapshot;

    return {
      id: row.question_id,
      order: row.question_order,
      total: session.total_questions,
      question_text: qSnapshot.question_text,
      image_url: qSnapshot.image_url || null,
      duration_seconds: session.duration_per_question,
      options: optsSnapshot.map((o: any) => ({
        id: o.id,
        label: o.option_label,
        text: o.option_text,
      })),
    };
  }

  
  static async submitAnswer(
    sessionId: string,
    questionId: string,
    selectedOptionId: string | null,
    isTimeout: boolean,
    timeTakenSeconds: number,
    userId?: string | null,
    playerName: string = 'Pengguna'
  ): Promise<AnswerFeedback> {
    
    const existingAnswer = await db('game_answers')
      .where({
        session_id: sessionId,
        question_id: questionId,
      })
      .first();

    
    const sessionQuestion = await db('game_session_questions')
      .where({
        session_id: sessionId,
        question_id: questionId,
      })
      .first();

    if (!sessionQuestion) {
      throw new Error('Soal tidak ditemukan dalam sesi ini.');
    }

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

    if (existingAnswer) {
      
      return {
        questionId,
        isCorrect: existingAnswer.is_correct,
        isTimeout: existingAnswer.is_timeout,
        selectedOptionId: existingAnswer.selected_option_id,
        correctOptionId,
        correctOptionLabel,
        explanation: qSnapshot.explanation || null,
        timeTakenSeconds: parseFloat(existingAnswer.time_taken_seconds) || 0,
      };
    }

    
    let isCorrect = false;
    if (!isTimeout && selectedOptionId) {
      isCorrect = selectedOptionId === correctOptionId;
    }

    
    await db('game_answers').insert({
      session_id: sessionId,
      user_id: userId || null,
      player_name: playerName,
      question_id: questionId,
      selected_option_id: selectedOptionId || null,
      is_correct: isCorrect,
      is_timeout: !!isTimeout,
      time_taken_seconds: timeTakenSeconds || 0,
    });

    return {
      questionId,
      isCorrect,
      isTimeout,
      selectedOptionId,
      correctOptionId,
      correctOptionLabel,
      explanation: qSnapshot.explanation || null,
      timeTakenSeconds,
    };
  }

  
  static async finishSession(
    sessionId: string,
    userId?: string | null,
    playerName: string = 'Pengguna'
  ): Promise<SessionResultSummary> {
    const session = await db('game_sessions').where({ id: sessionId }).first();
    if (!session) {
      throw new Error('Sesi tidak ditemukan.');
    }

    const questionSet = await db('question_sets').where({ id: session.question_set_id }).first();
    const answers = await db('game_answers').where({ session_id: sessionId });

    const totalQuestions = session.total_questions;
    let correctCount = 0;
    let incorrectCount = 0;
    let timeoutCount = 0;
    let totalTimeSeconds = 0;

    for (const ans of answers) {
      if (ans.is_correct) {
        correctCount++;
      } else if (ans.is_timeout) {
        timeoutCount++;
      } else {
        incorrectCount++;
      }
      totalTimeSeconds += parseFloat(ans.time_taken_seconds) || 0;
    }

    
    const unattempted = totalQuestions - answers.length;
    if (unattempted > 0) {
      timeoutCount += unattempted;
    }

    const scorePercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    
    let result = await db('player_session_results').where({ session_id: sessionId }).first();
    if (!result) {
      const [newResult] = await db('player_session_results')
        .insert({
          session_id: sessionId,
          user_id: userId || null,
          player_name: playerName,
          total_questions: totalQuestions,
          correct_count: correctCount,
          incorrect_count: incorrectCount,
          timeout_count: timeoutCount,
          score_percentage: Math.round(scorePercentage * 100) / 100,
          total_time_seconds: Math.round(totalTimeSeconds * 100) / 100,
        })
        .returning('*');
      result = newResult;

      
      await db('game_sessions')
        .where({ id: sessionId })
        .update({
          status: 'completed',
          ended_at: db.fn.now(),
        });
    }

    return {
      sessionId,
      totalQuestions,
      correctCount,
      incorrectCount,
      timeoutCount,
      scorePercentage: Math.round(scorePercentage * 10) / 10,
      totalTimeSeconds: Math.round(totalTimeSeconds),
      title: questionSet ? questionSet.title : 'Paket Latihan',
      completedAt: new Date().toISOString(),
    };
  }

  
  static async getSessionReview(sessionId: string): Promise<ReviewQuestionItem[]> {
    const sessionQuestions = await db('game_session_questions')
      .where({ session_id: sessionId })
      .orderBy('question_order', 'asc');

    const answers = await db('game_answers').where({ session_id: sessionId });
    const answerMap = answers.reduce((acc, a) => {
      acc[a.question_id] = a;
      return acc;
    }, {} as Record<string, any>);

    return sessionQuestions.map((sq) => {
      const qSnapshot =
        typeof sq.question_snapshot === 'string'
          ? JSON.parse(sq.question_snapshot)
          : sq.question_snapshot;
      const optsSnapshot =
        typeof sq.options_snapshot === 'string'
          ? JSON.parse(sq.options_snapshot)
          : sq.options_snapshot;

      const userAns = answerMap[sq.question_id];
      const correctOpt = optsSnapshot.find((o: any) => o.is_correct) || optsSnapshot[0];

      return {
        questionId: sq.question_id,
        questionOrder: sq.question_order,
        questionText: qSnapshot.question_text,
        imageUrl: qSnapshot.image_url || null,
        options: optsSnapshot.map((o: any) => ({
          id: o.id,
          label: o.option_label,
          text: o.option_text,
          isCorrect: !!o.is_correct,
        })),
        userAnswer: userAns
          ? {
              selectedOptionId: userAns.selected_option_id,
              isCorrect: !!userAns.is_correct,
              isTimeout: !!userAns.is_timeout,
              timeTakenSeconds: parseFloat(userAns.time_taken_seconds) || 0,
            }
          : null,
        correctOption: {
          id: correctOpt.id,
          label: correctOpt.option_label,
          text: correctOpt.option_text,
        },
        explanation: qSnapshot.explanation || null,
      };
    });
  }

  
  static async getHistory(userId?: string): Promise<any[]> {
    let query = db('player_session_results as psr')
      .join('game_sessions as gs', 'psr.session_id', 'gs.id')
      .join('question_sets as qs', 'gs.question_set_id', 'qs.id')
      .join('categories as c', 'qs.category_id', 'c.id')
      .select(
        'psr.id',
        'psr.session_id',
        'psr.player_name',
        'psr.total_questions',
        'psr.correct_count',
        'psr.incorrect_count',
        'psr.timeout_count',
        'psr.score_percentage',
        'psr.total_time_seconds',
        'psr.created_at',
        'qs.title as question_set_title',
        'c.name as category_name',
        'gs.mode'
      )
      .orderBy('psr.created_at', 'desc')
      .limit(30);

    if (userId) {
      query = query.where('psr.user_id', userId);
    }

    return query;
  }
}
