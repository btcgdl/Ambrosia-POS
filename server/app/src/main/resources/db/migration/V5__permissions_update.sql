PRAGMA foreign_keys = ON;

DELETE FROM role_permissions
WHERE permission_id IN (
  SELECT id FROM permissions WHERE name IN (
  'dish_categories_read',
  'dish_categories_create',
  'dish_categories_delete',
  'dish_categories_update',
  'ingredient_categories_read',
  'ingredient_categories_create',
  'ingredient_categories_update',
  'ingredient_categories_delete',
  'orders_refund'
  )
);

DELETE FROM permissions
WHERE name IN (
  'dish_categories_read',
  'dish_categories_create',
  'dish_categories_delete',
  'dish_categories_update',
  'ingredient_categories_read',
  'ingredient_categories_create',
  'ingredient_categories_update',
  'ingredient_categories_delete',
  'orders_refund'
);

INSERT INTO permissions (id, name, description, enabled) VALUES
  (lower(hex(randomblob(16))), 'payments_update', 'Update payments', 1),
  (lower(hex(randomblob(16))), 'payments_delete', 'Delete payments', 1),
  (lower(hex(randomblob(16))), 'shifts_delete', 'Delete shifts', 1),
  (lower(hex(randomblob(16))), 'dish_read', 'List and View dishes', 1),
  (lower(hex(randomblob(16))), 'dish_create', 'Create dishes', 1),
  (lower(hex(randomblob(16))), 'dish_update', 'Update dishes', 1),
  (lower(hex(randomblob(16))), 'dish_delete', 'Delete dishes', 1),
  (lower(hex(randomblob(16))), 'categories_read', 'List and view categories', 1),
  (lower(hex(randomblob(16))), 'categories_create', 'Create categories', 1),
  (lower(hex(randomblob(16))), 'categories_update', 'Update categories', 1),
  (lower(hex(randomblob(16))), 'categories_delete', 'Delete categories', 1),
  (lower(hex(randomblob(16))), 'tables_create', 'Create tables', 1),
  (lower(hex(randomblob(16))), 'tables_delete', 'Delete tables', 1);


INSERT INTO role_permissions (role_id, permission_id)
  SELECT r.id, p.id
  FROM roles r
  CROSS JOIN permissions p
  WHERE r.isAdmin = 1
  AND NOT EXISTS (
    SELECT 1
    FROM role_permissions rp
    WHERE rp.role_id = r.id
      AND rp.permission_id = p.id
  );
