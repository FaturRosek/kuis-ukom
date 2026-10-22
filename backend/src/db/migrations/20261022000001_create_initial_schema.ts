import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('role').notNullable().defaultTo('user'); 
    table.timestamps(true, true);
  });

  
  await knex.schema.createTable('categories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('slug').notNullable().unique();
    table.text('description').nullable();
    table.timestamps(true, true);
  });

  
  await knex.schema.createTable('question_sets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('category_id').references('id').inTable('categories').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description').nullable();
    table.string('status').notNullable().defaultTo('draft'); 
    table.timestamps(true, true);
  });

  
  await knex.schema.createTable('questions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('category_id').references('id').inTable('categories').onDelete('CASCADE');
    table.uuid('question_set_id').references('id').inTable('question_sets').onDelete('CASCADE');
    table.text('question_text').notNullable();
    table.text('explanation').nullable();
    table.string('difficulty').nullable().defaultTo('medium'); 
    table.string('status').notNullable().defaultTo('draft'); 
    table.jsonb('source_metadata').nullable();
    table.timestamps(true, true);
  });

  
  await knex.schema.createTable('question_options', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('question_id').references('id').inTable('questions').onDelete('CASCADE').notNullable();
    table.string('option_label', 10).notNullable(); 
    table.text('option_text').notNullable();
    table.boolean('is_correct').notNullable().defaultTo(false);
    table.integer('sort_order').notNullable().defaultTo(0);
    table.index(['question_id']);
  });

  
  await knex.schema.createTable('import_jobs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('file_name').notNullable();
    table.string('file_type').notNullable();
    table.integer('total_parsed').defaultTo(0);
    table.integer('valid_count').defaultTo(0);
    table.integer('warning_count').defaultTo(0);
    table.string('status').notNullable().defaultTo('pending'); 
    table.jsonb('metadata').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  
  await knex.schema.createTable('multiplayer_rooms', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('room_code', 10).notNullable().unique();
    table.uuid('host_id').nullable();
    table.string('host_name').notNullable().defaultTo('Host');
    table.uuid('question_set_id').references('id').inTable('question_sets').onDelete('CASCADE');
    table.integer('duration_per_question').notNullable().defaultTo(30);
    table.string('status').notNullable().defaultTo('lobby'); 
    table.timestamps(true, true);
  });

  
  await knex.schema.createTable('room_participants', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('room_id').references('id').inTable('multiplayer_rooms').onDelete('CASCADE').notNullable();
    table.uuid('user_id').nullable();
    table.string('player_name').notNullable();
    table.string('socket_id').nullable();
    table.boolean('is_host').notNullable().defaultTo(false);
    table.boolean('is_ready').notNullable().defaultTo(false);
    table.integer('score').notNullable().defaultTo(0);
    table.boolean('connected').notNullable().defaultTo(true);
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.index(['room_id']);
  });

  
  await knex.schema.createTable('game_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL').nullable();
    table.uuid('room_id').references('id').inTable('multiplayer_rooms').onDelete('SET NULL').nullable();
    table.uuid('question_set_id').references('id').inTable('question_sets').onDelete('CASCADE').notNullable();
    table.string('mode').notNullable().defaultTo('solo'); 
    table.integer('duration_per_question').notNullable().defaultTo(30);
    table.integer('total_questions').notNullable().defaultTo(0);
    table.string('status').notNullable().defaultTo('active'); 
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('ended_at').nullable();
  });

  
  await knex.schema.createTable('game_session_questions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('session_id').references('id').inTable('game_sessions').onDelete('CASCADE').notNullable();
    table.uuid('question_id').references('id').inTable('questions').onDelete('CASCADE').notNullable();
    table.integer('question_order').notNullable().defaultTo(1);
    table.jsonb('question_snapshot').notNullable();
    table.jsonb('options_snapshot').notNullable();
    table.index(['session_id']);
  });

  
  await knex.schema.createTable('game_answers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('session_id').references('id').inTable('game_sessions').onDelete('CASCADE').notNullable();
    table.uuid('user_id').nullable();
    table.string('player_name').nullable();
    table.uuid('question_id').references('id').inTable('questions').onDelete('CASCADE').notNullable();
    table.uuid('selected_option_id').nullable();
    table.boolean('is_correct').notNullable().defaultTo(false);
    table.boolean('is_timeout').notNullable().defaultTo(false);
    table.decimal('time_taken_seconds', 6, 2).notNullable().defaultTo(0);
    table.timestamp('answered_at').defaultTo(knex.fn.now());
    
    table.unique(['session_id', 'user_id', 'question_id']);
    table.index(['session_id']);
  });

  
  await knex.schema.createTable('player_session_results', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('session_id').references('id').inTable('game_sessions').onDelete('CASCADE').notNullable();
    table.uuid('user_id').nullable();
    table.string('player_name').notNullable();
    table.integer('total_questions').notNullable().defaultTo(0);
    table.integer('correct_count').notNullable().defaultTo(0);
    table.integer('incorrect_count').notNullable().defaultTo(0);
    table.integer('timeout_count').notNullable().defaultTo(0);
    table.decimal('score_percentage', 5, 2).notNullable().defaultTo(0);
    table.decimal('total_time_seconds', 8, 2).notNullable().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index(['user_id']);
    table.index(['session_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('player_session_results');
  await knex.schema.dropTableIfExists('game_answers');
  await knex.schema.dropTableIfExists('game_session_questions');
  await knex.schema.dropTableIfExists('game_sessions');
  await knex.schema.dropTableIfExists('room_participants');
  await knex.schema.dropTableIfExists('multiplayer_rooms');
  await knex.schema.dropTableIfExists('import_jobs');
  await knex.schema.dropTableIfExists('question_options');
  await knex.schema.dropTableIfExists('questions');
  await knex.schema.dropTableIfExists('question_sets');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('users');
}
