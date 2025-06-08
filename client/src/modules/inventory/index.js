import Suppliers from './Suppliers';
import Ingredients from './Ingredients';
import Restocks from './Restocks';
import IngredientCategories from './IngredientCategories';
import * as inventoryService from './inventoryService';
import { addModule } from '../../core/moduleRegistry';


addModule('inventory', {
    routes: [
        { path: '/inventory/suppliers', component: Suppliers },
        { path: '/inventory/ingredients', component: Ingredients },
        { path: '/inventory/restocks', component: Restocks },
        { path: '/inventory/categories', component: IngredientCategories },
    ],
    services: inventoryService,
    navItems: [
        { path: '/inventory/categories', label: 'Categorías', roles: ['admin'] },
        { path: '/inventory/ingredients', label: 'Ingredientes', roles: ['admin'] },
        { path: '/inventory/suppliers', label: 'Proveedores', roles: ['admin'] },
        { path: '/inventory/restocks', label: 'Reabastecimientos', roles: ['admin'] },
    ],
});
