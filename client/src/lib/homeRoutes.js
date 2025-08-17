// Configuración de rutas home por tipo de usuario
export const homeRoutesByUserType = {
  admin: [
    { module: "spaces", route: "/rooms" },
    { module: "default", route: "/all-orders" },
  ],
  user: [{ module: "spaces", route: "/rooms" }],
  // Configuración para roles específicos (opcional)
  roles: {
    // Ejemplo: 'Mesero': [{ module: 'spaces', route: '/rooms' }],
    // Ejemplo: 'Cajero': [{ module: 'cashier', route: '/open-turn' }],
  },
};

// Fallback para compatibilidad
export const homeRoutePriority = homeRoutesByUserType.admin;
