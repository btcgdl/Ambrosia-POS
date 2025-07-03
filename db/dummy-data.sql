-- Restaurant Database Dummy Data for SQLite3
-- This file contains comprehensive test data for all tables

-- Insert Payments (currencies and payment methods)
INSERT OR IGNORE INTO payments (id, currency, name) VALUES 
(randomblob(16), 'MXN', 'Efectivo'),
(randomblob(16), 'MXN', 'Tarjeta de Crédito'),
(randomblob(16), 'MXN', 'Tarjeta de Débito'),
(randomblob(16), 'MXN', 'Transferencia'),
(randomblob(16), 'USD', 'Cash USD');

-- Insert Roles (using INSERT OR IGNORE to handle existing data)
INSERT OR IGNORE INTO roles (id, role, password, is_deleted) VALUES 
(randomblob(16), 'admin', '$2b$10$hash1234567890abcdef', 0),
(randomblob(16), 'manager', '$2b$10$hash2345678901bcdefg', 0),
(randomblob(16), 'waiter', '$2b$10$hash3456789012cdefgh', 0),
(randomblob(16), 'chef', '$2b$10$hash4567890123defghi', 0),
(randomblob(16), 'cashier', '$2b$10$hash5678901234efghij', 0);

-- Insert Users (using INSERT OR IGNORE and checking for unique PINs)
INSERT OR IGNORE INTO users (id, name, pin, refresh_token, is_deleted, role_id) VALUES 
(randomblob(16), 'Ana García', 1234, 'refresh_token_ana', 0, (SELECT id FROM roles WHERE role = 'admin' LIMIT 1)),
(randomblob(16), 'Carlos Mendoza', 2345, 'refresh_token_carlos', 0, (SELECT id FROM roles WHERE role = 'manager' LIMIT 1)),
(randomblob(16), 'María López', 3456, 'refresh_token_maria', 0, (SELECT id FROM roles WHERE role = 'waiter' LIMIT 1)),
(randomblob(16), 'José Ramírez', 4567, 'refresh_token_jose', 0, (SELECT id FROM roles WHERE role = 'waiter' LIMIT 1)),
(randomblob(16), 'Elena Torres', 5678, 'refresh_token_elena', 0, (SELECT id FROM roles WHERE role = 'chef' LIMIT 1)),
(randomblob(16), 'Roberto Silva', 6789, 'refresh_token_roberto', 0, (SELECT id FROM roles WHERE role = 'chef' LIMIT 1)),
(randomblob(16), 'Lucia Morales', 7890, 'refresh_token_lucia', 0, (SELECT id FROM roles WHERE role = 'cashier' LIMIT 1)),
(randomblob(16), 'Diego Herrera', 8901, 'refresh_token_diego', 0, (SELECT id FROM roles WHERE role = 'waiter' LIMIT 1));

-- Insert Spaces
INSERT OR IGNORE INTO spaces (id, name, is_deleted) VALUES 
(randomblob(16), 'Terraza', 0),
(randomblob(16), 'Salón Principal', 0),
(randomblob(16), 'Bar', 0),
(randomblob(16), 'Área VIP', 0),
(randomblob(16), 'Jardín', 0);

-- Insert Tables
INSERT INTO tables (id, name, status, space_id, order_id, is_deleted) VALUES 
(randomblob(16), 'Mesa 1', 'available', (SELECT id FROM spaces WHERE name = 'Terraza' LIMIT 1), NULL, 0),
(randomblob(16), 'Mesa 2', 'occupied', (SELECT id FROM spaces WHERE name = 'Terraza' LIMIT 1), NULL, 0),
(randomblob(16), 'Mesa 3', 'available', (SELECT id FROM spaces WHERE name = 'Terraza' LIMIT 1), NULL, 0),
(randomblob(16), 'Mesa 4', 'reserved', (SELECT id FROM spaces WHERE name = 'Salón Principal' LIMIT 1), NULL, 0),
(randomblob(16), 'Mesa 5', 'occupied', (SELECT id FROM spaces WHERE name = 'Salón Principal' LIMIT 1), NULL, 0),
(randomblob(16), 'Mesa 6', 'available', (SELECT id FROM spaces WHERE name = 'Salón Principal' LIMIT 1), NULL, 0),
(randomblob(16), 'Mesa 7', 'available', (SELECT id FROM spaces WHERE name = 'Salón Principal' LIMIT 1), NULL, 0),
(randomblob(16), 'Barra 1', 'occupied', (SELECT id FROM spaces WHERE name = 'Bar' LIMIT 1), NULL, 0),
(randomblob(16), 'Barra 2', 'available', (SELECT id FROM spaces WHERE name = 'Bar' LIMIT 1), NULL, 0),
(randomblob(16), 'VIP 1', 'available', (SELECT id FROM spaces WHERE name = 'Área VIP' LIMIT 1), NULL, 0),
(randomblob(16), 'Jardín 1', 'available', (SELECT id FROM spaces WHERE name = 'Jardín' LIMIT 1), NULL, 0),
(randomblob(16), 'Jardín 2', 'occupied', (SELECT id FROM spaces WHERE name = 'Jardín' LIMIT 1), NULL, 0);

