import { Database } from '@db/sqlite'

export const db = new Database('database.db')

console.log('connected')

db.sql`
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN DEFAULT FALSE NOT NULL
);
`
