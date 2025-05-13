import { useEffect, useState } from 'react';

export function useMockSocket() {
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [tables, setTables] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [restocks, setRestocks] = useState([]);
    const [ingredientCategories, setIngredientCategories] = useState([]);

    useEffect(() => {
        const initialData = {
            roles: [
                { id: 1, role: 'admin', password: 'admin' },
                { id: 2, role: 'manager', password: 'manager' },
                { id: 3, role: 'waiter', password: 'waiter' },
            ],
            users: [
                { id: 1, nombre: 'angel', pin: 1234 },
                { id: 2, nombre: 'jordy', pin: 2345 },
                { id: 3, nombre: 'sara', pin: 3456 },
                { id: 4, nombre: 'regina', pin: 4567 },
                { id: 5, nombre: 'a@b.c', pin: 5678 },
            ],
            rooms: [
                { id: 1, nombre: 'Sala Principal', mesasIds: [1, 2] },
                { id: 2, nombre: 'Terraza', mesasIds: [3] },
            ],
            tables: [
                { id: 1, nombre: 'Mesa 1', pedidoId: null, estado: 'libre' },
                { id: 2, nombre: 'Mesa 2', pedidoId: null, estado: 'libre' },
                { id: 3, nombre: 'Mesa 3', pedidoId: null, estado: 'libre' },
            ],
            dishes: [
                { id: 1, nombre: 'Tacos al Pastor', categoria: 'Mexicana', precio: 80.0, ingredients: [{ id: 1, quantity: 0.2 }, { id: 2, quantity: 0.1 }] },
                { id: 2, nombre: 'Pizza Margarita', categoria: 'Italiana', precio: 120.0, ingredients: [{ id: 3, quantity: 0.3 }] },
                { id: 3, nombre: 'Sushi', categoria: 'Japonesa', precio: 150.0, ingredients: [{ id: 4, quantity: 0.2 }] },
            ],
            categories: ['Mexicana', 'Italiana', 'Japonesa'],
            orders: [
                { id: 1, userId: 1, estado: 'abierto', dishes: [] },
            ],
            ingredients: [
                { id: 1, name: 'Carne', category: 'Carnes', quantity: 20, unit: 'kg', lowStockThreshold: 5, costPerUnit: 100 },
                { id: 2, name: 'Cebolla', category: 'Vegetales', quantity: 30, unit: 'kg', lowStockThreshold: 10, costPerUnit: 20 },
                { id: 3, name: 'Queso', category: 'Lácteos', quantity: 15, unit: 'kg', lowStockThreshold: 5, costPerUnit: 80 },
                { id: 4, name: 'Arroz', category: 'Granos', quantity: 25, unit: 'kg', lowStockThreshold: 8, costPerUnit: 30 },
            ],
            suppliers: [
                { id: 1, name: 'Proveedor A', ingredientIds: [1, 2] },
                { id: 2, name: 'Proveedor B', ingredientIds: [3, 4] },
            ],
            restocks: [
                { id: 1, ingredientId: 1, supplierId: 1, quantity: 10, totalCost: 1000, date: '2025-05-01' },
            ],
            ingredientCategories: ['Carnes', 'Vegetales', 'Lácteos', 'Granos'],
        };

        const timeout = setTimeout(() => {
            setRoles(initialData.roles);
            setUsers(initialData.users);
            setRooms(initialData.rooms);
            setTables(initialData.tables);
            setDishes(initialData.dishes);
            setCategories(initialData.categories);
            setOrders(initialData.orders);
            setIngredients(initialData.ingredients);
            setSuppliers(initialData.suppliers);
            setRestocks(initialData.restocks);
            setIngredientCategories(initialData.ingredientCategories);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    // ROLES
    const addRole = (role) => setRoles((prev) => [...prev, { ...role, id: Date.now() }]);
    const updateRole = (role) => setRoles((prev) => prev.map((r) => (r.id === role.id ? role : r)));
    const deleteRole = (id) => setRoles((prev) => prev.filter((r) => r.id !== id));

    // PLATILLOS
    const addDish = (dish) => setDishes((prev) => [...prev, { ...dish, id: Date.now() }]);
    const updateDish = (dish) => setDishes((prev) => prev.map((d) => (d.id === dish.id ? dish : d)));
    const deleteDish = (id) => setDishes((prev) => prev.filter((d) => d.id !== id));

    // CATEGORÍAS DE PLATILLOS
    const addCategory = (categoria) =>
        setCategories((prev) => (prev.includes(categoria) ? prev : [...prev, categoria]));
    const deleteCategory = (categoria) => {
        setCategories((prev) => prev.filter((c) => c !== categoria));
        setDishes((prev) => prev.map((d) => (d.categoria === categoria ? { ...d, categoria: null } : d)));
    };

    // CATEGORÍAS DE INGREDIENTES
    const addIngredientCategory = (categoria) =>
        setIngredientCategories((prev) => (prev.includes(categoria) ? prev : [...prev, categoria]));
    const deleteIngredientCategory = (categoria) => {
        setIngredientCategories((prev) => prev.filter((c) => c !== categoria));
        setIngredients((prev) => prev.map((i) => (i.category === categoria ? { ...i, category: null } : i)));
    };

    // MESAS
    const addTable = (mesa) => setTables((prev) => [...prev, { ...mesa, id: Date.now() }]);
    const updateTable = (mesa) => setTables((prev) => prev.map((t) => (t.id === mesa.id ? mesa : t)));
    const deleteTable = (id) => setTables((prev) => prev.filter((t) => t.id !== id));

    // SALAS
    const addRoom = (sala) => setRooms((prev) => [...prev, { ...sala, id: Date.now(), mesasIds: sala.mesasIds || [] }]);
    const updateRoom = (sala) => setRooms((prev) => prev.map((r) => (r.id === sala.id ? sala : r)));
    const deleteRoom = (id) => setRooms((prev) => prev.filter((r) => r.id !== id));

    // USUARIOS
    const addUser = (user) => setUsers((prev) => [...prev, { ...user, id: Date.now() }]);
    const updateUser = (user) => setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    const deleteUser = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

    // PEDIDOS
    const addOrder = (order) => {
        const newOrder = { ...order, id: Date.now() };
        setOrders((prev) => [...prev, newOrder]);
        // Restar inventario
        order.dishes.forEach((dishId) => {
            const dish = dishes.find((d) => d.id === dishId);
            if (dish) {
                dish.ingredients.forEach(({ id, quantity }) => {
                    setIngredients((prev) =>
                        prev.map((ing) =>
                            ing.id === id ? { ...ing, quantity: Math.max(0, ing.quantity - quantity) } : ing
                        )
                    );
                });
            }
        });
        return newOrder;
    };
    const updateOrder = (order) => setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    const deleteOrder = (id) => setOrders((prev) => prev.filter((o) => o.id !== id));
    const assignOrderToTable = (mesaId, pedidoId) => {
        setTables((prev) =>
            prev.map((t) => (t.id === mesaId ? { ...t, pedidoId, estado: 'ocupada' } : t))
        );
    };

    // INGREDIENTES
    const addIngredient = (ingredient) =>
        setIngredients((prev) => [...prev, { ...ingredient, id: Date.now() }]);
    const updateIngredient = (ingredient) =>
        setIngredients((prev) => prev.map((i) => (i.id === ingredient.id ? ingredient : i)));
    const deleteIngredient = (id) =>
        setIngredients((prev) => prev.filter((i) => i.id !== id));

    // PROVEEDORES
    const addSupplier = (supplier) =>
        setSuppliers((prev) => [...prev, { ...supplier, id: Date.now() }]);
    const updateSupplier = (supplier) =>
        setSuppliers((prev) => prev.map((s) => (s.id === supplier.id ? supplier : s)));
    const deleteSupplier = (id) =>
        setSuppliers((prev) => prev.filter((s) => s.id !== id));

    // REABASTECIMIENTOS
    const addRestock = (restock) => {
        const newRestock = {
            ...restock,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
        };
        setRestocks((prev) => [...prev, newRestock]);
        // Sumar al stock del ingrediente
        setIngredients((prev) =>
            prev.map((ing) =>
                ing.id === restock.ingredientId
                    ? { ...ing, quantity: ing.quantity + restock.quantity }
                    : ing
            )
        );
        return newRestock;
    };

    return {
        roles, setRoles, addRole, updateRole, deleteRole,
        users, setUsers, addUser, updateUser, deleteUser,
        rooms, setRooms, addRoom, updateRoom, deleteRoom,
        tables, setTables, addTable, updateTable, deleteTable,
        dishes, setDishes, addDish, updateDish, deleteDish,
        categories, setCategories, addCategory, deleteCategory,
        orders, setOrders, addOrder, updateOrder, deleteOrder, assignOrderToTable,
        ingredients, setIngredients, addIngredient, updateIngredient, deleteIngredient,
        suppliers, setSuppliers, addSupplier, updateSupplier, deleteSupplier,
        restocks, setRestocks, addRestock,
        ingredientCategories, setIngredientCategories, addIngredientCategory, deleteIngredientCategory,
    };
}