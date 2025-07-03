const initialData = {
    roles: [
        { id: 1, role: 'admin', password: 'admin' },
        { id: 2, role: 'manager', password: 'manager' },
        { id: 3, role: 'waiter', password: 'waiter' },
    ],
    users: [
        { id: 1, nombre: 'angel', pin: 1234 },
        { id: 2, nombre: 'jordy', pin: 2345 },
    ],
    dishes: [
        { id: 1, nombre: 'Tacos al Pastor', categoria: 'Mexicana', precio: 80.0, ingredients: [] },
        { id: 2, nombre: 'Pizza Margarita', categoria: 'Italiana', precio: 120.0, ingredients: [] },
    ],
    categories: ['Mexicana', 'Italiana'],
    orders: [
        {
            id: 1,
            userId: 1,
            estado: 'abierto',
            dishes: [{ instanceId: '1_123456', dish: { id: 1, nombre: 'Tacos al Pastor', precio: 80.0 } }],
        },
    ],
    ingredients: [
        { id: "1", name: 'Carne', category: 'Carnes', quantity: 20, unit: 'kg', lowStockThreshold: 5, costPerUnit: 100 },
        { id: "2", name: 'Cebolla', category: 'Vegetales', quantity: 30, unit: 'kg', lowStockThreshold: 10, costPerUnit: 20 },
    ],
    suppliers: [
        { id: "1", name: 'Proveedor A', ingredientIds: ["1", "2"] },
    ],
    restocks: [
        {
            id: "1",
            supplierId: "1",
            date: '2025-05-01',
            items: [
                { ingredientId: "1", quantity: 10, cost: 1000 },
                { ingredientId: "2", quantity: 5, cost: 100 },
            ],
            totalCost: 1100,
        },
    ],
    ingredientCategories: ['Carnes', 'Vegetales'],
    rooms: [
        { id: 1, nombre: 'Sala Principal', mesasIds: [1, 2] },
    ],
    tables: [
        { id: 1, nombre: 'Mesa 1', pedidoId: 1, estado: 'ocupada' },
        { id: 2, nombre: 'Mesa 2', pedidoId: null, estado: 'libre' },
    ],
    cash: [
        { id: 1, date: '2025-05-01', amount: 1000, type: 'ingreso', description: 'Venta inicial' },
    ],
    turnOpen:false,
    tickets: [
        {
            id: 1,
            orderId: 1,
            date: "2025-06-21",
            amount: 1000,
            paymentMethod: "Efectivo",
            userName: "Angel",
            status: "paid",
        },
    ],
};

let state = { ...initialData };

