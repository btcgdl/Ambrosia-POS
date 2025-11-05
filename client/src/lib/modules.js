export const modules = {
  auth: {
    enabled: true,
    name: "Autenticación",
    routes: [
      { path: "/auth", component: "PinLogin", requiresAuth: false },
      {
        path: "/roles",
        component: "Roles",
        requiresAuth: true,
        requiresAdmin: true,
      },
      {
        path: "/users",
        component: "Users",
        requiresAuth: true,
        requiresAdmin: true,
      },
    ],
    services: () => import("../modules/auth/authService"),
    navItems: [
      {
        path: "/roles",
        label: "Roles",
        icon: "user-lock",
        roles: ["admin"],
        showInNavbar: true,
      },
      {
        path: "/users",
        label: "Usuarios",
        icon: "users",
        roles: ["admin"],
        showInNavbar: true,
      },
    ],
  },
  dishes: {
    enabled: true,
    name: "Platillos",
    routes: [
      {
        path: "/dishes",
        component: "Dishes",
        requiresAuth: true,
        requiresAdmin: true,
      },
    ],
    services: () => import("../modules/dishes/dishesService"),
    navItems: [
      {
        path: "/dishes",
        label: "Platillos",
        icon: "salad",
        roles: ["admin"],
        showInNavbar: true,
      },
    ],
  },
  cashier: {
    enabled: true,
    name: "Wallet",
    routes: [
      {
        path: "/open-turn",
        component: "OpenTurn",
        requiresAuth: true,
        requiresAdmin: false,
      },
      {
        path: "/close-turn",
        component: "CloseTurn",
        requiresAuth: true,
        requiresAdmin: false,
      },
      {
        path: "/reports",
        component: "Reports",
        requiresAuth: true,
        requiresAdmin: true,
      },
      {
        path: "/wallet",
        component: "Wallet",
        requiresAuth: true,
        requiresAdmin: true,
      },
    ],
    services: () => import("../modules/cashier/cashierService"),
    navItems: [
      {
        path: "/open-turn",
        label: "Abrir Turno",
        icon: "play-circle",
        roles: [], // Disponible para todos los usuarios autenticados
        showInNavbar: false,
      },
      {
        path: "/close-turn",
        label: "Cerrar Turno",
        icon: "pause-circle",
        roles: [], // Disponible para todos los usuarios autenticados
        showInNavbar: false,
      },
      {
        path: "/wallet",
        label: "Cartera",
        icon: "wallet",
        roles: ["admin"],
        showInNavbar: true,
      },
      {
        path: "/reports",
        label: "Reportes",
        icon: "chart-line",
        roles: ["admin"],
        showInNavbar: false, // Oculto del navbar pero accesible por URL
      },
    ],
  },
  orders: {
    enabled: true,
    name: "Ordenes",
    routes: [
      {
        path: "/all-orders",
        component: "Orders",
        requiresAuth: true,
        requiresAdmin: false,
      },
      {
        path: "/modify-order/:pedidoId",
        component: "EditOrder",
        requiresAuth: true,
        requiresAdmin: false,
      },
    ],
    services: () => import("../modules/orders/ordersService"),
    navItems: [
      {
        path: "/all-orders",
        label: "Ordenes",
        icon: "clipboard-clock",
        roles: [], // Disponible para todos los usuarios autenticados
        showInNavbar: true,
      },
    ],
  },
  spaces: {
    enabled: true,
    name: "Salas",
    routes: [
      {
        path: "/rooms",
        component: "Rooms",
        requiresAuth: true,
        requiresAdmin: false,
      },
      {
        path: "/tables/:roomId",
        component: "Tables",
        requiresAuth: true,
        requiresAdmin: false,
      },
      {
        path: "/spaces",
        component: "Spaces",
        requiresAuth: true,
        requiresAdmin: true,
      },
    ],
    services: () => import("../modules/spaces/spacesService"),
    navItems: [
      {
        path: "/rooms",
        label: "Ver Salas",
        icon: "building",
        roles: [], // Disponible para todos los usuarios autenticados
        showInNavbar: false,
      },
      {
        path: "/spaces",
        label: "Administrar Espacios",
        icon: "door-open",
        roles: ["admin"],
        showInNavbar: true,
      },
    ],
  },
  "color-test": {
    enabled: true,
    name: "Color Test",
    routes: [
      {
        path: "/color-test",
        component: "ColorTest",
        requiresAuth: true,
        requiresAdmin: true,
      },
    ],
    services: () => import("../modules/spaces/spacesService"),
    navItems: [
      {
        path: "/color-test",
        label: "Ver colores",
        icon: "building",
        roles: [], // Disponible para todos los usuarios autenticados
        showInNavbar: true,
      },
    ],
  },
};

