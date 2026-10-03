-- Sarum Cut account schema for PostgreSQL.
-- Run this against the database named by DB_NAME before implementing Passport auth.

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    username VARCHAR(40) UNIQUE,
    email VARCHAR(254) UNIQUE,
    password_hash VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Store usernames in lowercase in application code before inserting.
    CONSTRAINT users_username_lowercase CHECK (username IS NULL OR username = LOWER(username)),
    -- A user must have at least one way to authenticate.
    CONSTRAINT users_has_auth_method CHECK (password_hash IS NOT NULL OR google_id IS NOT NULL)
);

-- Passport's default session support needs a persistent store in production.
-- This table matches the schema expected by connect-pg-simple.
CREATE TABLE IF NOT EXISTS "session" (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" (expire);
