import db from '../config/db.js';
import { Question, QuestionOption } from '../types/index.js';

export class QuestionService {
  static async getAll(filters: {
    questionSetId?: string;
    categoryId?: string;
    status?: string;
  }): Promise<Question[]> {
    let query = db('questions as q')
      .join('categories as c', 'q.category_id', 'c.id')
      .join('question_sets as qs', 'q.question_set_id', 'qs.id')
      .select(
        'q.id',
        'q.category_id',
        'q.question_set_id',
        'q.question_text',
        'q.explanation',
        'q.difficulty',
        'q.status',
        'q.created_at',
        'q.updated_at'
      )
      .orderBy('q.created_at', 'asc');

    if (filters.questionSetId) {
      query = query.where('q.question_set_id', filters.questionSetId);
    }
    if (filters.categoryId) {
      query = query.where('q.category_id', filters.categoryId);
    }
    if (filters.status) {
      query = query.where('q.status', filters.status);
    }

    const questions: Question[] = await query;
    if (questions.length === 0) return [];

    const questionIds = questions.map((q) => q.id);
    const options: QuestionOption[] = await db('question_options')
      .whereIn('question_id', questionIds)
      .orderBy('sort_order', 'asc');

    const optionsByQuestion = options.reduce((acc, opt) => {
      if (opt.question_id) {
        if (!acc[opt.question_id]) acc[opt.question_id] = [];
        acc[opt.question_id].push(opt);
      }
      return acc;
    }, {} as Record<string, QuestionOption[]>);

    return questions.map((q) => ({
      ...q,
      options: optionsByQuestion[q.id] || [],
    }));
  }

  static async getById(id: string): Promise<Question | null> {
    const question = await db('questions').where({ id }).first();
    if (!question) return null;

    const options = await db('question_options')
      .where({ question_id: id })
      .orderBy('sort_order', 'asc');

    return {
      ...question,
      options,
    };
  }

  static async create(data: {
    category_id: string;
    question_set_id: string;
    question_text: string;
    explanation?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    status?: 'draft' | 'published';
    options: {
      option_label: string;
      option_text: string;
      is_correct: boolean;
      sort_order?: number;
    }[];
  }): Promise<Question> {
    return db.transaction(async (trx) => {
      const [question] = await trx('questions')
        .insert({
          category_id: data.category_id,
          question_set_id: data.question_set_id,
          question_text: data.question_text,
          explanation: data.explanation || null,
          difficulty: data.difficulty || 'medium',
          status: data.status || 'draft',
        })
        .returning('*');

      const optionRows = data.options.map((opt, index) => ({
        question_id: question.id,
        option_label: opt.option_label.toUpperCase(),
        option_text: opt.option_text,
        is_correct: !!opt.is_correct,
        sort_order: opt.sort_order ?? index + 1,
      }));

      const createdOptions = await trx('question_options')
        .insert(optionRows)
        .returning('*');

      return {
        ...question,
        options: createdOptions,
      };
    });
  }

  static async update(
    id: string,
    data: {
      category_id?: string;
      question_set_id?: string;
      question_text?: string;
      explanation?: string;
      difficulty?: 'easy' | 'medium' | 'hard';
      status?: 'draft' | 'published';
      options?: {
        id?: string;
        option_label: string;
        option_text: string;
        is_correct: boolean;
        sort_order?: number;
      }[];
    }
  ): Promise<Question | null> {
    return db.transaction(async (trx) => {
      const updateData: any = {};
      if (data.category_id !== undefined) updateData.category_id = data.category_id;
      if (data.question_set_id !== undefined) updateData.question_set_id = data.question_set_id;
      if (data.question_text !== undefined) updateData.question_text = data.question_text;
      if (data.explanation !== undefined) updateData.explanation = data.explanation;
      if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
      if (data.status !== undefined) updateData.status = data.status;
      updateData.updated_at = trx.fn.now();

      const [updated] = await trx('questions')
        .where({ id })
        .update(updateData)
        .returning('*');

      if (!updated) return null;

      if (data.options && data.options.length > 0) {
        await trx('question_options').where({ question_id: id }).del();

        const optionRows = data.options.map((opt, idx) => ({
          question_id: id,
          option_label: opt.option_label.toUpperCase(),
          option_text: opt.option_text,
          is_correct: !!opt.is_correct,
          sort_order: opt.sort_order ?? idx + 1,
        }));

        const newOptions = await trx('question_options')
          .insert(optionRows)
          .returning('*');

        return {
          ...updated,
          options: newOptions,
        };
      }

      const existingOptions = await trx('question_options')
        .where({ question_id: id })
        .orderBy('sort_order', 'asc');

      return {
        ...updated,
        options: existingOptions,
      };
    });
  }

  static async delete(id: string): Promise<boolean> {
    const deletedCount = await db('questions').where({ id }).del();
    return deletedCount > 0;
  }

  static async bulkSave(
    questionSetId: string,
    categoryId: string,
    questions: {
      questionText: string;
      explanation?: string;
      status?: 'draft' | 'published';
      options: {
        label: string;
        text: string;
        isCorrect: boolean;
      }[];
    }[]
  ): Promise<number> {
    return db.transaction(async (trx) => {
      let savedCount = 0;
      for (const q of questions) {
        const [insertedQ] = await trx('questions')
          .insert({
            category_id: categoryId,
            question_set_id: questionSetId,
            question_text: q.questionText,
            explanation: q.explanation || null,
            difficulty: 'medium',
            status: q.status || 'draft',
          })
          .returning('*');

        const optionRows = q.options.map((opt, idx) => ({
          question_id: insertedQ.id,
          option_label: opt.label.toUpperCase(),
          option_text: opt.text,
          is_correct: !!opt.isCorrect,
          sort_order: idx + 1,
        }));

        await trx('question_options').insert(optionRows);
        savedCount++;
      }
      return savedCount;
    });
  }
}
