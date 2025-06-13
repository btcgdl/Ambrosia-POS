# Database Context

## User

- **Description**: Users of the system.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `name`: TEXT NOT NULL
  - `pin`: INTEGER NOT NULL UNIQUE (4 digits: 1000-9999)
  - `refresh_token`: TEXT
  - `is_deleted`: BOOLEAN NOT NULL DEFAULT 0
- **Example**: `{id: "uuid-blob", name: "Angel", pin: 1234, refresh_token: "token", is_deleted: false}`

## Role

- **Description**: Roles of the system.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `role`: TEXT NOT NULL UNIQUE
  - `password`: TEXT NOT NULL
  - `is_deleted`: BOOLEAN NOT NULL DEFAULT 0
- **Example**: `{id: "uuid-blob", role: "admin", password: "hashed_password", is_deleted: false}`

## Space

- **Description**: Physical spaces or rooms in the restaurant.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `name`: TEXT NOT NULL UNIQUE
  - `is_deleted`: BOOLEAN NOT NULL DEFAULT 0
- **Example**: `{id: "uuid-blob", name: "Main Hall", is_deleted: false}`

## Table

- **Description**: Tables within spaces.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `name`: TEXT NOT NULL
  - `status`: TEXT NOT NULL DEFAULT 'available' (available, occupied, reserved)
  - `space_id`: BLOB NOT NULL @Relation(Space)
  - `order_id`: BLOB @Relation(Order)
  - `is_deleted`: BOOLEAN NOT NULL DEFAULT 0
- **Example**: `{id: "uuid-blob", name: "Table 1", status: "available", space_id: "space-uuid", order_id: null, is_deleted: false}`

## Dish_Category

- **Description**: Categories of dishes.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `name`: TEXT NOT NULL UNIQUE
- **Example**: `{id: "uuid-blob", name: "Mexican"}`

## Dish

- **Description**: Dishes for the menu.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `name`: TEXT NOT NULL
  - `price`: REAL NOT NULL
  - `category_id`: BLOB NOT NULL @Relation(Dish_Category)
  - `is_deleted`: BOOLEAN NOT NULL DEFAULT 0
- **Example**: `{id: "uuid-blob", name: "Tacos al Pastor", price: 80.0, category_id: "category-uuid", is_deleted: false}`

## Ingredient_Category

- **Description**: Categories of ingredients.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `name`: TEXT NOT NULL UNIQUE
- **Example**: `{id: "uuid-blob", name: "Meat"}`

## Ingredient

- **Description**: Ingredients in stock.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `name`: TEXT NOT NULL
  - `category_id`: BLOB NOT NULL @Relation(Ingredient_Category)
  - `quantity`: REAL NOT NULL DEFAULT 0
  - `unit`: TEXT NOT NULL DEFAULT 'kg'
  - `low_stock_threshold`: REAL NOT NULL DEFAULT 0
  - `cost_per_unit`: REAL NOT NULL DEFAULT 0.00
  - `is_deleted`: BOOLEAN NOT NULL DEFAULT 0
- **Example**: `{id: "uuid-blob", name: "Beef", category_id: "category-uuid", quantity: 20, unit: "kg", low_stock_threshold: 5, cost_per_unit: 100.0, is_deleted: false}`

## Dishes_Ingredient

- **Description**: Junction table relating dishes to ingredients.
- **Fields**:
  - `id_dish`: BLOB NOT NULL @Relation(Dish)
  - `id_ingredient`: BLOB NOT NULL @Relation(Ingredient)
  - `quantity`: REAL NOT NULL DEFAULT 1
- **Primary Key**: Composite (id_dish, id_ingredient)
- **Example**: `{id_dish: "dish-uuid", id_ingredient: "ingredient-uuid", quantity: 2}`

## Supplier

- **Description**: Suppliers for ingredients.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `name`: TEXT NOT NULL UNIQUE
  - `contact`: TEXT
  - `phone`: TEXT
  - `email`: TEXT
  - `address`: TEXT
  - `is_deleted`: BOOLEAN NOT NULL DEFAULT 0
- **Example**: `{id: "uuid-blob", name: "Union Butchery", contact: "Sergio Perez", phone: "3325136127", email: "s.perez@cunion.com", address: "Av. Moctezuma 5788", is_deleted: false}`

## Ingredient_Supplier

- **Description**: Junction table relating suppliers to ingredients with purchase details.
- **Fields**:
  - `id_supplier`: BLOB NOT NULL @Relation(Supplier)
  - `id_ingredient`: BLOB NOT NULL @Relation(Ingredient)
  - `date`: TEXT NOT NULL
  - `total_cost`: REAL NOT NULL
  - `quantity`: REAL NOT NULL