-- Insert Dish Categories
INSERT OR IGNORE INTO dish_categories (id, name, is_deleted) VALUES 
(randomblob(16), 'Entradas', 0),
(randomblob(16), 'Platos Principales', 0),
(randomblob(16), 'Postres', 0),
(randomblob(16), 'Bebidas', 0),
(randomblob(16), 'Ensaladas', 0),
(randomblob(16), 'Sopas', 0),
(randomblob(16), 'Mariscos', 0),
(randomblob(16), 'Carnes', 0);

-- Insert Dishes
INSERT INTO dishes (id, name, price, category_id, is_deleted) VALUES 
-- Entradas
(randomblob(16), 'Guacamole con Totopos', 85.00, (SELECT id FROM dish_categories WHERE name = 'Entradas' LIMIT 1), 0),
(randomblob(16), 'Quesadillas de Flor de Calabaza', 95.00, (SELECT id FROM dish_categories WHERE name = 'Entradas' LIMIT 1), 0),
(randomblob(16), 'Nachos con Queso', 110.00, (SELECT id FROM dish_categories WHERE name = 'Entradas' LIMIT 1), 0),

-- Platos Principales
(randomblob(16), 'Tacos al Pastor', 150.00, (SELECT id FROM dish_categories WHERE name = 'Platos Principales' LIMIT 1), 0),
(randomblob(16), 'Mole Poblano', 280.00, (SELECT id FROM dish_categories WHERE name = 'Platos Principales' LIMIT 1), 0),
(randomblob(16), 'Chiles en Nogada', 320.00, (SELECT id FROM dish_categories WHERE name = 'Platos Principales' LIMIT 1), 0),
(randomblob(16), 'Pozole Rojo', 180.00, (SELECT id FROM dish_categories WHERE name = 'Platos Principales' LIMIT 1), 0),

-- Carnes
(randomblob(16), 'Carne Asada', 350.00, (SELECT id FROM dish_categories WHERE name = 'Carnes' LIMIT 1), 0),
(randomblob(16), 'Arrachera', 380.00, (SELECT id FROM dish_categories WHERE name = 'Carnes' LIMIT 1), 0),

-- Mariscos
(randomblob(16), 'Ceviche de Camarón', 220.00, (SELECT id FROM dish_categories WHERE name = 'Mariscos' LIMIT 1), 0),
(randomblob(16), 'Pescado a la Veracruzana', 280.00, (SELECT id FROM dish_categories WHERE name = 'Mariscos' LIMIT 1), 0),

-- Ensaladas
(randomblob(16), 'Ensalada César', 140.00, (SELECT id FROM dish_categories WHERE name = 'Ensaladas' LIMIT 1), 0),
(randomblob(16), 'Ensalada de Nopales', 120.00, (SELECT id FROM dish_categories WHERE name = 'Ensaladas' LIMIT 1), 0),

-- Sopas
(randomblob(16), 'Sopa de Tortilla', 95.00, (SELECT id FROM dish_categories WHERE name = 'Sopas' LIMIT 1), 0),
(randomblob(16), 'Crema de Elote', 85.00, (SELECT id FROM dish_categories WHERE name = 'Sopas' LIMIT 1), 0),

-- Postres
(randomblob(16), 'Flan Napolitano', 75.00, (SELECT id FROM dish_categories WHERE name = 'Postres' LIMIT 1), 0),
(randomblob(16), 'Tres Leches', 85.00, (SELECT id FROM dish_categories WHERE name = 'Postres' LIMIT 1), 0),
(randomblob(16), 'Churros con Cajeta', 65.00, (SELECT id FROM dish_categories WHERE name = 'Postres' LIMIT 1), 0),