// Funciones helper (como tu moduleRegistry original)
export function getActiveModules() {
  return Object.entries(modules)
    .filter(([, config]) => config.enabled)
    .map(([key, config]) => ({ key, ...config }));
}

export function getModuleRoutes() {
  const routes = [];
  Object.entries(modules).forEach(([moduleKey, config]) => {
    if (config.enabled) {
      config.routes.forEach((route) => {
        routes.push({
          ...route,
          module: moduleKey,
          fullPath: route.path,
        });
      });
    }
  });
  return routes;
}

export function findRouteConfig(pathname) {
  for (const [moduleKey, moduleConfig] of Object.entries(modules)) {
    if (!moduleConfig.enabled) continue;

    const route = moduleConfig.routes.find((r) => {
      // Exact match
      if (r.path === pathname) return true;

      // Para rutas dinámicas con parámetros como /tables/:roomId
      const pathSegments = pathname.split("/").filter(Boolean);
      const routeSegments = r.path.split("/").filter(Boolean);

      if (pathSegments.length !== routeSegments.length) return false;

      return routeSegments.every((segment, i) => {
        // Si el segmento de la ruta empieza con :, es un parámetro dinámico
        if (segment.startsWith(":")) return true;
        // Si no, debe coincidir exactamente
        return segment === pathSegments[i];
      });
    });

    if (route) {
      return {
        module: moduleKey,
        route,
        moduleConfig,
      };
    }
  }
  return null;
}

export function getNavigationItems(userRoles = []) {
  const navItems = [];

  Object.entries(modules).forEach(([moduleKey, config]) => {
    if (!config.enabled) return;

    config.navItems?.forEach((item) => {
      // Si está marcado como oculto del navbar, no mostrarlo
      if (item.showInNavbar === false) return;

      // Verificar roles
      const hasPermission =
        !item.roles || item.roles.some((role) => userRoles.includes(role));

      if (hasPermission) {
        navItems.push({
          ...item,
          module: moduleKey,
        });
      }
    });
  });

  return navItems;
}

// Filtrar módulos basado en autenticación y permisos
export function getAvailableModules(isAuthenticated = false, isAdmin = false) {
  const availableModules = {};

  Object.entries(modules).forEach(([moduleKey, moduleConfig]) => {
    if (!moduleConfig.enabled) return;

    // Filtrar rutas del módulo
    const availableRoutes = moduleConfig.routes.filter((route) => {
      // Si la ruta no requiere autenticación, siempre está disponible
      if (!route.requiresAuth) return true;

      // Si la ruta requiere autenticación pero el usuario no está logueado
      if (route.requiresAuth && !isAuthenticated) return false;

      // Si la ruta requiere admin pero el usuario no es admin
      if (route.requiresAdmin && !isAdmin) return false;

      return true;
    });

    // Filtrar navItems del módulo
    const availableNavItems = (moduleConfig.navItems || []).filter(
      (navItem) => {
        // Si no está autenticado, no puede ver nada
        if (!isAuthenticated) return false;

        // Si está marcado como oculto del navbar, no mostrarlo
        if (navItem.showInNavbar === false) return false;

        // Si no tiene roles definidos o es array vacío, está disponible para todos los autenticados
        if (!navItem.roles || navItem.roles.length === 0) return true;

        // Verificar si el usuario tiene el rol requerido
        if (navItem.roles.includes("admin") && !isAdmin) return false;

        return true;
      },
    );

    // Solo incluir el módulo si tiene rutas o navItems disponibles
    if (availableRoutes.length > 0 || availableNavItems.length > 0) {
      availableModules[moduleKey] = {
        ...moduleConfig,
        routes: availableRoutes,
        navItems: availableNavItems,
      };
    }
  });

  return availableModules;
}

// Obtener solo las rutas de navegación disponibles para el usuario
export function getAvailableNavigation(
  isAuthenticated = false,
  isAdmin = false,
) {
  const availableModules = getAvailableModules(isAuthenticated, isAdmin);
  const navItems = [];

  Object.entries(availableModules).forEach(([moduleKey, config]) => {
    config.navItems?.forEach((item) => {
      navItems.push({
        ...item,
        module: moduleKey,
      });
    });
  });

  return navItems;
}

// Verificar si el usuario tiene acceso a una ruta específica
export function hasAccessToRoute(
  pathname,
  isAuthenticated = false,
  isAdmin = false,
) {
  const routeConfig = findRouteConfig(pathname);
  if (!routeConfig) return false;

  const route = routeConfig.route;

  // Si la ruta no requiere autenticación, está disponible
  if (!route.requiresAuth) return true;

  // Si requiere autenticación pero no está logueado
  if (route.requiresAuth && !isAuthenticated) return false;

  // Si requiere admin pero no es admin
  if (route.requiresAdmin && !isAdmin) return false;

  return true;
}
