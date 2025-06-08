import * as cashierService from './cashierService';
import { addModule } from '../../core/moduleRegistry';

addModule('cashier', {
    routes: [
        { path: '/all-orders', component: Orders },
    ],
    services: cashierService,
    navItems: [{ path: '/all-orders', label: 'Órdenes' }],
});