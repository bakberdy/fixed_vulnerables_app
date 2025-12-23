import { Injectable, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Database.Database;

  onModuleInit() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    const dbPath = process.env.DATABASE_URL || './data/app.db';
    const dbDir = path.dirname(dbPath);

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('foreign_keys = ON');

    const schemaPath = path.join(__dirname, '../../../database/schema-freelance.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      this.db.exec(schema);
    }

    this.ensureGigsIsActiveColumn();
  }

  private ensureGigsIsActiveColumn() {
    // Align existing databases with the current schema expectation
    const tableExists = this.db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'gigs'").get();
    if (!tableExists) return;

    const columns = this.db.prepare("PRAGMA table_info('gigs')").all();
    const hasIsActive = columns.some((col: any) => col.name === 'is_active');

    if (!hasIsActive) {
      this.db.exec('ALTER TABLE gigs ADD COLUMN is_active INTEGER DEFAULT 1');
      this.db.exec('UPDATE gigs SET is_active = 1 WHERE is_active IS NULL');
    }
  }

  query<T = unknown>(sql: string, params: unknown[] = []): T[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  queryOne<T = unknown>(sql: string, params: unknown[] = []): T | null {
    const stmt = this.db.prepare(sql);
    return (stmt.get(...params) as T) || null;
  }

  execute(sql: string, params: unknown[] = []): Database.RunResult {
    const stmt = this.db.prepare(sql);
    return stmt.run(...params);
  }

  getDatabase(): Database.Database {
    return this.db;
  }
}