- **Primary Key**: Composite (id_supplier, id_ingredient, date)
- **Example**: `{id_supplier: "supplier-uuid", id_ingredient: "ingredient-uuid", date: "2025-05-26", total_cost: 10000.00, quantity: 10}`

## Order

- **Description**: Customer orders.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `user_id`: BLOB NOT NULL @Relation(User)
  - `table_id`: BLOB @Relation(Table)
  - `waiter`: TEXT
  - `status`: TEXT NOT NULL DEFAULT 'open' (open, closed, paid)
  - `total`: REAL NOT NULL DEFAULT 0.00
  - `created_at`: TEXT NOT NULL DEFAULT (datetime('now'))
  - `is_deleted`: BOOLEAN NOT NULL DEFAULT 0
- **Example**: `{id: "uuid-blob", user_id: "user-uuid", table_id: "table-uuid", waiter: "John", status: "open", total: 590.23, created_at: "2025-06-02 15:09", is_deleted: false}`

## Orders_Dishes

- **Description**: Junction table for dishes in orders.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `order_id`: BLOB NOT NULL @Relation(Order)
  - `dish_id`: BLOB NOT NULL @Relation(Dish)
  - `instance_id`: TEXT NOT NULL
  - `quantity`: INTEGER NOT NULL DEFAULT 1
  - `price_at_order`: REAL NOT NULL
  - `notes`: TEXT
- **Example**: `{id: "uuid-blob", order_id: "order-uuid", dish_id: "dish-uuid", instance_id: "inst-123", quantity: 2, price_at_order: 250.00, notes: "no sour cream"}`

## Payment

- **Description**: Payment methods.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `currency`: TEXT NOT NULL
  - `name`: TEXT NOT NULL
- **Example**: `{id: "uuid-blob", currency: "BTC", name: "Bitcoin Lightning"}`

## Ticket

- **Description**: Payment tickets for orders.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `order_id`: BLOB NOT NULL @Relation(Order)
  - `user_id`: BLOB NOT NULL @Relation(User)
  - `ticket_date`: TEXT NOT NULL DEFAULT (datetime('now'))
  - `status`: INTEGER NOT NULL DEFAULT 1
  - `total_amount`: REAL NOT NULL DEFAULT 0.00
  - `notes`: TEXT
- **Example**: `{id: "uuid-blob", order_id: "order-uuid", user_id: "user-uuid", ticket_date: "2025-06-02 15:38", status: 1, total_amount: 780.0, notes: "no spicy"}`

## Tickets_Dish

- **Description**: Junction table for dishes in tickets.
- **Fields**:
  - `id_ticket`: BLOB NOT NULL @Relation(Ticket)
  - `id_dish`: BLOB NOT NULL @Relation(Dish)
  - `quantity`: INTEGER NOT NULL DEFAULT 1
  - `price_at_order`: REAL NOT NULL
  - `notes`: TEXT
- **Primary Key**: Composite (id_ticket, id_dish)
- **Example**: `{id_ticket: "ticket-uuid", id_dish: "dish-uuid", quantity: 2, price_at_order: 250.00, notes: "extra sauce"}`

## Payments_Tickets

- **Description**: Payment records for tickets.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `ticket_id`: BLOB NOT NULL @Relation(Ticket)
  - `payment_date`: TEXT NOT NULL DEFAULT (datetime('now'))
  - `amount`: REAL NOT NULL
  - `payment_method`: BLOB NOT NULL @Relation(Payment)
  - `transaction_id`: TEXT
- **Example**: `{id: "uuid-blob", ticket_id: "ticket-uuid", payment_date: "2025-06-02 15:38", amount: 780.0, payment_method: "payment-uuid", transaction_id: "lnasidasiojn213..."}`

## Shift

- **Description**: Employee work shifts.
- **Fields**:
  - `id`: BLOB @unique (Primary Key)
  - `user_id`: BLOB NOT NULL @Relation(User)
  - `shift_date`: DATE NOT NULL
  - `start_time`: TIME NOT NULL
  - `end_time`: TIME
  - `notes`: VARCHAR(255)
  - `is_deleted`: BOOLEAN NOT NULL DEFAULT 0
- **Example**: `{id: "uuid-blob", user_id: "user-uuid", shift_date: "2025-06-02", start_time: "12:00:00", end_time: "20:00:00", notes: "Missing register", is_deleted: false}`
