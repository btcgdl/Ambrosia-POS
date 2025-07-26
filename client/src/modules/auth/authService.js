import { apiClient } from '../../services/apiClient';

export async function loginFromService({ name, pin }) {
    return await apiClient('/auth/login', {
        method: 'POST',
        body: { name, pin },
    });
}

export async function RefreshToken() {
    return await apiClient('/auth/refresh',
        {
            method:'POST',
    })
}

export async function logoutFromService() {
    return await apiClient('/auth/logout');
}

export async function getRoles() {
    const roles = await apiClient('/roles');
    return roles ? roles : [];
}

export async function addRole(role) {
    return await apiClient('/roles', {
        method: 'POST',
        body: role,
    });
}

export async function updateRole(role) {
    return await apiClient(`/roles/${role.id}`, {
        method: 'PUT',
        body: role,
    });
}

export async function deleteRole(roleId) {
    return await apiClient(`/roles/${roleId}`, {
        method: 'DELETE',
    });
}

export async function getUsers() {
    const users = await apiClient('/users');
    return users ? users : [];
}

export async function addUser(user) {
    return await apiClient('/users', {
        method: 'POST',
        body: { ...user, pin: parseInt(user.pin, 10) },
    });
}

export async function updateUser(user) {
    return await apiClient(`/users/${user.id}`, {
        method: 'PUT',
        body: { ...user, pin: parseInt(user.pin, 10) },
    });
}

export async function deleteUser(userId) {
    return await apiClient(`/users/${userId}`, {
        method: 'DELETE',
    });
}