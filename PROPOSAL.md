# Restaurant Point of Sale System

## General Description

The described system is a point of sale (POS) application for restaurants.
The system's frontend uses **React** and **Electron** to provide a modern and reactive experience in desktop environments. Additionally, the backend is developed in Kotlin with support for **Gradle** as a build tool.

This system is designed to optimize the daily operations of a restaurant, such as managing orders, tables, inventory, and finances, with a modern and reactive interface. The system modules are detailed below, considering the requested features: login, table selection, order history, user management and permission assignment, inventory management (including products, supplies, suppliers, and recipes), dish creation, ticket printing, fund withdrawal, cash closing, and support for Bitcoin payments via the **Lightning Network**.

## Main Modules

### Authentication
- **Purpose**: Manage secure user access to the system through authentication and session handling.
- **Features**:
  - Login screen with credentials (username and password).
  - Support for different user roles (administrator, supervisor, waiter).
  - Management of active sessions and logout options.

### User Management
- **Purpose**: Manage employee accounts and assign roles to users.
- **Features**:
  - Create, edit, and delete user accounts.
  - Assign specific roles and permissions (e.g., access to menu management, inventory management, or fund withdrawal).
  - **User Roles**:
    - Administrator
    - Supervisor
    - Waiter

### Table Management
- **Purpose**: Manage the restaurant's tables, their status, and assignment.
- **Features**:
  - Visualization of the restaurant layout with table statuses (available, occupied).
  - Assignment of tables to orders and real-time updates.
  - Visual interface for quick table selection.

### Inventory Management
- **Purpose**: Manage the restaurant's products, supplies, and suppliers, as well as stock control.
- **Features**:
  - **Inventory Control**: Record entries and exits of products and supplies. Track stock levels.
  - **Products**: Manage the inventory of finished or resale products.
  - **Supply Presentations**: Define and manage units of measurement (presentations) for different ingredients and materials (e.g., grams, kilos, liters, units).
  - **Inventory Suppliers**: Register and manage information for product and supply providers.
  - **Recipes**: Define recipes for dishes, specifying the necessary supplies and their quantities.
    - **Recipe Generation by Deducting from Inventory**: When a dish is sold, the system automatically deducts the corresponding supplies from the inventory according to its recipe.

### Menu Management
- **Purpose**: Manage the dishes available on the restaurant's menu.
- **Features**:
  - Add, edit, and delete dishes with details (name, description, price, category).
  - Association of dishes with recipes defined in Inventory Management.
  - Organization of dishes by categories to facilitate navigation.

### Order Management
- **Purpose**: Register, track, and store customer orders, including a history for queries.
- **Features**:
  - Taking orders associated with tables or for takeout.
  - Adding menu dishes to orders, linking with recipes.
  - Tracking the order status (pending, in preparation, served, paid).
  - Order history for reports and queries.

### Point of Sale
- **Purpose**: Process payments and generate tickets for customers.
- **Features**:
  - Processing of cash and Bitcoin payments.
  - Generation and printing of tickets for customers and kitchen.
  - Handling of returns or cancellations.
  - **Integration with physical cash register**: Opening and closing of the physical cash register controlled by the system.

### Financial Management
- **Purpose**: Handle the restaurant's financial transactions, including fund withdrawal and cash closing.
- **Features**:
  - Recording of daily income and expenses.
  - Withdrawal of funds from the Lightning wallet.
  - **Cash Closing**: End-of-shift or end-of-day process, recording total sales, cash on hand, card transactions, and other payment methods to verify and balance the amounts.
  - Generation of financial reports (daily or monthly income, cash closing report).

### Web Point of Sale
- **Purpose**: Provide a web interface to generate Lightning Network invoices, allowing Bitcoin payments.
- **Features**:
  - Connection to a Lightning web wallet via NWC in read-only mode.
  - Generation of invoices for Bitcoin payments.
  - Visualization of payment status.
  - Integration with Order Management to associate payments with orders.
