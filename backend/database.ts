import { Database } from '@db/sqlite'

export const db = new Database('database.db')

db.sql`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL
);
`

db.sql`
CREATE TABLE IF NOT EXISTS users_identities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    iss VARCHAR(500) NOT NULL,
    sub VARCHAR(500) NOT NULL,
    UNIQUE(iss, sub),
    UNIQUE(user_id, iss)
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
