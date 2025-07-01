import * as cashierService from './cashierService';
import { addModule } from '../../core/moduleRegistry';
import OpenTurn from "./OpenTurn";
import CloseTurn from "./CloseTurn";
import Reports from "./Reports";

addModule('cashier', {
    routes: [
        { path: '/open-turn', component: OpenTurn },
        { path: '/close-turn', component: CloseTurn },
        { path: '/reports', component: Reports },
    ],
    services: cashierService,
    navItems: [
        { path: '/reports', label: 'Reportes y caja', icon: 'bar-chart-line', roles: ['admin'] },
    ],
});