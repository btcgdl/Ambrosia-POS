import { apiClient } from '../../services/apiClient';

export async function getSuppliers() {
    const response = await apiClient.get('/suppliers');
    return response.data;
}

export async function addSupplier(supplier) {
    const response = await apiClient.post('/suppliers', supplier);
    return response.data;
}

export async function updateSupplier(supplier) {
    const response = await apiClient.patch(`/suppliers/${supplier.id}`, supplier);
    return response.data;
}

export async function deleteSupplier(supplierId) {
    const response = await apiClient.delete(`/suppliers/${supplierId}`);
    return response.data;
}

export async function getIngredients() {
    const response = await apiClient.get('/ingredients');
    return response.data;
}

export async function addIngredient(ingredient) {
    const response = await apiClient.post('/ingredients', ingredient);
    return response.data;
}

export async function updateIngredient(ingredient) {
    const response = await apiClient.patch(`/ingredients/${ingredient.id}`, ingredient);
    return response.data;
}

export async function deleteIngredient(ingredientId) {
    const response = await apiClient.delete(`/ingredients/${ingredientId}`);
    return response.data;
}

export async function getRestocks() {
    const response = await apiClient.get('/restocks');
    return response.data;
}

export async function addRestock(restock) {
    const response = await apiClient.post('/restocks', restock);
    return response.data;
}

export async function getCategories() {
    const response = await apiClient.get('/ingredient-categories');
    return response.data;
}

export async function addCategory(category) {
    const response = await apiClient.post('/ingredient-categories', { name: category });
    return response.data;
}

export async function deleteCategory(category) {
    const response = await apiClient.delete(`/ingredient-categories/${encodeURIComponent(category)}`);
    return response.data;
}