#!/usr/bin/env node
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = process.env.DATABASE_URL || './data/app.db';
const schemaPath = path.join(__dirname, '../database/schema-freelance.sql');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

console.log('✅ Freelance platform database migration completed successfully');
console.log('📊 Database location:', dbPath);

db.close();
