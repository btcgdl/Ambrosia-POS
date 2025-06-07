import LoginPage from './LoginPage';
import Roles from './Roles';
import Users from './Users';
import * as authService from './authService';
import { addModule } from '../../core/moduleRegistry';

addModule('auth', {
    routes: [
        { path: '/', component: LoginPage },
        { path: '/roles', component: Roles },
        { path: '/users', component: Users },
    ],
    services: authService,
    navItems: [
        { path: '/roles', label: 'Roles' },
        { path: '/users', label: 'Usuarios' },
    ],
});