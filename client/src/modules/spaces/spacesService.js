import { apiClient } from '../../services/apiClient';
import { mockService } from '../../useMockSocket';

export async function getRooms() {
    try {
        return await apiClient('/spaces');
    } catch (error) {
        return { data: mockService.getRooms() };
    }
}

export async function addRoom(room) {
    try {
        return await apiClient('/spaces', {
            method: 'POST',
            body: room,
        });
    } catch (error) {
        if (mockService.getRooms().some((r) => r.nombre === room.nombre)) {
            throw new Error('La sala ya existe');
        }
        return mockService.addRoom({ ...room, mesasIds: [] });
    }
}

export async function updateRoom(room) {
    try {
        return await apiClient(`/spaces/${room.id}`, {
            method: 'PATCH',
            body: room,
        });
    } catch (error) {
        const rooms = mockService.getRooms();
        const roomExists = rooms.find((r) => r.id === room.id);
        if (!roomExists) throw new Error('Sala no encontrada');
        if (rooms.some((r) => r.nombre === room.nombre && r.id !== room.id)) {
            throw new Error('La sala ya existe');
        }
        return mockService.updateRoom(room);
    }
}

export async function deleteRoom(roomId) {
    try {
        return await apiClient(`/spaces/${roomId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        return mockService.deleteRoom(roomId);
    }
}

export async function getTables() {
    try {
        return await apiClient('/tables');
    } catch (error) {
        return { data: mockService.getTables() };
    }
}

export async function addTable(table) {
    try {
        return await apiClient('/tables', {
            method: 'POST',
            body: table,
        });
    } catch (error) {
        return mockService.addTable(table);
    }
}

export async function updateTable(table) {
    try {
        return await apiClient(`/tables/${table.id}`, {
            method: 'PATCH',
            body: table,
        });
    } catch (error) {
        const tables = mockService.getTables();
        const tableExists = tables.find((t) => t.id === table.id);
        if (!tableExists) throw new Error('Mesa no encontrada');
        return mockService.updateTable(table);
    }
}

export async function deleteTable(tableId) {
    try {
        return await apiClient(`/tables/${tableId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        const tables = mockService.getTables();
        const table = tables.find((t) => t.id === tableId);
        if (!table) throw new Error('Mesa no encontrada');
        if (table.pedidoId) throw new Error('No se puede eliminar una mesa con un pedido activo');
        return mockService.deleteTable(tableId);
    }
}