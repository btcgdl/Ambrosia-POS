-- Restaurant Database Schema for SQLite3
-- Created based on the provided documentation

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE users (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    pin INTEGER NOT NULL UNIQUE CHECK (pin >= 100000 AND pin <= 999999)
);

-- Roles table
CREATE TABLE roles (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- Roles_Users junction table
CREATE TABLE roles_users (
    id_user BLOB NOT NULL,
    id_role BLOB NOT NULL,
    PRIMARY KEY (id_user, id_role),
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_role) REFERENCES roles(id)
);

-- Dishes_Category table
CREATE TABLE dishes_category (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL
);

-- Dishes table
CREATE TABLE dishes (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL
);

-- Category_Ingredients table
CREATE TABLE category_ingredients (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL
);

-- Ingredients table
CREATE TABLE ingredients (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 0,
    cost_per_unit REAL NOT NULL DEFAULT 0.00
);

-- Dishes_Ingredient junction table
CREATE TABLE dishes_ingredient (
    id_dish BLOB NOT NULL,
    id_ingredient BLOB NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (id_dish, id_ingredient),
    FOREIGN KEY (id_dish) REFERENCES dishes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Ingredient_Category junction table
CREATE TABLE ingredient_category (
    id_category_ingredient BLOB NOT NULL,
    id_ingredient BLOB NOT NULL,
    PRIMARY KEY (id_category_ingredient, id_ingredient),
    FOREIGN KEY (id_category_ingredient) REFERENCES category_ingredients(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Suppliers table
CREATE TABLE suppliers (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT,
    phone TEXT,
    email TEXT,
    address TEXT
);

-- Ingredient_Suppliers junction table
CREATE TABLE ingredient_suppliers (
    id_supplier BLOB NOT NULL,
    id_ingredient BLOB NOT NULL,
    date TEXT NOT NULL,
    total_cost REAL NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (id_supplier, id_ingredient, date),
    FOREIGN KEY (id_supplier) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
    id BLOB PRIMARY KEY,
    currency REAL NOT NULL,
    name TEXT NOT NULL
);

-- Tickets table
CREATE TABLE tickets (
    id BLOB PRIMARY KEY,
    id_user BLOB NOT NULL,
    ticket_date TEXT NOT NULL DEFAULT (datetime('now')),
    status INTEGER NOT NULL DEFAULT 1,
    total_amount REAL NOT NULL DEFAULT 0.00,
    notes TEXT,
    FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE RESTRICT
);

-- Tickets_Dish junction table
CREATE TABLE tickets_dish (
    id_ticket BLOB NOT NULL,
    id_dish BLOB NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_order REAL NOT NULL,
    notes TEXT,
    PRIMARY KEY (id_ticket),
    FOREIGN KEY (id_ticket) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (id_dish) REFERENCES dishes(id) ON DELETE RESTRICT
);

-- Payments_Tickets table
CREATE TABLE payments_tickets (
    id_ticket BLOB NOT NULL,
    payment_date TEXT NOT NULL DEFAULT (datetime('now')),
    amount REAL NOT NULL,
    payment_method BLOB NOT NULL,
    transaction_id TEXT,
    PRIMARY KEY (id_ticket),
    FOREIGN KEY (id_ticket) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method) REFERENCES payments(id) ON DELETE RESTRICT
);

-- Create indexes for better performance
CREATE INDEX idx_users_pin ON users(pin);
CREATE INDEX idx_tickets_user ON tickets(id_user);
CREATE INDEX idx_tickets_date ON tickets(ticket_date);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_dish_order ON tickets_dish(id_ticket);
CREATE INDEX idx_payments_tickets_order ON payments_tickets(id_ticket);
CREATE INDEX idx_ingredient_suppliers_date ON ingredient_suppliers(date);
