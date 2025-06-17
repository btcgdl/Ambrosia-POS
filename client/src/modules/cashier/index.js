import * as cashierService from './cashierService';
import { addModule } from '../../core/moduleRegistry';
import OpenTurn from "./OpenTurn";
import CloseTurn from "./CloseTurn";

addModule('cashier', {
    routes: [
        { path: '/open-turn', component: OpenTurn },
        { path: '/close-turn', component: CloseTurn },
    ],
    services: cashierService,
    navItems: [],
});