-- Restaurant Database Schema for SQLite3
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Users table (PIN corregido a 4 dígitos)
CREATE TABLE users (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL,
    pin TEXT NOT NULL UNIQUE,
    refresh_token TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    role_id BLOB NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
);

-- Roles table
CREATE TABLE roles (
    id BLOB PRIMARY KEY,
    role TEXT NOT NULL UNIQUE,
    password TEXT,
    isAdmin BOOLEAN NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT 0
);

-- Spaces table (NUEVA)
CREATE TABLE spaces (
    id BLOB PRIMARY KEY,
    name TEXT,
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
    name TEXT NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT 0
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
    name TEXT NOT NULL UNIQUE,
    is_deleted BOOLEAN NOT NULL DEFAULT 0
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
    price_at_order REAL NOT NULL,
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes (id) ON DELETE CASCADE
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

-- Payments
CREATE TABLE payments (
    id BLOB PRIMARY KEY,
    method_id BLOB NOT NULL,
    currency_id BLOB NOT NULL,
    transaction_id BLOB NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (method_id) REFERENCES payment_methods (id) ON DELETE RESTRICT
);

-- Tickets_payments
CREATE TABLE ticket_payments (
    payment_id BLOB NOT NULL,
    ticket_id BLOB NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE CASCADE
);

CREATE TABLE currency (
    id BLOB PRIMARY KEY,
    acronym TEXT(3) NOT NULL
);


CREATE TABLE payment_methods (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
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

CREATE TABLE base_currency (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    currency_id BLOB NOT NULL,
    FOREIGN KEY (currency_id) REFERENCES currency (id) ON DELETE RESTRICT
);

INSERT INTO payment_methods (id, name) VALUES
    ('32332081-7a2b-4e67-a198-fddf2451f426', 'Efectivo'),
    ('6440df5d-c76c-4074-9256-dd2dccf8a50b', 'Tarjeta de Crédito'),
    ('0b571243-2143-4afc-a728-f6e5c4e8a9e1', 'Tarjeta de Débito'),
    ('3ae8f71e-954a-4795-8531-368354c67ede', 'BTC');

INSERT INTO currency (id, acronym) VALUES
    ('beb95c15-cdcb-47c3-beba-5a47f360b999', 'MXN'),
    ('bccfc932-d89b-477a-b65b-04f97cae4aae', 'USD'),
    ('5562cbb7-3e26-4811-ac57-21e6edc53265', 'BTC');

INSERT INTO base_currency (id, currency_id) VALUES
    (1, 'beb95c15-cdcb-47c3-beba-5a47f360b999');