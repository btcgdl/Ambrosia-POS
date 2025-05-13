import { apiClient } from './apiClient';

export async function login({ role, password }) {
    return apiClient('auth/login', {
        method: 'POST',
        body: { role, password },
    });
}
