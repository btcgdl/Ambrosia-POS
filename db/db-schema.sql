-- Create table for user
CREATE TABLE User (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    pin INT NOT NULL CHECK (pin >= 100000 AND pin <= 999999) -- PIN 6 digits
);

-- Create table role
CREATE TABLE Role (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255)
);

-- Create table role_user
CREATE TABLE Role_User (
    id_user UUID,
    id_role UUID,
    PRIMARY KEY (id_user, id_role), 
    FOREIGN KEY (id_user) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (id_role) REFERENCES Role(id) ON DELETE CASCADE
);

-- Create table dishes_category
CREATE TABLE Dishes_Category (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create table dishes
CREATE TABLE Dishes (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
   );


-- Create table ingredient
CREATE TABLE Ingredient (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0),
    lowStockThreshold DECIMAL(10,2) NOT NULL CHECK (lowStockThreshold >= 0),
    costPerUnit DECIMAL(10,2) NOT NULL CHECK (costPerUnit >= 0)
);

-- Create table dishes_ingredient
CREATE TABLE Dishes_Ingredient (
    id_dish UUID,
    id_ingredient UUID,
    quantity INT NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (id_dish, id_ingredient),
    FOREIGN KEY (id_dish) REFERENCES Dishes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES Ingredient(id) ON DELETE CASCADE
);

-- Create table category_ingredients
CREATE TABLE Category_Ingredients (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create table ingredient_category
CREATE TABLE Ingredient_Category (
    id_category_ingredient UUID,
    id_ingredient UUID,
    PRIMARY KEY (id_category_ingredient, id_ingredient),
    FOREIGN KEY (id_category_ingredient) REFERENCES Category_Ingredients(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES Ingredient(id) ON DELETE CASCADE
);

-- Create table supplier
CREATE TABLE Supplier (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address VARCHAR(255)
);

-- Create table ingredient_supplier 
CREATE TABLE Ingredient_Supplier (
    id_supplier UUID,
    id_ingredient UUID,
    date DATE NOT NULL,
    totalCost DECIMAL(10,2) NOT NULL CHECK (totalCost >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (id_supplier, id_ingredient, date),
    FOREIGN KEY (id_supplier) REFERENCES Supplier(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ingredient) REFERENCES Ingredient(id) ON DELETE CASCADE
);
