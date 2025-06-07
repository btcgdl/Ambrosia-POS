import Rooms from './Rooms';
import Tables from './Tables';
import Spaces from './Spaces';
import * as spacesService from './spacesService';
import { addModule } from '../../core/moduleRegistry';

addModule('spaces', {
    routes: [
        { path: '/rooms', component: Rooms },
        { path: '/tables/:roomId', component: Tables },
        { path: '/spaces', component: Spaces },
    ],
    services: spacesService,
    navItems: [
        { path: '/rooms', label: 'Salas' },
        { path: '/spaces', label: 'Administrar Espacios' },
    ],
});