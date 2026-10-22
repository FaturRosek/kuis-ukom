import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CategoryService } from '../services/categoryService.js';
import { QuestionSetService } from '../services/questionSetService.js';
import { SoloGameService } from '../services/soloGameService.js';
import db from '../config/db.js';

describe('Solo Game Lifecycle Integration Test', () => {
  let testCategoryId: string;
  let testQuestionSetId: string;
  let activeSessionId: string;
  let firstQuestionId: string;
  let correctOptId: string;

  beforeAll(async () => {
    
    const categories = await CategoryService.getAll();
    expect(categories.length).toBeGreaterThan(0);
    testCategoryId = categories[0].id;

    
    const sets = await QuestionSetService.getAll('published');
    const validSet = sets.find((s) => (s.question_count || 0) > 0);
    expect(validSet).toBeDefined();
    testQuestionSetId = validSet!.id;
  });

  afterAll(async () => {
    
    if (activeSessionId) {
      await db('game_sessions').where({ id: activeSessionId }).del();
    }
  });

  it('starts a solo session, creates snapshot, and hides correct answer from client view', async () => {
    const { session, firstQuestion } = await SoloGameService.startSession(
      testQuestionSetId,
      30,
      null,
      'Tester'
    );

    expect(session.id).toBeDefined();
    expect(session.mode).toBe('solo');
    expect(session.total_questions).toBeGreaterThan(0);
    expect(firstQuestion).toBeDefined();
    expect(firstQuestion!.options.length).toBeGreaterThanOrEqual(2);

    
    for (const opt of firstQuestion!.options) {
      expect((opt as any).is_correct).toBeUndefined();
    }

    activeSessionId = session.id;
    firstQuestionId = firstQuestion!.id;
  });

  it('submits a correct answer and returns immediate feedback with explanation', async () => {
    
    const sessionQ = await db('game_session_questions')
      .where({ session_id: activeSessionId, question_id: firstQuestionId })
      .first();

    const opts =
      typeof sessionQ.options_snapshot === 'string'
        ? JSON.parse(sessionQ.options_snapshot)
        : sessionQ.options_snapshot;

    const correctOpt = opts.find((o: any) => o.is_correct);
    expect(correctOpt).toBeDefined();
    correctOptId = correctOpt.id;

    const feedback = await SoloGameService.submitAnswer(
      activeSessionId,
      firstQuestionId,
      correctOpt.id,
      false,
      5.2,
      null,
      'Tester'
    );

    expect(feedback.isCorrect).toBe(true);
    expect(feedback.isTimeout).toBe(false);
    expect(feedback.correctOptionId).toBe(correctOpt.id);
    expect(feedback.correctOptionLabel).toBe(correctOpt.option_label);
    expect(feedback.explanation).toBeDefined();
  });

  it('prevents double-submit on the same question in the same session', async () => {
    const duplicateFeedback = await SoloGameService.submitAnswer(
      activeSessionId,
      firstQuestionId,
      correctOptId,
      false,
      8.0,
      null,
      'Tester'
    );

    
    expect(duplicateFeedback.isCorrect).toBe(true);
    expect(duplicateFeedback.timeTakenSeconds).toBe(5.2);
  });

  it('finishes session, calculates academic score, and records player session results', async () => {
    const summary = await SoloGameService.finishSession(activeSessionId, null, 'Tester');

    expect(summary.sessionId).toBe(activeSessionId);
    expect(summary.totalQuestions).toBeGreaterThan(0);
    expect(summary.correctCount).toBe(1);
    expect(summary.scorePercentage).toBeGreaterThan(0);
  });

  it('retrieves full review with answers, correct keys, and explanations', async () => {
    const review = await SoloGameService.getSessionReview(activeSessionId);
    expect(review.length).toBeGreaterThan(0);

    const firstReview = review[0];
    expect(firstReview.questionId).toBe(firstQuestionId);
    expect(firstReview.userAnswer?.isCorrect).toBe(true);
    expect(firstReview.correctOption.id).toBeDefined();
    expect(firstReview.explanation).toBeDefined();
  });
});
