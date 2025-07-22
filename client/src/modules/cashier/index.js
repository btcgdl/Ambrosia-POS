import * as cashierService from './cashierService';
import { addModule } from '../../core/moduleRegistry';
import OpenTurn from "./OpenTurn";
import CloseTurn from "./CloseTurn";
import Reports from "./Reports";
import Wallet from "./Wallet";

addModule('cashier', {
    routes: [
        { path: '/open-turn', component: OpenTurn },
        { path: '/close-turn', component: CloseTurn },
        { path: '/reports', component: Reports },
        { path: '/wallet', component: Wallet },
    ],
    services: cashierService,
    navItems: [
        { path: '/reports', label: 'Reportes y caja', icon: 'bar-chart-line', roles: ['admin'] },
        { path: '/wallet', label: 'Wallet', icon: 'bar-chart-line', roles: ['admin'] },
    ],
});