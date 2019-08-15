-- Your SQL goes here
CREATE TABLE users (
    id TEXT PRIMARY KEY ,
    name VARCHAR(32) NOT NULL ,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX ON users(name);
CREATE INDEX ON users(address);
