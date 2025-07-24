import {apiClient} from '../../services/apiClient';


export async function getAllOrders() {
    const response = await apiClient('/orders');
    return response ? response : [];
}

export async function getOrders() {
    return await apiClient('/orders');
}

export async function addOrder(order) {
    return await apiClient('/orders', {
        method: 'POST',
        body: order,
    });
}

export async function getUsers() {
    return await apiClient('/users');
}

export async function getUserById(userId) {
    const response = await apiClient(`/users/${userId}`);
    return response;
}

export async function getTables() {
    const response = await apiClient('/tables');
    return response  ? response : [];
}

export async function createOrderInTable(tableId) {
    return await createOrder()
}

export async function getOrderById(orderId) {
    const response = await apiClient(`/orders/${orderId}`);
    return response;
}

export async function createOrder(tableId = null) {
    //localStorage.setItem('userId', "");
    if (!localStorage.getItem('userId')) {
        throw new Error('No hay usuario logeado');
    }
    const response = await getUserById(localStorage.getItem('userId'));
    //const response = {id: localStorage.getItem('userId'), name: "JordyArreglaLaDBConnection"};
    if (response){
        const body = {
            user_id: response.id,
            waiter: response.name,
            status: "open",
            total: 0,
            created_at: Date.now(),
        }
        if (tableId) body.table_id = tableId;
        return await apiClient('/orders', {
            method: 'POST',
            body: body,
        });
    }
    else{

    }
}

export async function addDishToOrder(pedidoId, dish) {
    return await apiClient(`/orders/${pedidoId}/dishes`, {
        method: 'POST',
        body: [{
            dish_id: dish.id,
            price_at_order: dish.price,
            notes: "none"
        }]
    });
}

export async function removeDishToOrder(pedidoId, dish) {
    return await apiClient(`/orders/${pedidoId}/dishes/${dish}`, {
        method: 'DELETE',
    })
}

export async function getDishesByOrder(orderId) {
    const dishes = await apiClient(`/orders/${orderId}/dishes`);
    return dishes ? dishes : [];
}

/*export async function createOrder(pin, tableId = null) {
    try {
        const pinValidation = await validatePin(pin);
        if (!pinValidation.authorized) {
            throw new Error(pinValidation.error);
        }

        const orderId = Date.now();

        const newOrder = {
            id: Number(`${orderId}`),
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
            await updateTable(Number(tableId), { pedidoId: Number(`${orderResponse.id}`), estado: 'ocupada' });
            console.log(orderId);
        }

        console.log(orderResponse);
        return { data: orderResponse };
    } catch (error) {
        throw new Error(error.message || 'Error al crear el pedido');
    }
}*/

export async function updateOrder(order) {
    return await apiClient(`/orders/${order.id}`, {
        method: 'PUT',
        body: order,
    });
}

export async function updateTable(table) {
    table.status = "available"
    table.order_id = null
    return await apiClient(`/tables/${table.id}`, {
        method: 'PUT',
        body: table,
    });
}

export async function addTicket(ticket) {
    return await apiClient('/tickets', {
        method: 'POST',
        body: ticket,
    });
}

export async function updateTicket(ticketId, updatedTicket) {
    return await apiClient(`/tickets/${ticketId}`, {
        method: 'PATCH',
        body: updatedTicket,
    });
}

export async function getTicketByOrderId(orderId) {
    return await apiClient(`/get-ticket-by-order-id/${orderId}`, {});
}