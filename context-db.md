# Database context

## User
- **Description**: Users of the system.
- **Fields**:
    - `id`: number @unique UUID
    - `name`: string (255)
    - `pin`: number (6)
- **Example**: `{id: 1, name: "Angel", pin: 123456}`

## Role
- **Description**: Role of system.
- **Fields**:
    - `id`: number @unique
    - `name`: string (255)
    - `description`: string (255)
- **Example**: `{id: 1, role: "admin", description: "Role for Administration"}`

## Role_User
- **Description**: Relation User Role.
- **Fields**:
    - `id_user`: number @Relation(User)
    - `id_role`: number @Relation(Role)
- **Example**: `{id_user: 1, id_role:1}`

## Dishes
- **Description**: Dishes for Menu.
- **Fields**:
    - `id`: number @unique
    - `name`: string (255)
    - `price`: number
- **Example**: `{id: 1, name: "Tacos al Pastor", category_id: 1, price: 80.0}`

## Dishes_Ingredient
- **Description**: Relation Dishes Ingredients.
- **Fields**:
    - `id_dish`: number @Relation(dishes)
    - `id_ingredient`: number @Relation(ingredient)
    - `quantity`: number
    - `unit`: string
- **Example**: `{id_dish: 1, id_ingredient: 1, quantity: 2, unit: "kg"}`


## Dishes_Category
- **Description**: Categories of dishes.
- **Fields**:
    -`id`: number @unique
    -`name`: string
- **Example**: `{id: 1, name: "Mexicana"}`

## Ingredient 
- **Description**: Ingredient on stock.
- **Fields**: 
    - `id`: number @unique
    - `name`: string
    - `quantity`: number
    - `unit`: string
    - `lowStockThreshold`: number
    - `costPerUnit`: number
- **Example**: `{id: 1, name: "Peinecillo", quantity: 20, unit: "kg", lowStockThreshold: 5, costPerUnit: 100}`

## Category_Ingredients
- **Description**: Category of ingredients.
- **Fields**:
    - `id`: number @unique
    - `name`: string
- **Example**: `{id: 1, name: "Carnes"}`

## Ingredient_Category
- **Description**: Relation Category with Ingredient.
- **Fields**: 
    - `id_category_ingredient`: number @Relation(category_ingredient)
    - `id_ingredient`: number @Relation(ingredient)
- **Example**: `{id_category_ingredient: 1, id_ingredient: 1}`

## Supplier
- **Description**: Suppliers for ingredients.
- **Fields**:
    - `id`: number @unique
    - `name`: string
    - `contact`: string
    - `phone`: number
    - `email`: string
    - `address`: string
- **Example**: `{id: 1, name: "Carniceria Union", contact: "Sergio Perez", phone: "3325136127", email: "s.perez@cunion.com", address: "Av. Moctezuma 5788, Col. Ciudad del Sol"}`

## Ingredient_Supplier
- **Description**: Relation Suppliers with Ingredients.
- **Fields**:
    - `id_supplier`: number @Relation(supplier)
    - `id_ingredient`: number @Relation(ingredient)
    - `date`: date
    - `totalCost`: number
    - `quantity`: number
- **Example**: `{id_supplier: 1, id_ingredient: 1, date: "2025-05-26", totalCost: 10000.00, quantity: 10`}
