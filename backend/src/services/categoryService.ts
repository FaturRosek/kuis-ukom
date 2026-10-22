import db from '../config/db.js';
import { Category } from '../types/index.js';

export class CategoryService {
  static async getAll(): Promise<Category[]> {
    return db('categories').select('*').orderBy('name', 'asc');
  }

  static async getById(id: string): Promise<Category | null> {
    const category = await db('categories').where({ id }).first();
    return category || null;
  }

  static async create(name: string, description?: string): Promise<Category> {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const [created] = await db('categories')
      .insert({
        name,
        slug,
        description: description || null,
      })
      .returning('*');

    return created;
  }
}