-- Bebidas
(randomblob(16), 'Agua de Jamaica', 35.00, (SELECT id FROM dish_categories WHERE name = 'Bebidas' LIMIT 1), 0),
(randomblob(16), 'Agua de Horchata', 35.00, (SELECT id FROM dish_categories WHERE name = 'Bebidas' LIMIT 1), 0),
(randomblob(16), 'Cerveza Corona', 45.00, (SELECT id FROM dish_categories WHERE name = 'Bebidas' LIMIT 1), 0),
(randomblob(16), 'Margarita', 120.00, (SELECT id FROM dish_categories WHERE name = 'Bebidas' LIMIT 1), 0);

-- Insert Ingredient Categories
INSERT OR IGNORE INTO ingredient_categories (id, name, is_deleted) VALUES 
(randomblob(16), 'Carnes', 0),
(randomblob(16), 'Vegetales', 0),
(randomblob(16), 'Lácteos', 0),
(randomblob(16), 'Especias', 0),
(randomblob(16), 'Granos y Cereales', 0),
(randomblob(16), 'Mariscos', 0),
(randomblob(16), 'Frutas', 0),
(randomblob(16), 'Condimentos', 0);

-- Insert Ingredients
INSERT INTO ingredients (id, name, category_id, quantity, unit, low_stock_threshold, cost_per_unit, is_deleted) VALUES 
-- Carnes
(randomblob(16), 'Pollo', (SELECT id FROM ingredient_categories WHERE name = 'Carnes' LIMIT 1), 25.5, 'kg', 5.0, 85.00, 0),
(randomblob(16), 'Carne de Res', (SELECT id FROM ingredient_categories WHERE name = 'Carnes' LIMIT 1), 18.2, 'kg', 3.0, 180.00, 0),
(randomblob(16), 'Carne de Cerdo', (SELECT id FROM ingredient_categories WHERE name = 'Carnes' LIMIT 1), 12.8, 'kg', 3.0, 120.00, 0),

-- Vegetales
(randomblob(16), 'Tomate', (SELECT id FROM ingredient_categories WHERE name = 'Vegetales' LIMIT 1), 15.0, 'kg', 2.0, 25.00, 0),
(randomblob(16), 'Cebolla', (SELECT id FROM ingredient_categories WHERE name = 'Vegetales' LIMIT 1), 20.0, 'kg', 3.0, 20.00, 0),
(randomblob(16), 'Chile Poblano', (SELECT id FROM ingredient_categories WHERE name = 'Vegetales' LIMIT 1), 8.5, 'kg', 1.0, 45.00, 0),
(randomblob(16), 'Aguacate', (SELECT id FROM ingredient_categories WHERE name = 'Vegetales' LIMIT 1), 12.0, 'kg', 2.0, 60.00, 0),
(randomblob(16), 'Lechuga', (SELECT id FROM ingredient_categories WHERE name = 'Vegetales' LIMIT 1), 6.5, 'kg', 1.0, 30.00, 0),

-- Lácteos
(randomblob(16), 'Queso Oaxaca', (SELECT id FROM ingredient_categories WHERE name = 'Lácteos' LIMIT 1), 8.0, 'kg', 1.0, 120.00, 0),
(randomblob(16), 'Crema', (SELECT id FROM ingredient_categories WHERE name = 'Lácteos' LIMIT 1), 5.5, 'litros', 1.0, 35.00, 0),
(randomblob(16), 'Leche', (SELECT id FROM ingredient_categories WHERE name = 'Lácteos' LIMIT 1), 20.0, 'litros', 5.0, 22.00, 0),

-- Especias
(randomblob(16), 'Comino', (SELECT id FROM ingredient_categories WHERE name = 'Especias' LIMIT 1), 2.0, 'kg', 0.2, 150.00, 0),
(randomblob(16), 'Orégano', (SELECT id FROM ingredient_categories WHERE name = 'Especias' LIMIT 1), 1.5, 'kg', 0.2, 180.00, 0),
(randomblob(16), 'Sal', (SELECT id FROM ingredient_categories WHERE name = 'Especias' LIMIT 1), 10.0, 'kg', 2.0, 8.00, 0),

