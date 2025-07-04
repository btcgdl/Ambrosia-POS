import CreateOrder from './CreateOrder';
import * as ordersService from './ordersService';
import { addModule } from '../../core/moduleRegistry';
import Orders from "./Orders";
import EditOrder from "./EditOrder";

addModule('orders', {
    routes: [
        { path: '/all-orders', component: Orders },
        { path: '/new-order', component: CreateOrder },
        { path: '/new-order/:tableId', component: CreateOrder },
        { path: '/modify-order/:pedidoId', component: EditOrder },
    ],
    services: ordersService,
    navItems: [{ path: '/all-orders', label: 'Órdenes', icon: 'receipt' }],
});