export const mockService = {
    getRoles: () => state.roles,
    addRole: (role) => {
        const newRole = { ...role, id: Date.now() };
        state.roles = [...state.roles, newRole];
        return newRole;
    },
    updateRole: (role) => {
        const updatedRole = { ...role };
        state.roles = state.roles.map((r) => (r.id === role.id ? updatedRole : r));
        return updatedRole;
    },
    deleteRole: (roleId) => {
        state.roles = state.roles.filter((r) => r.id !== roleId);
        return roleId;
    },
    getUsers: () => state.users,
    addUser: (user) => {
        const pinAsInt = parseInt(user.pin, 10);
        if (isNaN(pinAsInt)) {
            throw new Error('El PIN debe ser un número válido');
        }
        const newUser = { ...user, pin: pinAsInt, id: Date.now() };
        state.users = [...state.users, newUser];
        return newUser;
    },
    updateUser: (user) => {
        const pinAsInt = parseInt(user.pin, 10);
        if (isNaN(pinAsInt)) {
            throw new Error('El PIN debe ser un número válido');
        }
        const updatedUser = { ...user, pin: pinAsInt };
        state.users = state.users.map((u) => (u.id === user.id ? updatedUser : u));
        return updatedUser;
    },
    deleteUser: (id) => {
        state.users = state.users.filter(u => u.id !== id);
        return id;
    },
    getDishes: () => state.dishes,
    addDish: (dish) => {
        const newDish = { ...dish, id: Date.now() };
        state.dishes = [...state.dishes, newDish];
        return newDish;
    },
    updateDish: (dish) => {
        const updatedDish = { ...dish };
        state.dishes = state.dishes.map((d) => (d.id === dish.id ? updatedDish : d));
        return updatedDish;
    },
    deleteDish: (dishId) => {
        state.dishes = state.dishes.filter((d) => d.id !== dishId);
        return dishId;
    },
    getCategories: () => state.categories,
    addCategory: (category) => {
        if (!state.categories.includes(category)) {
            state.categories = [...state.categories, category];
        }
        return category;
    },
    deleteCategory: (category) => {
        state.categories = state.categories.filter((c) => c !== category);
        state.dishes = state.dishes.map((d) =>
            d.categoria === category ? { ...d, categoria: '' } : d
        );
        return category;
    },
    updateCategory: (oldName, newName) => {
        if (state.categories.includes(newName)) {
            throw new Error('La categoría ya existe');
        }
        state.categories = state.categories.map((c) =>
            c === oldName ? newName : c
        );
        state.dishes = state.dishes.map((d) =>
            d.categoria === oldName ? { ...d, categoria: newName } : d
        );
        return newName;
    },
    getOrders: () => state.orders,
    addOrder: (order) => {
        const existingOrder = state.orders.find((o) => o.id === order.id);
        const newOrder = { ...order, id: existingOrder ? order.id : Date.now() };
        state.orders = existingOrder
            ? state.orders.map((o) => (o.id === newOrder.id ? newOrder : o))
            : [...state.orders, newOrder];

        /*if (newOrder.estado === "pagado") {
            const user = state.users.find((u) => u.id === newOrder.userId);
            const userName = user ? user.nombre : "Desconocido";
            const amount = newOrder.dishes.reduce((sum, item) => sum + (item.dish?.precio || 0), 0);
            const ticket = {
                orderId: newOrder.id,
                date: new Date().toISOString().split("T")[0],
                amount,
                paymentMethod: newOrder.paymentMethod || "Efectivo",
                userName,
            };
            state.tickets = [...state.tickets, { ...ticket, id: Date.now() }];
        }*/

        return newOrder;
    },
    getRooms: () => state.rooms,
    addRoom: (room) => {
        const newRoom = { ...room, id: Date.now() };
        state.rooms = [...state.rooms, newRoom];
        return newRoom;
    },
    updateRoom: (room) => {
        const updatedRoom = { ...room };
        state.rooms = state.rooms.map((r) => (r.id === room.id ? updatedRoom : r));
        return updatedRoom;
    },
    deleteRoom: (roomId) => {
        const room = state.rooms.find((r) => r.id === roomId);
        if (!room) throw new Error('Sala no encontrada');
        if (room.mesasIds.length > 0) throw new Error('No se puede eliminar una sala con mesas');
        state.rooms = state.rooms.filter((r) => r.id !== roomId);
        return roomId;
    },
    getTables: () => state.tables,
    addTable: (table) => {
        const existingTable = state.tables.find((t) => t.id === table.id);
        const newTable = { ...table, id: existingTable ? table.id : Date.now() };
        state.tables = existingTable
            ? state.tables.map((t) => (t.id === newTable.id ? newTable : t))
            : [...state.tables, newTable];
        return newTable;
    },
    updateTable: (table) => {
        const updatedTable = { ...table };
        state.tables = state.tables.map((t) => (t.id === table.id ? updatedTable : t));
        return updatedTable;
    },
    deleteTable: (tableId) => {
        state.tables = state.tables.filter((t) => t.id !== tableId);
        return tableId;
    },
    getCash: () => state.cash,
    addCashEntry: (entry) => {
        const newEntry = {
            ...entry,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
        };
        state.cash = [...state.cash, newEntry];
        return newEntry;
    },

    // Ingredientes
    getIngredients: () => state.ingredients,
    addIngredient: (ingredient) => {
        if (state.ingredients.some(i => i.name === ingredient.name)) {
            throw new Error('El ingrediente ya existe');
        }
        const newId = String(Date.now());
        const newIngredient = { ...ingredient, id: newId };
        state.ingredients = [...state.ingredients, newIngredient];
        return newIngredient;
    },
    updateIngredient: (ingredient) => {
        if (!state.ingredients.find(i => i.id === ingredient.id)) {
            throw new Error('Ingrediente no encontrado');
        }
        if (state.ingredients.some(i => i.name === ingredient.name && i.id !== ingredient.id)) {
            throw new Error('El ingrediente ya existe');
        }
        state.ingredients = state.ingredients.map(i =>
            i.id === ingredient.id ? { ...ingredient } : i
        );
        return ingredient;
    },
    deleteIngredient: (id) => {
        if (!state.ingredients.find(i => i.id === id)) {
            throw new Error('Ingrediente no encontrado');
        }
        state.ingredients = state.ingredients.filter(i => i.id !== id);
        return id;
    },

    // Proveedores
    getSuppliers: () => state.suppliers,
    addSupplier: (supplier) => {
        if (state.suppliers.some(s => s.name === supplier.name)) {
            throw new Error('El proveedor ya existe');
        }
        const newId = String(Date.now());
        const newSupplier = { ...supplier, id: newId };
        state.suppliers = [...state.suppliers, newSupplier];
        return newSupplier;
    },
    updateSupplier: (supplier) => {
        if (!state.suppliers.find(s => s.id === supplier.id)) {
            throw new Error('Proveedor no encontrado');
        }
        if (state.suppliers.some(s => s.name === supplier.name && s.id !== supplier.id)) {
            throw new Error('El proveedor ya existe');
        }
        state.suppliers = state.suppliers.map(s =>
            s.id === supplier.id ? { ...supplier } : s
        );
        return supplier;
    },
    deleteSupplier: (id) => {
        if (!state.suppliers.find(s => s.id === id)) {
            throw new Error('Proveedor no encontrado');
        }
        state.suppliers = state.suppliers.filter(s => s.id !== id);
        return id;
    },

    // Reabastecimientos
    getRestocks: () => state.restocks,
    addRestock: (restock) => {
        if (!state.suppliers.find(s => s.id === restock.supplierId)) {
            throw new Error('Proveedor no encontrado');
        }
        const ingredientIds = restock.items.map(item => item.ingredientId);
        if (new Set(ingredientIds).size !== ingredientIds.length) {
            throw new Error('No se pueden incluir ingredientes duplicados');
        }
        for (const item of restock.items) {
            if (!state.ingredients.find(i => i.id === item.ingredientId)) {
                throw new Error(`Ingrediente ${item.ingredientId} no encontrado`);
            }
            if (!state.suppliers.find(s => s.id === restock.supplierId).ingredientIds.includes(item.ingredientId)) {
                throw new Error(`El proveedor no suministra el ingrediente ${item.ingredientId}`);
            }
        }
        const newId = String(Date.now());
        const newRestock = {
            ...restock,
            id: newId,
            date: new Date().toISOString().split('T')[0],
            totalCost: restock.items.reduce((sum, item) => sum + Number(item.cost), 0),
        };
        state.restocks = [...state.restocks, newRestock];
        state.ingredients = state.ingredients.map(i => {
            const item = restock.items.find(item => item.ingredientId === i.id);
            return item ? { ...i, quantity: i.quantity + Number(item.quantity) } : i;
        });
        return newRestock;
    },

    // Categorías de Ingredientes
    getIngredientCategories: () => state.ingredientCategories,
    addIngredientCategory: (category) => {
        if (state.ingredientCategories.includes(category)) {
            throw new Error('La categoría ya existe');
        }
        state.ingredientCategories = [...state.ingredientCategories, category];
        return category;
    },
    deleteIngredientCategory: (category) => {
        if (!state.ingredientCategories.includes(category)) {
            throw new Error('Categoría no encontrada');
        }
        if (state.ingredients.some(i => i.category === category)) {
            throw new Error('No se puede eliminar una categoría con ingredientes asociados');
        }
        state.ingredientCategories = state.ingredientCategories.filter(c => c !== category);
        return category;
    },
    setTurnOpen: (open) => {
        state.turnOpen = open;
        return open;
    },
    getTurnOpen: () => {
        return state.turnOpen;
    },
    addTicket: (ticket) => {
        const newTicket = { ...ticket, id: Date.now() };
        state.tickets = [...state.tickets, newTicket];
        return newTicket;
    },

    getTickets: () => state.tickets,
    getReport: (startDate, endDate) => {
        const tickets = state.tickets.filter((ticket) => {
            const ticketDate = new Date(ticket.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return ticketDate >= start && ticketDate <= end;
        });

        const reportsByDate = tickets.reduce((acc, ticket) => {
            const date = ticket.date;
            if (!acc[date]) {
                acc[date] = { date, balance: 0, tickets: [] };
            }
            acc[date].balance += ticket.amount;
            acc[date].tickets.push({
                amount: ticket.amount,
                paymentMethod: ticket.paymentMethod,
                userName: ticket.userName,
            });
            return acc;
        }, {});

        const reports = Object.values(reportsByDate);
        const totalBalance = reports.reduce((sum, report) => sum + report.balance, 0);

        return {
            startDate,
            endDate,
            totalBalance,
            reports,
        };
    },
    getTicketByOrderId(orderId) {
        return state.tickets.find(ticket => ticket.orderId === orderId);
    }
};

export function useMockSocket() {
    return mockService;
}