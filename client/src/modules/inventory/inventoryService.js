import { apiClient } from '../../services/apiClient';
import { mockService } from '../../useMockSocket';

export async function getSuppliers() {
    try {
        const response = await apiClient.get('/suppliers');
        return response.data;
    } catch (error) {
        return mockService.getSuppliers();
    }
}

export async function addSupplier(supplier) {
    try {
        const response = await apiClient.post('/suppliers', supplier);
        return response.data;
    } catch (error) {
        return mockService.addSupplier(supplier);
    }
}

export async function updateSupplier(supplier) {
    try {
        const response = await apiClient.patch(`/suppliers/${supplier.id}`, supplier);
        return response.data;
    } catch (error) {
        return mockService.updateSupplier(supplier);
    }
}

export async function deleteSupplier(supplierId) {
    try {
        const response = await apiClient.delete(`/suppliers/${supplierId}`);
        return response.data;
    } catch (error) {
        return mockService.deleteSupplier(supplierId);
    }
}

export async function getIngredients() {
    try {
        const response = await apiClient.get('/ingredients');
        return response.data;
    } catch (error) {
        return mockService.getIngredients();
    }
}

export async function addIngredient(ingredient) {
    try {
        const response = await apiClient.post('/ingredients', ingredient);
        return response.data;
    } catch (error) {
        return mockService.addIngredient(ingredient);
    }
}

export async function updateIngredient(ingredient) {
    try {
        const response = await apiClient.patch(`/ingredients/${ingredient.id}`, ingredient);
        return response.data;
    } catch (error) {
        return mockService.updateIngredient(ingredient);
    }
}

export async function deleteIngredient(ingredientId) {
    try {
        const response = await apiClient.delete(`/ingredients/${ingredientId}`);
        return response.data;
    } catch (error) {
        return mockService.deleteIngredient(ingredientId);
    }
}

export async function getRestocks() {
    try {
        const response = await apiClient.get('/restocks');
        return response.data;
    } catch (error) {
        return mockService.getRestocks();
    }
}

export async function addRestock(restock) {
    try {
        const response = await apiClient.post('/restocks', restock);
        return response.data;
    } catch (error) {
        return mockService.addRestock(restock);
    }
}

export async function getCategories() {
    try {
        const response = await apiClient.get('/ingredient-categories');
        return response.data;
    } catch (error) {
        return mockService.getIngredientCategories();
    }
}

export async function addCategory(category) {
    try {
        const response = await apiClient.post('/ingredient-categories', { name: category });
        return response.data;
    } catch (error) {
        return mockService.addIngredientCategory(category);
    }
}

export async function deleteCategory(category) {
    try {
        const response = await apiClient.delete(`/ingredient-categories/${encodeURIComponent(category)}`);
        return response.data;
    } catch (error) {
        return mockService.deleteIngredientCategory(category);
    }
}