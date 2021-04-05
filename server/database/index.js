import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

sqlite3.verbose();

export async function openDb() {
    const db = await open({
        filename: "./sqlite.db",
        driver: sqlite3.Database
    });
    await db.exec("PRAGMA foreign_keys = ON;");
    return db;
}