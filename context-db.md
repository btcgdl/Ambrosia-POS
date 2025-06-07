# Database context

## User
- **Description**: Users of the system.
- **Fields**:
    - `id`: UUID @unique
    - `name`: string (255)
    - `pin`: number (6)
- **Example**: `{id: 1, name: "Angel", pin: 123456}`

## Role
- **Description**: Role of system.
- **Fields**:
    - `id`: UUID @unique
    - `name`: string (255)
    - `description`: string (255)
- **Example**: `{id: 1, name: "admin", description: "Role for Administration"}`

## Role_User
- **Description**: Relation User Role.
- **Fields**:
    - `id_user`: UUID @Relation(User)
    - `id_role`: UUID @Relation(Role)
- **Example**: `{id_user: 1, id_role:1}`

## Dishes
- **Description**: Dishes for Menu.
- **Fields**:
    - `id`: UUID @unique
    - `name`: string (255)
    - `price`: decimal (10,2)
- **Example**: `{id: 1, name: "Tacos al Pastor", price: 80.0}`

## Dishes_Ingredient
- **Description**: Relation Dishes Ingredients.
- **Fields**:
    - `id_dish`: UUID @Relation(dishes)
    - `id_ingredient`: UUID @Relation(ingredient)
    - `quantity`: number
- **Example**: `{id_dish: 1, id_ingredient: 1, quantity: 2}`


## Dishes_Category
- **Description**: Categories of dishes.
- **Fields**:
    -`id`: UUID @unique
    -`name`: string
- **Example**: `{id: 1, name: "Mexicana"}`

## Ingredient 
- **Description**: Ingredient on stock.
- **Fields**: 
    - `id`: UUID @unique
    - `name`: string
    - `quantity`: number
    - `lowStockThreshold`: number
    - `costPerUnit`: decimal(10,2)
- **Example**: `{id: 1, name: "Peinecillo", quantity: 20, lowStockThreshold: 5, costPerUnit: 100}`

## Category_Ingredients
- **Description**: Category of ingredients.
- **Fields**:
    - `id`: UUID @unique
    - `name`: string
- **Example**: `{id: 1, name: "Carnes"}`

## Ingredient_Category
- **Description**: Relation Category with Ingredient.
- **Fields**: 
    - `id_category_ingredient`: UUID @Relation(category_ingredient)
    - `id_ingredient`: UUID @Relation(ingredient)
- **Example**: `{id_category_ingredient: 1, id_ingredient: 1}`

## Supplier
- **Description**: Suppliers for ingredients.
- **Fields**:
    - `id`: UUID @unique
    - `name`: string
    - `contact`: string
    - `phone`: number
    - `email`: string
    - `address`: string
- **Example**: `{id: 1, name: "Carniceria Union", contact: "Sergio Perez", phone: "3325136127", email: "s.perez@cunion.com", address: "Av. Moctezuma 5788, Col. Ciudad del Sol"}`

## Ingredient_Supplier
- **Description**: Relation Suppliers with Ingredients.
- **Fields**:
    - `id_supplier`: UUID @Relation(supplier)
    - `id_ingredient`: UUID @Relation(ingredient)
    - `date`: date
    - `totalCost`: decimal(10,2)
    - `quantity`: number
- **Example**: `{id_supplier: 1, id_ingredient: 1, date: "2025-05-26", totalCost: 10000.00, quantity: 10`}

## Order
- **Description**: Table for orders.
- **Fields**:
    - `id`: UUID @unique
    - `id_user`: UUID @Relation(user)
    - `order_date`: datetime
    - `status`: number
    - `total_amount`: decimal(10,2)
    - `notes`: string
- **Example**: `{id: 1, id_user: 1, order_date: 2025-06-02 15:09, status: 2, total_amount: 590.23, notes: "sin chile"`}

## Order_Dish
- **Description**: Table for dishes.
- **Fields**:
    - `id`: UUID @unique
    - `id_order` UUID @Relation(order)
    - `id_dish`: UUID @Relation(dishes)
    - `quantity`: number
    - `price_at_order`: decimal(10,2)
    - `notes`: string
- **Example**: `{id: 1, id_order: 1, id_dish: 1, quantity: 2,price_at_order: 250.00, notes: "no tanta crema"`}

## Payments_Order
- **Description**: Table for payments for orders.
- **Fields**:
    - `id`: UUID @unique
    - `id_order`: UUID @Relation(order)
    - `payment_date`: datetime
    - `amount`: decimal(10,2)
    - `payment_method`: uuid @Relation(payment)
    - `transaction_id`: string
- **Example**: `{id: 1, id_order: 1, payment_date: 2025-06-02 15:38, amount: 780.0, payment_method: 1, transaction_id: lnasidasiojn213...`}

## Payment
- **Description**: Table for payment method
- **Fields**:
    - `id`: UUID @unique
    - `currency`: decimal(10,2)
    - `name`: string
- **Example**: `{id: 1, currency: 12.00, name: "Satoshis! :)"`}


