import { apiClient } from '../../services/apiClient';
import { mockService } from '../../useMockSocket';

export async function login({ role, password }) {
    try {
        return await apiClient('/auth/login', {
            method: 'POST',
            body: { role, password },
        });
    } catch (error) {
        const roles = mockService.getRoles();
        const foundRole = roles.find((r) => r.role === role && r.password === password);
        if (!foundRole) throw new Error('Credenciales inválidas');
        return { data: { role: foundRole.role } };
    }
}

export async function getRoles() {
    try {
        return await apiClient('/roles');
    } catch (error) {
        return { data: mockService.getRoles() };
    }
}

export async function addRole(role) {
    try {
        return await apiClient('/roles', {
            method: 'POST',
            body: role,
        });
    } catch (error) {
        return mockService.addRole(role);
    }
}

export async function updateRole(role) {
    try {
        return await apiClient(`/roles/${role.id}`, {
            method: 'PATCH',
            body: role,
        });
    } catch (error) {
        const roles = mockService.getRoles();
        const roleExists = roles.find((r) => r.id === role.id);
        if (!roleExists) throw new Error('Rol no encontrado');
        return mockService.updateRole(role);
    }
}

export async function deleteRole(roleId) {
    try {
        return await apiClient(`/roles/${roleId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        const roles = mockService.getRoles();
        const roleExists = roles.find((r) => r.id === roleId);
        if (!roleExists) throw new Error('Rol no encontrado');
        return mockService.deleteRole(roleId);
    }
}

export async function getUsers() {
    try {
        return await apiClient('/users');
    } catch (error) {
        return { data: mockService.getUsers() };
    }
}

export async function addUser(user) {
    try {
        return await apiClient('/users', {
            method: 'POST',
            body: { ...user, pin: parseInt(user.pin, 10) },
        });
    } catch (error) {
        const pinAsInt = parseInt(user.pin, 10);
        if (isNaN(pinAsInt)) {
            throw new Error('El PIN debe ser un número válido');
        }
        return mockService.addUser({ ...user, pin: pinAsInt });
    }
}

export async function updateUser(user) {
    try {
        return await apiClient(`/users/${user.id}`, {
            method: 'PATCH',
            body: { ...user, pin: parseInt(user.pin, 10) },
        });
    } catch (error) {
        const users = mockService.getUsers();
        const userExists = users.find((u) => u.id === user.id);
        if (!userExists) throw new Error('Usuario no encontrado');
        const pinAsInt = parseInt(user.pin, 10);
        if (isNaN(pinAsInt)) {
            throw new Error('El PIN debe ser un número válido');
        }
        return mockService.updateUser({ ...user, pin: pinAsInt });
    }
}

export async function deleteUser(userId) {
    try {
        return await apiClient(`/users/${userId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        const users = mockService.getUsers();
        const userExists = users.find((u) => u.id === userId);
        if (!userExists) throw new Error('Usuario no encontrado');
        return mockService.deleteUser(userId);
    }
}

export async function validatePin(pin, orderId = null) {
    try {
        const response = await apiClient('/auth/validate-pin', {
            method: 'POST',
            body: { pin, orderId },
        });
        return response.data;
    } catch (error) {
        const users = mockService.getUsers();
        const user = users.find((u) => u.pin === Number(pin));
        if (!user) return { authorized: false, error: 'PIN incorrecto' };

        if (orderId) {
            const order = mockService.getOrders().find((o) => o.id === Number(orderId));
            if (!order) return { authorized: false, error: 'Pedido no encontrado' };
            const esMozoAsignado = user.id === order.userId;
            if (!esMozoAsignado) {
                return { authorized: false, error: 'No tienes permisos para modificar este pedido' };
            }
        }

        return { authorized: true, userId: user.id, error: '' };
    }
}