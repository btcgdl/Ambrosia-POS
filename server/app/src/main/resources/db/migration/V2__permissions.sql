-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

CREATE TABLE permissions (
    id BLOB PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    enabled BOOLEAN NOT NULL DEFAULT 1
);

CREATE TABLE role_permissions (
    role_id BLOB NOT NULL,
    permission_id BLOB NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE RESTRICT
);

-- Users
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'users_read', 'List and view users', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'users_create', 'Create users', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'users_update', 'Update users', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'users_delete', 'Delete users', 1);

-- Roles
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'roles_read', 'List and view roles', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'roles_create', 'Create roles', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'roles_update', 'Update roles', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'roles_delete', 'Delete roles', 1);

-- Permissions (only is for reading, because others are managed by migrations)
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'permissions_read', 'List and view permissions', 1);

-- Dishes (products)
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'products_read', 'List and view dishes/products', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'products_create', 'Create dishes/products', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'products_update', 'Update dishes/products', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'products_delete', 'Delete dishes/products', 1);

-- Dish categories
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'dish_categories_read', 'List and view dish categories', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'dish_categories_create', 'Create dish categories', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'dish_categories_update', 'Update dish categories', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'dish_categories_delete', 'Delete dish categories', 1);

-- Ingredients
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'ingredients_read', 'List and view ingredients', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'ingredients_create', 'Create ingredients', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'ingredients_update', 'Update ingredients', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'ingredients_delete', 'Delete ingredients', 1);

-- Ingredient categories
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'ingredient_categories_read', 'List and view ingredient categories', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'ingredient_categories_create', 'Create ingredient categories', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'ingredient_categories_update', 'Update ingredient categories', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'ingredient_categories_delete', 'Delete ingredient categories', 1);

-- Suppliers
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'suppliers_read', 'List and view suppliers', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'suppliers_create', 'Create suppliers', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'suppliers_update', 'Update suppliers', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'suppliers_delete', 'Delete suppliers', 1);

-- Orders
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'orders_read', 'List and view orders', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'orders_create', 'Create orders', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'orders_update', 'Update orders', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'orders_refund', 'Refund order items/payments', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'orders_export', 'Export orders data', 1);

-- Tickets
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'tickets_read', 'List and view tickets', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'tickets_create', 'Create tickets', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'tickets_update', 'Update tickets', 1);

-- Payments
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'payments_read', 'List and view payments', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'payments_create', 'Create payments', 1);

-- Tables
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'tables_read', 'List and view tables', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'tables_update', 'Update tables (status, links)', 1);

-- Spaces
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'spaces_read', 'List and view spaces', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'spaces_create', 'Create spaces', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'spaces_update', 'Update spaces', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'spaces_delete', 'Delete spaces', 1);

-- Shifts
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'shifts_read', 'List and view shifts', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'shifts_create', 'Create shifts', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'shifts_update', 'Update shifts', 1);

-- Reports
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'reports_read', 'View reports', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'reports_export', 'Export reports', 1);

-- Settings / Config
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'settings_read', 'View settings/config', 1);
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'settings_update', 'Update settings/config', 1);

-- Printer operations
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'printer_update', 'Update ticket printer configuration', 1);

-- Wallet access
INSERT INTO permissions (id, name, description, enabled) VALUES (lower(hex(randomblob(16))), 'wallet_read', 'Access wallet/UI for payments', 1);
