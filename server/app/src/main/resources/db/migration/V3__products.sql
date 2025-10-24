-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

CREATE TABLE products (
    id BLOB PRIMARY KEY,
    SKU TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    cost_cents INTEGER NOT NULL,
    category_id BLOB NOT NULL,
    quantity INTEGER NOT NULL,
    price_cents INTEGER NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE product_categories (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT 0
);