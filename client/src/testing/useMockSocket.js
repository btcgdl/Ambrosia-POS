import { useEffect, useState } from 'react';

export function useMockSocket() {
    const [rooms, setRooms] = useState([]);
    const [tables, setTables] = useState([]);
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        // Simulamos los datos iniciales
        const initialData = {
            rooms: [
                { id: 1, nombre: 'Sala Principal', mesasIds: [1, 2] },
                { id: 2, nombre: 'Terraza', mesasIds: [3] },
            ],
            tables: [
                { id: 1, nombre: 'Mesa 1', pedidoId: 101, estado: 'ocupada' },
                { id: 2, nombre: 'Mesa 2', pedidoId: null, estado: 'libre' },
                { id: 3, nombre: 'Mesa 3', pedidoId: 102, estado: 'ocupada' },
            ],
            dishes: [
                { id: 1, nombre: 'Tacos al Pastor', categoria: 'Mexicana', precio: 80.0 },
                { id: 2, nombre: 'Pizza Margarita', categoria: 'Italiana', precio: 120.0 },
                { id: 3, nombre: 'Sushi', categoria: 'Japonesa', precio: 150.0 },
            ]
        };

        // Simula conexión WebSocket
        const timeout = setTimeout(() => {
            setRooms(initialData.rooms);
            setTables(initialData.tables);
            setDishes(initialData.dishes);
        }, 1000); // Simula el retraso de conexión

        // Simulación de actualización de datos cada 5 segundos
        const interval = setInterval(() => {
            setTables((prev) =>
                prev.map((mesa) =>
                    mesa.id === 2 ? { ...mesa, estado: 'ocupada', pedidoId: 103 } : mesa
                )
            );
        }, 5000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    return { rooms: rooms, tables: tables, dishes: dishes };
}
