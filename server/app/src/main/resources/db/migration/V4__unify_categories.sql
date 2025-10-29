-- Unify dish_categories, ingredient_categories, product_categories into categories
PRAGMA foreign_keys = OFF;

CREATE TABLE categories (
  id BLOB PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dish','ingredient','product')),
  is_deleted BOOLEAN NOT NULL DEFAULT 0,
  UNIQUE (type, name)
);


INSERT INTO categories (id, name, type, is_deleted)
SELECT id, name, 'dish', COALESCE(is_deleted, 0) FROM dish_categories;

INSERT INTO categories (id, name, type, is_deleted)
SELECT id, name, 'ingredient', COALESCE(is_deleted, 0) FROM ingredient_categories;

INSERT INTO categories (id, name, type, is_deleted)
SELECT id, name, 'product', COALESCE(is_deleted, 0) FROM product_categories;


CREATE TABLE dishes__new (
  id BLOB PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category_id BLOB NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);
INSERT INTO dishes__new (id, name, price, category_id, is_deleted)
SELECT id, name, price, category_id, is_deleted FROM dishes;
DROP TABLE dishes;
ALTER TABLE dishes__new RENAME TO dishes;

CREATE TABLE ingredients__new (
  id BLOB PRIMARY KEY,
  name TEXT NOT NULL,
  category_id BLOB NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  low_stock_threshold REAL NOT NULL DEFAULT 0,
  cost_per_unit REAL NOT NULL DEFAULT 0.00,
  is_deleted BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);
INSERT INTO ingredients__new (id, name, category_id, quantity, unit, low_stock_threshold, cost_per_unit, is_deleted)
SELECT id, name, category_id, quantity, unit, low_stock_threshold, cost_per_unit, is_deleted FROM ingredients;
DROP TABLE ingredients;
ALTER TABLE ingredients__new RENAME TO ingredients;

CREATE TABLE products__new (
  id BLOB PRIMARY KEY,
  SKU TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cost_cents INTEGER NOT NULL,
  category_id BLOB NOT NULL,
  quantity INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);
INSERT INTO products__new (id, SKU, name, description, image_url, cost_cents, category_id, quantity, price_cents, is_deleted)
SELECT id, SKU, name, description, image_url, cost_cents, category_id, quantity, price_cents, is_deleted FROM products;
DROP TABLE products;
ALTER TABLE products__new RENAME TO products;


DROP TABLE dish_categories;
DROP TABLE ingredient_categories;
DROP TABLE product_categories;


PRAGMA foreign_keys = ON;
