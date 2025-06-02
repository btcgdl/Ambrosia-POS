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
