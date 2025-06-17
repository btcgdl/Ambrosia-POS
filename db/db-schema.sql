-- Restaurant Database Schema for SQLite3
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Users table (PIN corregido a 4 dígitos)
CREATE TABLE users (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    pin INTEGER NOT NULL UNIQUE,
    refresh_token TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    role_id BLOB NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
);

-- Roles table
CREATE TABLE roles (
    id BLOB PRIMARY KEY,
    role TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT 0
);

-- Spaces table (NUEVA)
CREATE TABLE spaces (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT 0
);

-- Tables table (NUEVA)  
CREATE TABLE tables (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved')),
    space_id BLOB NOT NULL,
    order_id BLOB,
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (space_id) REFERENCES spaces (id) ON DELETE CASCADE
);

-- Dish Categories table
CREATE TABLE dish_categories (
    id BLOB PRIMARY KEY, 
    name TEXT NOT NULL UNIQUE
);

-- Dishes table (con relación a categoría)
CREATE TABLE dishes (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category_id BLOB NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES dish_categories (id)
);

-- Ingredient Categories table
CREATE TABLE ingredient_categories (
    id BLOB PRIMARY KEY, 
    name TEXT NOT NULL UNIQUE
);

-- Ingredients table (coma extra removida y con relación a categoría)
CREATE TABLE ingredients (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    category_id BLOB NOT NULL,
    quantity REAL NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'kg',
    low_stock_threshold REAL NOT NULL DEFAULT 0,
    cost_per_unit REAL NOT NULL DEFAULT 0.00,
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES ingredient_categories (id)
);

-- Dishes_Ingredient junction table
CREATE TABLE dishes_ingredient (
    id_dish BLOB NOT NULL,
    id_ingredient BLOB NOT NULL,
    quantity REAL NOT NULL DEFAULT 1,
    PRIMARY KEY (id_dish, id_ingredient),
    FOREIGN KEY (id_dish) REFERENCES dishes (id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES ingredients (id) ON DELETE CASCADE
);

-- Suppliers table
CREATE TABLE suppliers (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    contact TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT 0
);

-- Ingredient_Suppliers junction table (TU ESTRUCTURA MANTENIDA)
CREATE TABLE ingredient_suppliers (
    id_supplier BLOB NOT NULL,
    id_ingredient BLOB NOT NULL,
    date TEXT NOT NULL,
    total_cost REAL NOT NULL,
    quantity REAL NOT NULL,
    PRIMARY KEY (id_supplier, id_ingredient, date),
    FOREIGN KEY (id_supplier) REFERENCES suppliers (id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES ingredients (id) ON DELETE CASCADE
);

-- Orders table (NUEVA - para pedidos)
CREATE TABLE orders (
    id BLOB PRIMARY KEY,
    user_id BLOB NOT NULL,
    table_id BLOB,
    waiter TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'paid')),
    total REAL NOT NULL DEFAULT 0.00,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (table_id) REFERENCES tables (id)
);

-- Orders_Dishes junction table (NUEVA)
CREATE TABLE orders_dishes (
    id BLOB PRIMARY KEY,
    order_id BLOB NOT NULL,
    dish_id BLOB NOT NULL,
    instance_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_order REAL NOT NULL,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes (id) ON DELETE CASCADE
);

-- Payments table (currency corregido a TEXT)
CREATE TABLE payments (
    id BLOB PRIMARY KEY,
    currency TEXT NOT NULL,
    name TEXT NOT NULL
);

-- Tickets table (ahora vinculada a orders)
CREATE TABLE tickets (
    id BLOB PRIMARY KEY,
    order_id BLOB NOT NULL,
    user_id BLOB NOT NULL,
    ticket_date TEXT NOT NULL DEFAULT (datetime('now')),
    status INTEGER NOT NULL DEFAULT 1,
    total_amount REAL NOT NULL DEFAULT 0.00,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Tickets_Dish junction table (CLAVE PRIMARIA CORREGIDA)
CREATE TABLE tickets_dish (
    id_ticket BLOB NOT NULL,
    id_dish BLOB NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_order REAL NOT NULL,
    notes TEXT,
    PRIMARY KEY (id_ticket, id_dish), -- CORREGIDA: clave primaria compuesta
    FOREIGN KEY (id_ticket) REFERENCES tickets (id) ON DELETE CASCADE,
    FOREIGN KEY (id_dish) REFERENCES dishes (id) ON DELETE CASCADE
);

-- Payments_Tickets table (con ID propio)
CREATE TABLE payments_tickets (
    id BLOB PRIMARY KEY,
    ticket_id BLOB NOT NULL,
    payment_date TEXT NOT NULL DEFAULT (datetime('now')),
    amount REAL NOT NULL,
    payment_method BLOB NOT NULL,
    transaction_id TEXT,
    FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method) REFERENCES payments (id) ON DELETE CASCADE
);

-- Shifts table (referencia corregida)
CREATE TABLE shifts (
    id BLOB PRIMARY KEY,
    user_id BLOB NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    notes VARCHAR(255),
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_pin ON users (pin);
CREATE INDEX idx_tables_space ON tables (space_id);
CREATE INDEX idx_tables_order ON tables (order_id);
CREATE INDEX idx_dishes_category ON dishes (category_id);
CREATE INDEX idx_ingredients_category ON ingredients (category_id);
CREATE INDEX idx_orders_user ON orders (user_id);
CREATE INDEX idx_orders_table ON orders (table_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_dishes_order ON orders_dishes (order_id);
CREATE INDEX idx_tickets_order ON tickets (order_id);
CREATE INDEX idx_tickets_user ON tickets (user_id);
CREATE INDEX idx_tickets_date ON tickets (ticket_date);
CREATE INDEX idx_tickets_status ON tickets (status);
CREATE INDEX idx_tickets_dish_order ON tickets_dish (id_ticket);
CREATE INDEX idx_payments_tickets_order ON payments_tickets (ticket_id);
CREATE INDEX idx_ingredient_suppliers_date ON ingredient_suppliers (date);
CREATE INDEX idx_ingredient_suppliers_supplier ON ingredient_suppliers (id_supplier);
CREATE INDEX idx_ingredient_suppliers_ingredient ON ingredient_suppliers (id_ingredient);
