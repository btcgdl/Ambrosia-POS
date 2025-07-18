import LoginPage from './LoginPage';
import Roles from './Roles';
import Users from './Users';
import * as authService from './authService';
import { addModule } from '../../core/moduleRegistry';
import PinLogin from "./PinLogin";

addModule('auth', {
    routes: [
        { path: '/', component: PinLogin },
        { path: '/roles', component: Roles },
        { path: '/users', component: Users },
        { path: '/login', component: LoginPage },
    ],
    services: authService,
    navItems: [
        { path: '/roles', label: 'Roles', icon: 'people-fill', roles: ['admin'] },
        { path: '/users', label: 'Usuarios', icon: 'person-lock', roles: ['admin'] },
    ],
});