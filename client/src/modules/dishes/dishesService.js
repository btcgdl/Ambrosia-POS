import { apiClient } from '../../services/apiClient';
import { mockService } from '../../useMockSocket';

export async function getDishes() {
    try {
        return await apiClient('/dishes');
    } catch (error) {
        return { data: mockService.getDishes() };
    }
}

export async function addDish(dish) {
    try {
        return await apiClient('/dishes', {
            method: 'POST',
            body: dish,
        });
    } catch (error) {
        return mockService.addDish(dish);
    }
}

export async function updateDish(dish) {
    try {
        return await apiClient(`/dishes/${dish.id}`, {
            method: 'PATCH',
            body: dish,
        });
    } catch (error) {
        const dishes = mockService.getDishes();
        const dishExists = dishes.find((d) => d.id === dish.id);
        if (!dishExists) throw new Error('Platillo no encontrado');
        return mockService.updateDish(dish);
    }
}

export async function deleteDish(dishId) {
    try {
        return await apiClient(`/dishes/${dishId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        const dishes = mockService.getDishes();
        const dishExists = dishes.find((d) => d.id === dishId);
        if (!dishExists) throw new Error('Platillo no encontrado');
        return mockService.deleteDish(dishId);
    }
}

export async function getCategories() {
    try {
        return await apiClient('/categories');
    } catch (error) {
        return { data: mockService.getCategories() };
    }
}

export async function addCategory(category) {
    try {
        return await apiClient('/categories', {
            method: 'POST',
            body: { category },
        });
    } catch (error) {
        if (mockService.getCategories().includes(category)) {
            throw new Error('La categoría ya existe');
        }
        return mockService.addCategory(category);
    }
}

export async function deleteCategory(category) {
    try {
        return await apiClient(`/categories/${category}`, {
            method: 'DELETE',
        });
    } catch (error) {
        const categories = mockService.getCategories();
        if (!categories.includes(category)) throw new Error('Categoría no encontrada');
        return mockService.deleteCategory(category);
    }
}

export async function updateCategory(oldName, newName) {
    try {
        return await apiClient(`/categories/${oldName}`, {
            method: 'PATCH',
            body: { newName },
        });
    } catch (error) {
        const categories = mockService.getCategories();
        if (!categories.includes(oldName)) throw new Error('Categoría no encontrada');
        return mockService.updateCategory(oldName, newName);
    }
}