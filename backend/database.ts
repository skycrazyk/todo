import { Database } from '@db/sqlite'

export const db = new Database('database.db')

db.sql`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL
);
`

db.sql`
CREATE TABLE IF NOT EXISTS user_identities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    iss VARCHAR(50) NOT NULL,
    sub VARCHAR(255) NOT NULL,
    UNIQUE(iss, sub)
);
`

db.sql`
CREATE TABLE IF NOT EXISTS lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
);
`

db.sql`
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN DEFAULT FALSE NOT NULL
);
`
