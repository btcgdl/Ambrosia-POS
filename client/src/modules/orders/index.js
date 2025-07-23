import * as ordersService from './ordersService';
import { addModule } from '../../core/moduleRegistry';
import Orders from "./Orders";
import EditOrder from "./EditOrder";

addModule('orders', {
    routes: [
        { path: '/all-orders', component: Orders },
        { path: '/modify-order/:pedidoId', component: EditOrder },
    ],
    services: ordersService,
    navItems: [{ path: '/all-orders', label: 'Órdenes', icon: 'receipt' }],
});