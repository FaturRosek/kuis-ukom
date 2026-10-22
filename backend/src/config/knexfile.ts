import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5433,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'Nganlaok123',
      database: process.env.DB_NAME || 'ukom_quiz',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, '../db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, '../db/seeds'),
      extension: 'ts',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5433,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'Nganlaok123',
      database: process.env.DB_NAME || 'ukom_quiz',
    },
    migrations: {
      directory: path.resolve(__dirname, '../db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, '../db/seeds'),
      extension: 'ts',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        }
      : {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      directory: path.resolve(__dirname, '../db/migrations'),
      loadExtensions: ['.js', '.ts'],
    },
    seeds: {
      directory: path.resolve(__dirname, '../db/seeds'),
      loadExtensions: ['.js', '.ts'],
    },
  },
};

export default config;
