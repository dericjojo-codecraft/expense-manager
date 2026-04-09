import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDatabase() {
    const db = await open({
        filename: './database.sqlite', // This file will be created automatically
        driver: sqlite3.Database
    });

    // Create the table if it doesn't exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS friends (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone INTEGER,
            balance INTEGER, 
            isActive INTEGER NOT NULL DEFAULT 1
        )
    `);

    return db;
}