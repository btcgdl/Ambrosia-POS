import { useState, useEffect } from 'react';
import './App.css';
import './output.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import { MockSocketProvider } from "./contexts/MockSocketContext";
import config from './config';
import { getModules } from "./core/moduleRegistry";

import './modules/auth';
import './modules/dishes';
import './modules/orders';
import { CashierProvider } from './contexts/cashierContext';

function App() {
    const [modules, setModules] = useState(getModules());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadModules() {
            try {
                if (config.modules.inventory) {
                    await import('./modules/inventory');
                }
                if (config.modules.spaces) {
                    await import('./modules/spaces');
                }
                setModules(getModules());
            } catch (error) {
                console.error('Error cargando módulos:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadModules();
    }, []);

    if (isLoading) {
        return <div>Cargando módulos...</div>;
    }

    return (
        <div className="App">
            <MockSocketProvider>
                <UserRoleProvider>
                    <CashierProvider>
                        <BrowserRouter>
                            <Routes>
                                {
                                Object.entries(modules).map(([name, module]) =>
                                    console.log(`Cargando rutas del módulo: ${name}`) ||
                                    
                                    config.modules[name] &&
                                    module.routes.map((route) => (

                                        <Route
                                            key={route.path}
                                            path={route.path}
                                            element={<route.component />}
                                        />
                                    ))
                                )}
                                <Route path="*" element={<div>404 - Página no encontrada</div>} />
                            </Routes>
                        </BrowserRouter>
                    </CashierProvider>
                </UserRoleProvider>
            </MockSocketProvider>
        </div>
    );
}

export default App;