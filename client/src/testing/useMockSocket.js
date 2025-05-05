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
                { id: 1, role: 'admin', nombre: 'angel', password: 'pass' },
                { id: 2, role: 'admin', nombre: 'jordy', password: 'pass' },
                { id: 3, role: 'waiter', nombre: 'sara', password: 'pass' },
                { id: 4, role: 'waiter', nombre: 'regina', password: 'pass' },
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

    return {
        users, setUsers,
        rooms, setRooms,
        tables, setTables,
        dishes, setDishes,
        categories, setCategories,

        addDish, updateDish, deleteDish,
        addCategory, deleteCategory,
        addTable, updateTable, deleteTable,
        addRoom, updateRoom, deleteRoom,
        addUser, updateUser, deleteUser,
    };
}
