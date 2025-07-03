import { apiClient } from '../../services/apiClient';
import { mockService } from '../../useMockSocket';
import { validatePin } from '../auth/authService';

export async function getAllOrders() {
    try {
        const response = await apiClient('/orders?include=users,tables');
        return response;
    } catch (error) {
        const orders = mockService.getOrders();
        const users = mockService.getUsers();
        const tables = mockService.getTables();

        const combinedOrders = orders.map((order) => {
            const user = users.find((u) => u.id === order.userId);
            const mozo = user ? user.nombre : 'Desconocido';
            const table = tables.find((t) => t.pedidoId === order.id);
            const tableName = table ? table.nombre : 'Sin mesa';
            const total = order.dishes?.reduce((sum, item) => sum + (item.dish?.precio || 0), 0) || 0;

            return {
                id: order.id,
                estado: order.estado,
                dishes: order.dishes,
                total,
                mozo,
                table: tableName,
            };
        });

        return { data: combinedOrders };
    }
}

export async function getOrders() {
    try {
        return await apiClient('/orders');
    } catch (error) {
        return { data: mockService.getOrders() };
    }
}

export async function addOrder(order) {
    try {
        return await apiClient('/orders', {
            method: 'POST',
            body: order,
        });
    } catch (error) {
        return mockService.addOrder(order);
    }
}

export async function getUsers() {
    try {
        return await apiClient('/users');
    } catch (error) {
        return { data: mockService.getUsers() };
    }
}

export async function getUserById(userId) {
    try {
        const response = await apiClient(`/users/${userId}`);
        return response;
    } catch (error) {
        const user = mockService.getUsers().find((u) => u.id === Number(userId));
        if (!user) throw new Error('Usuario no encontrado');
        return { data: user };
    }
}

export async function getTables() {
    try {
        return await apiClient('/spaces/tables');
    } catch (error) {
        return { data: mockService.getTables() };
    }
}

export async function getOrderById(orderId) {
    try {
        const response = await apiClient(`/orders/${orderId}?include=users,tables`);
        return response;
    } catch (error) {
        const order = mockService.getOrders().find((o) => o.id === Number(orderId));
        if (!order) throw new Error('Pedido no encontrado');
        const users = mockService.getUsers();
        const tables = mockService.getTables();

        const user = users.find((u) => u.id === order.userId);
        const mozo = user ? user.nombre : 'Desconocido';
        const table = tables.find((t) => t.pedidoId === order.id);
        const tableName = table ? table.nombre : 'Sin mesa';
        const total = order.dishes?.reduce((sum, item) => sum + (item.dish?.precio || 0), 0) || 0;

        return {
            data: {
                id: order.id,
                userId: order.userId,
                estado: order.estado,
                dishes: order.dishes || [],
                total,
                mozo,
                table: tableName,
            },
        };
    }
}

export async function getDishes() {
    try {
        return await apiClient('/dishes');
    } catch (error) {
        return { data: mockService.getDishes() };
    }
}

export async function getCategories() {
    try {
        return await apiClient('/dishes/categories');
    } catch (error) {
        return { data: mockService.getCategories() };
    }
}

export async function createOrder(pin, tableId = null) {
    try {
        const pinValidation = await validatePin(pin);
        if (!pinValidation.authorized) {
            throw new Error(pinValidation.error);
        }

        const newOrder = {
            id: Number(`${Date.now()}`),
            userId: pinValidation.userId,
            dishes: [],
            estado: 'abierto',
            createdAt: new Date().toISOString(),
        };

        const orderResponse = await addOrder(newOrder);

        if (tableId) {
            const tables = (await getTables()).data;
            const table = tables.find((t) => t.id === Number(tableId));
            if (!table) throw new Error('Mesa no encontrada');
            if (table.estado !== 'libre') throw new Error('La mesa no está libre');
            await updateTable(Number(tableId), { pedidoId: newOrder.id, estado: 'ocupada' });
        }

        return { data: orderResponse };
    } catch (error) {
        throw new Error(error.message || 'Error al crear el pedido');
    }
}

export async function updateOrder(orderId, updatedOrder) {
    try {
        return await apiClient(`/orders/${orderId}`, {
            method: 'PATCH',
            body: updatedOrder,
        });
    } catch (error) {
        const orders = mockService.getOrders();
        const orderIndex = orders.findIndex((o) => o.id === Number(orderId));
        if (orderIndex === -1) throw new Error('Pedido no encontrado');

        const newOrders = [...orders];
        newOrders[orderIndex] = { ...newOrders[orderIndex], ...updatedOrder };
        mockService.addOrder(newOrders[orderIndex]);

        const users = mockService.getUsers();
        const tables = mockService.getTables();
        const updated = newOrders[orderIndex];
        const user = users.find((u) => u.id === updated.userId);
        const mozo = user ? user.nombre : 'Desconocido';
        const table = tables.find((t) => t.pedidoId === updated.id);
        const tableName = table ? table.nombre : 'Sin mesa';
        const total = updated.dishes?.reduce((sum, item) => sum + (item.dish?.precio || 0), 0) || 0;

        return {
            data: {
                id: updated.id,
                userId: updated.userId,
                estado: updated.estado,
                dishes: updated.dishes || [],
                total,
                mozo,
                table: tableName,
            },
        };
    }
}

export async function updateTable(tableId, updatedTable) {
    try {
        return await apiClient(`/spaces/tables/${tableId}`, {
            method: 'PATCH',
            body: updatedTable,
        });
    } catch (error) {
        const tables = mockService.getTables();
        const tableIndex = tables.findIndex((t) => t.id === Number(tableId));
        if (tableIndex === -1) throw new Error('Mesa no encontrada');

        const newTables = [...tables];
        newTables[tableIndex] = { ...newTables[tableIndex], ...updatedTable };
        mockService.addTable(newTables[tableIndex]);
        return { data: newTables[tableIndex] };
    }
}

export async function addTicket(ticket) {
    try {
        return await apiClient('/tickets', {
            method: 'POST',
            body: ticket,
        });
    } catch (error) {
        return mockService.addTicket(ticket);
    }
}

export async function updateTicket(ticketId, updatedTicket) {
    try {
        return await apiClient(`/tickets/${ticketId}`, {
            method: 'PATCH',
            body: updatedTicket,
        });
    } catch (error) {
        const tickets = mockService.getTickets();
        const ticketIndex = tickets.findIndex((t) => t.id === Number(ticketId));
        if (ticketIndex === -1) throw new Error('Ticket no encontrado');

        const updated = { ...tickets[ticketIndex], ...updatedTicket };
        mockService.addTicket(updated);
        return { data: updated };
    }
}

export async function getTicketByOrderId(orderId) {
    try {
        return await apiClient(`/get-ticket-by-order-id/${orderId}`, {});
    } catch (error) {
        const ticket = mockService.getTicketByOrderId(orderId);
        return {data: ticket};
    }
}