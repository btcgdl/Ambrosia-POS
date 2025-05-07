import { useEffect, useState } from 'react';

export function useMockSocket() {
    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [tables, setTables] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const initialData = {
            users: [
                { id: 1, role: 'admin', nombre: 'angel', password: 'pass' , pin: 1234},
                { id: 2, role: 'admin', nombre: 'jordy', password: 'pass' , pin: 2345},
                { id: 3, role: 'waiter', nombre: 'sara', password: 'pass' , pin: 3456},
                { id: 4, role: 'waiter', nombre: 'regina', password: 'pass' , pin: 4567},
                { id: 5, role: 'admin', nombre: 'a@b.c', password: 'chabelo' , pin: 5678},
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
                { id: 1, nombre: 'Tacos al Pastor', categoria: 'Mexicana', precio: 80.0 },
                { id: 2, nombre: 'Pizza Margarita', categoria: 'Italiana', precio: 120.0 },
                { id: 3, nombre: 'Sushi', categoria: 'Japonesa', precio: 150.0 },
            ],
            categories: ['Mexicana', 'Italiana', 'Japonesa'],
            orders: [
                { id: 1, userId: 1, estado: 'abierto', dishes:[] },
            ],
        };

        const timeout = setTimeout(() => {
            setUsers(initialData.users);
            setRooms(initialData.rooms);
            setTables(initialData.tables);
            setDishes(initialData.dishes);
            setCategories(initialData.categories);
        }, 500); // Carga inicial simulada

        return () => clearTimeout(timeout);
    }, []);

    // PLATILLOS
    const addDish = (dish) => setDishes(prev => [...prev, { ...dish, id: Date.now() }]);
    const updateDish = (dish) =>
        setDishes(prev => prev.map(d => d.id === dish.id ? dish : d));
    const deleteDish = (id) =>
        setDishes(prev => prev.filter(d => d.id !== id));

    // CATEGORÍAS
    const addCategory = (categoria) =>
        setCategories(prev => prev.includes(categoria) ? prev : [...prev, categoria]);
    const deleteCategory = (categoria) => {
        setCategories(prev => prev.filter(c => c !== categoria));
        setDishes(prev => prev.map(d => d.categoria === categoria ? { ...d, categoria: null } : d));
    };

    // MESAS
    const addTable = (mesa) => setTables(prev => [...prev, { ...mesa, id: Date.now() }]);
    const updateTable = (mesa) =>
        setTables(prev => prev.map(t => t.id === mesa.id ? mesa : t));
    const deleteTable = (id) =>
        setTables(prev => prev.filter(t => t.id !== id));

    // SALAS
    const addRoom = (sala) => setRooms(prev => [...prev, { ...sala, id: Date.now(), mesasIds: sala.mesasIds || [] }]);
    const updateRoom = (sala) =>
        setRooms(prev => prev.map(r => r.id === sala.id ? sala : r));
    const deleteRoom = (id) =>
        setRooms(prev => prev.filter(r => r.id !== id));

    // USERS
    const addUser = (user) =>
        setUsers(prev => [...prev, { ...user, id: Date.now() }]);

    const updateUser = (user) =>
        setUsers(prev => prev.map(u => u.id === user.id ? user : u));

    const deleteUser = (id) =>
        setUsers(prev => prev.filter(u => u.id !== id));

    // PEDIDOS
    const addOrder = (order) => {
        const newOrder = { ...order, id: Date.now() };
        setOrders(prev => [...prev, newOrder]);
        return newOrder; // Importante para obtener el ID después de crear
    };

    const updateOrder = (order) => {
        setOrders(prev => prev.map(o => o.id === order.id ? order : o));
    };

    const deleteOrder = (id) => {
        setOrders(prev => prev.filter(o => o.id !== id));
    };

    const assignOrderToTable = (mesaId, pedidoId) => {
                setTables(prev =>
            prev.map(t =>
                t.id === mesaId
                    ? { ...t, pedidoId, estado: 'ocupada' }
                    : t
            )
        );
    };

    return {
        users, setUsers,
        rooms, setRooms,
        tables, setTables,
        dishes, setDishes,
        categories, setCategories,
        orders, setOrders,

        addDish, updateDish, deleteDish,
        addCategory, deleteCategory,
        addTable, updateTable, deleteTable,
        addRoom, updateRoom, deleteRoom,
        addUser, updateUser, deleteUser,
        addOrder, updateOrder, deleteOrder, assignOrderToTable
    };
}
