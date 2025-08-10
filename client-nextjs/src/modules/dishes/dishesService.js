import { apiClient } from '../../services/apiClient';

export async function getDishes() {
    const dishes = await apiClient('/dishes');
    return dishes ? dishes : [];
}

export async function addDish(dish) {
    return await apiClient('/dishes', {
        method: 'POST',
        body: dish,
    });
}

export async function updateDish(dish) {
    return await apiClient(`/dishes/${dish.id}`, {
        method: 'PUT',
        body: dish,
    });
}

export async function deleteDish(dishId) {
    return await apiClient(`/dishes/${dishId}`, {
        method: 'DELETE',
    });
}

export async function getCategories() {
    const categories = await apiClient('/dish-categories');
    return  categories ? categories : [];
}

export async function addCategory(category) {
    return await apiClient('/dish-categories', {
        method: 'POST',
        body: { name: category },
    });
}

export async function deleteCategory(category) {
    return await apiClient(`/dish-categories/${category}`, {
        method: 'DELETE',
    });
}

export async function updateCategory(id, name) {
    return await apiClient(`/dish-categories/${id}`, {
        method: 'PUT',
        body: { name: name },
    });
}