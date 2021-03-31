import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const db_path = "./sqlite.db"

open({
    filename: db_path,
    driver: sqlite3.Database
})
.then(async (db) => {
    await db.migrate()
});