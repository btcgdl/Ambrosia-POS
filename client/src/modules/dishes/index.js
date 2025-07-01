import Dishes from './Dishes';
import * as dishesService from './dishesService';
import { addModule } from '../../core/moduleRegistry';

addModule('dishes', {
    routes: [
        { path: '/dishes', component: Dishes },
    ],
    services: dishesService,
    navItems: [
        { path: '/dishes', label: 'Platillos', icon: 'egg-fried', roles: ['admin'] },
    ],
});