-- Granos y Cereales
(randomblob(16), 'Arroz', (SELECT id FROM ingredient_categories WHERE name = 'Granos y Cereales' LIMIT 1), 25.0, 'kg', 5.0, 18.00, 0),
(randomblob(16), 'Frijoles', (SELECT id FROM ingredient_categories WHERE name = 'Granos y Cereales' LIMIT 1), 15.0, 'kg', 3.0, 25.00, 0),
(randomblob(16), 'Tortillas', (SELECT id FROM ingredient_categories WHERE name = 'Granos y Cereales' LIMIT 1), 100.0, 'piezas', 20.0, 1.50, 0),

-- Mariscos
(randomblob(16), 'Camarón', (SELECT id FROM ingredient_categories WHERE name = 'Mariscos' LIMIT 1), 5.5, 'kg', 1.0, 280.00, 0),
(randomblob(16), 'Pescado Blanco', (SELECT id FROM ingredient_categories WHERE name = 'Mariscos' LIMIT 1), 8.0, 'kg', 1.5, 150.00, 0),

-- Frutas
(randomblob(16), 'Limón', (SELECT id FROM ingredient_categories WHERE name = 'Frutas' LIMIT 1), 10.0, 'kg', 2.0, 15.00, 0),
(randomblob(16), 'Naranja', (SELECT id FROM ingredient_categories WHERE name = 'Frutas' LIMIT 1), 8.0, 'kg', 1.5, 18.00, 0),

-- Condimentos
(randomblob(16), 'Aceite de Oliva', (SELECT id FROM ingredient_categories WHERE name = 'Condimentos' LIMIT 1), 5.0, 'litros', 1.0, 85.00, 0),
(randomblob(16), 'Vinagre', (SELECT id FROM ingredient_categories WHERE name = 'Condimentos' LIMIT 1), 3.0, 'litros', 0.5, 25.00, 0);

-- Insert Suppliers
INSERT OR IGNORE INTO suppliers (id, name, contact, phone, email, address, is_deleted) VALUES 
(randomblob(16), 'Carnicería La Guadalupana', 'Sr. Miguel Hernández', '33-1234-5678', 'carniceria@lagua.com', 'Av. Hidalgo 123, Guadalajara', 0),
(randomblob(16), 'Verduras del Campo', 'Sra. Rosa Jiménez', '33-2345-6789', 'ventas@verdurasdelcampo.mx', 'Mercado San Juan de Dios', 0),
(randomblob(16), 'Lácteos Jalisco', 'Ing. Carlos Ruiz', '33-3456-7890', 'pedidos@lacteosjalisco.com', 'Zona Industrial, Tlaquepaque', 0),
(randomblob(16), 'Mariscos El Puerto', 'Cap. Antonio Vega', '33-4567-8901', 'mariscos@elpuerto.net', 'Central de Abasto, Guadalajara', 0),
(randomblob(16), 'Especias y Condimentos SA', 'Lic. Patricia Moreno', '33-5678-9012', 'info@especiascond.com', 'Col. Americana, Guadalajara', 0);

