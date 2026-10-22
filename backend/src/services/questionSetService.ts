import db from '../config/db.js';
import { QuestionSet } from '../types/index.js';

export class QuestionSetService {
  static async getAll(statusFilter?: string, categoryId?: string): Promise<QuestionSet[]> {
    let query = db('question_sets as qs')
      .join('categories as c', 'qs.category_id', 'c.id')
      .select(
        'qs.id',
        'qs.category_id',
        'qs.title',
        'qs.description',
        'qs.status',
        'qs.created_at',
        'qs.updated_at',
        'c.name as category_name'
      )
      .count('q.id as question_count')
      .leftJoin('questions as q', 'qs.id', 'q.question_set_id')
      .groupBy('qs.id', 'c.name')
      .orderBy('qs.created_at', 'desc');

    if (statusFilter) {
      query = query.where('qs.status', statusFilter);
    }

    if (categoryId) {
      query = query.where('qs.category_id', categoryId);
    }

    const rows = await query;
    return rows.map((r: any) => ({
      ...r,
      question_count: parseInt(r.question_count, 10) || 0,
    }));
  }

  static async getById(id: string): Promise<QuestionSet | null> {
    const row: any = await db('question_sets as qs')
      .join('categories as c', 'qs.category_id', 'c.id')
      .select(
        'qs.id',
        'qs.category_id',
        'qs.title',
        'qs.description',
        'qs.status',
        'qs.created_at',
        'qs.updated_at',
        'c.name as category_name'
      )
      .count('q.id as question_count')
      .leftJoin('questions as q', 'qs.id', 'q.question_set_id')
      .where('qs.id', id)
      .groupBy('qs.id', 'c.name')
      .first();

    if (!row) return null;
    return {
      ...row,
      question_count: parseInt(String(row.question_count), 10) || 0,
    } as QuestionSet;
  }

  static async create(data: { category_id: string; title: string; description?: string; status?: 'draft' | 'published' }): Promise<QuestionSet> {
    const [created] = await db('question_sets')
      .insert({
        category_id: data.category_id,
        title: data.title,
        description: data.description || null,
        status: data.status || 'draft',
      })
      .returning('*');

    return created;
  }

  static async update(id: string, data: Partial<{ category_id: string; title: string; description: string; status: 'draft' | 'published' }>): Promise<QuestionSet | null> {
    const rowsUpdated = await db('question_sets')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      });

    if (!rowsUpdated) return null;
    return this.getById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const deletedCount = await db('question_sets').where({ id }).del();
    return deletedCount > 0;
  }
}