-- Insert Ingredient_Suppliers (purchase history)
INSERT INTO ingredient_suppliers (id_supplier, id_ingredient, date, total_cost, quantity) VALUES 
-- Compras recientes
((SELECT id FROM suppliers WHERE name = 'Carnicería La Guadalupana' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Pollo' LIMIT 1), '2025-06-15', 2125.00, 25.0),
((SELECT id FROM suppliers WHERE name = 'Carnicería La Guadalupana' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Carne de Res' LIMIT 1), '2025-06-15', 3600.00, 20.0),
((SELECT id FROM suppliers WHERE name = 'Verduras del Campo' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Tomate' LIMIT 1), '2025-06-16', 375.00, 15.0),
((SELECT id FROM suppliers WHERE name = 'Verduras del Campo' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cebolla' LIMIT 1), '2025-06-16', 400.00, 20.0),
((SELECT id FROM suppliers WHERE name = 'Lácteos Jalisco' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Queso Oaxaca' LIMIT 1), '2025-06-14', 960.00, 8.0),
((SELECT id FROM suppliers WHERE name = 'Mariscos El Puerto' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Camarón' LIMIT 1), '2025-06-17', 1540.00, 5.5),

-- Compras del mes pasado
((SELECT id FROM suppliers WHERE name = 'Carnicería La Guadalupana' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Carne de Cerdo' LIMIT 1), '2025-05-20', 1440.00, 12.0),
((SELECT id FROM suppliers WHERE name = 'Verduras del Campo' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Aguacate' LIMIT 1), '2025-05-22', 600.00, 10.0),
((SELECT id FROM suppliers WHERE name = 'Especias y Condimentos SA' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Comino' LIMIT 1), '2025-05-25', 300.00, 2.0);

-- Insert sample Orders
INSERT INTO orders (id, user_id, table_id, waiter, status, total, created_at, is_deleted) VALUES 
(randomblob(16), (SELECT id FROM users WHERE name = 'María López' LIMIT 1), (SELECT id FROM tables WHERE name = 'Mesa 2' LIMIT 1), 'María López', 'open', 485.00, '2025-06-17 12:30:00', 0),
(randomblob(16), (SELECT id FROM users WHERE name = 'José Ramírez' LIMIT 1), (SELECT id FROM tables WHERE name = 'Mesa 5' LIMIT 1), 'José Ramírez', 'closed', 750.00, '2025-06-17 13:15:00', 0),
(randomblob(16), (SELECT id FROM users WHERE name = 'Diego Herrera' LIMIT 1), (SELECT id FROM tables WHERE name = 'Barra 1' LIMIT 1), 'Diego Herrera', 'open', 285.00, '2025-06-17 14:00:00', 0),
(randomblob(16), (SELECT id FROM users WHERE name = 'María López' LIMIT 1), (SELECT id FROM tables WHERE name = 'Jardín 2' LIMIT 1), 'María López', 'paid', 920.00, '2025-06-16 19:30:00', 0);

-- Insert Orders_Dishes (order items)
INSERT INTO orders_dishes (id, order_id, dish_id, instance_id, quantity, price_at_order, notes) VALUES 
-- Orden 1 (Mesa 2)
(randomblob(16), (SELECT id FROM orders WHERE waiter = 'María López' AND status = 'open' LIMIT 1), (SELECT id FROM dishes WHERE name = 'Guacamole con Totopos' LIMIT 1), 'INST001', 1, 85.00, 'Extra picante'),
(randomblob(16), (SELECT id FROM orders WHERE waiter = 'María López' AND status = 'open' LIMIT 1), (SELECT id FROM dishes WHERE name = 'Tacos al Pastor' LIMIT 1), 'INST002', 2, 150.00, NULL),
(randomblob(16), (SELECT id FROM orders WHERE waiter = 'María López' AND status = 'open' LIMIT 1), (SELECT id FROM dishes WHERE name = 'Cerveza Corona' LIMIT 1), 'INST003', 2, 45.00, 'Bien fría'),

-- Orden 2 (Mesa 5)
(randomblob(16), (SELECT id FROM orders WHERE waiter = 'José Ramírez' LIMIT 1), (SELECT id FROM dishes WHERE name = 'Ceviche de Camarón' LIMIT 1), 'INST004', 1, 220.00, NULL),
(randomblob(16), (SELECT id FROM orders WHERE waiter = 'José Ramírez' LIMIT 1), (SELECT id FROM dishes WHERE name = 'Mole Poblano' LIMIT 1), 'INST005', 1, 280.00, NULL),
(randomblob(16), (SELECT id FROM orders WHERE waiter = 'José Ramírez' LIMIT 1), (SELECT id FROM dishes WHERE name = 'Agua de Jamaica' LIMIT 1), 'INST006', 2, 35.00, NULL),
(randomblob(16), (SELECT id FROM orders WHERE waiter = 'José Ramírez' LIMIT 1), (SELECT id FROM dishes WHERE name = 'Flan Napolitano' LIMIT 1), 'INST007', 2, 75.00, NULL);

-- Insert sample Tickets
INSERT INTO tickets (id, order_id, user_id, ticket_date, status, total_amount, notes) VALUES 
(randomblob(16), (SELECT id FROM orders WHERE status = 'paid' LIMIT 1), (SELECT id FROM users WHERE name = 'Lucia Morales' LIMIT 1), '2025-06-16 20:15:00', 1, 920.00, 'Cliente satisfecho'),
(randomblob(16), (SELECT id FROM orders WHERE waiter = 'José Ramírez' LIMIT 1), (SELECT id FROM users WHERE name = 'Lucia Morales' LIMIT 1), '2025-06-17 14:30:00', 1, 750.00, 'Pago con tarjeta');

-- Insert Tickets_Dish
INSERT INTO tickets_dish (id_ticket, id_dish, quantity, price_at_order, notes) VALUES 
-- Ticket 1
((SELECT id FROM tickets LIMIT 1), (SELECT id FROM dishes WHERE name = 'Chiles en Nogada' LIMIT 1), 2, 320.00, NULL),
((SELECT id FROM tickets LIMIT 1), (SELECT id FROM dishes WHERE name = 'Arrachera' LIMIT 1), 1, 380.00, 'Término medio'),
((SELECT id FROM tickets LIMIT 1), (SELECT id FROM dishes WHERE name = 'Margarita' LIMIT 1), 2, 120.00, NULL);

-- Insert Payments_Tickets
INSERT INTO payments_tickets (id, ticket_id, payment_date, amount, payment_method, transaction_id) VALUES 
(randomblob(16), (SELECT id FROM tickets LIMIT 1), '2025-06-16 20:15:00', 920.00, (SELECT id FROM payments WHERE name = 'Tarjeta de Crédito' LIMIT 1), 'TXN20250616001'),
(randomblob(16), (SELECT id FROM tickets LIMIT 1 OFFSET 1), '2025-06-17 14:30:00', 750.00, (SELECT id FROM payments WHERE name = 'Efectivo' LIMIT 1), NULL);

-- Insert sample Shifts
INSERT INTO shifts (id, user_id, shift_date, start_time, end_time, notes, is_deleted) VALUES 
(randomblob(16), (SELECT id FROM users WHERE name = 'María López' LIMIT 1), '2025-06-17', '08:00:00', '16:00:00', 'Turno matutino', 0),
(randomblob(16), (SELECT id FROM users WHERE name = 'José Ramírez' LIMIT 1), '2025-06-17', '14:00:00', '22:00:00', 'Turno vespertino', 0),
(randomblob(16), (SELECT id FROM users WHERE name = 'Elena Torres' LIMIT 1), '2025-06-17', '10:00:00', '18:00:00', 'Chef principal', 0),
(randomblob(16), (SELECT id FROM users WHERE name = 'Roberto Silva' LIMIT 1), '2025-06-17', '18:00:00', NULL, 'Turno nocturno activo', 0),
(randomblob(16), (SELECT id FROM users WHERE name = 'Diego Herrera' LIMIT 1), '2025-06-16', '12:00:00', '20:00:00', 'Día ocupado', 0);

-- Insert some dish-ingredient relationships
INSERT INTO dishes_ingredient (id_dish, id_ingredient, quantity) VALUES 
-- Tacos al Pastor
((SELECT id FROM dishes WHERE name = 'Tacos al Pastor' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Carne de Cerdo' LIMIT 1), 0.25),
((SELECT id FROM dishes WHERE name = 'Tacos al Pastor' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Tortillas' LIMIT 1), 3.0),
((SELECT id FROM dishes WHERE name = 'Tacos al Pastor' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cebolla' LIMIT 1), 0.05),

-- Guacamole
((SELECT id FROM dishes WHERE name = 'Guacamole con Totopos' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Aguacate' LIMIT 1), 0.3),
((SELECT id FROM dishes WHERE name = 'Guacamole con Totopos' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Tomate' LIMIT 1), 0.1),
((SELECT id FROM dishes WHERE name = 'Guacamole con Totopos' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cebolla' LIMIT 1), 0.05),
((SELECT id FROM dishes WHERE name = 'Guacamole con Totopos' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Limón' LIMIT 1), 0.02),

-- Ceviche de Camarón
((SELECT id FROM dishes WHERE name = 'Ceviche de Camarón' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Camarón' LIMIT 1), 0.2),
((SELECT id FROM dishes WHERE name = 'Ceviche de Camarón' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Limón' LIMIT 1), 0.1),
((SELECT id FROM dishes WHERE name = 'Ceviche de Camarón' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Tomate' LIMIT 1), 0.1),
((SELECT id FROM dishes WHERE name = 'Ceviche de Camarón' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cebolla' LIMIT 1), 0.05);

-- Display some verification queries
SELECT 'Total Users: ' || COUNT(*) as info FROM users WHERE is_deleted = 0;
SELECT 'Total Dishes: ' || COUNT(*) as info FROM dishes WHERE is_deleted = 0;
SELECT 'Total Active Orders: ' || COUNT(*) as info FROM orders WHERE status = 'open';
SELECT 'Total Tables: ' || COUNT(*) as info FROM tables WHERE is_deleted = 0;
SELECT 'Total Ingredients: ' || COUNT(*) as info FROM ingredients WHERE is_deleted = 0;
