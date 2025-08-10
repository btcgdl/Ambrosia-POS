export const modules = {
  auth: {
    enabled: true,
    name: "Autenticación",
    routes: [
      { path: "/auth", component: "PinLogin" },
      { path: "/roles", component: "Roles" },
      { path: "/users", component: "Users" },
    ],
    services: () => import("../modules/auth/authService"),
    navItems: [
      {
        path: "/roles",
        label: "Roles",
        icon: "user-lock",
        roles: ["admin"],
      },
      {
        path: "/users",
        label: "Usuarios",
        icon: "users",
        roles: ["admin"],
      },
    ],
  },
  dishes: {
    enabled: true,
    name: "Platillos",
    routes: [{ path: "/dishes", component: "Dishes" }],
    services: () => import("../modules/dishes/dishesService"),
    navItems: [
      {
        path: "/dishes",
        label: "Platillos",
        icon: "salad",
        roles: ["admin"],
      },
    ],
  },
  cashier: {
    enabled: true,
    name: "Wallet",
    routes: [
      { path: "/open-turn", component: "OpenTurn" },
      { path: "/close-turn", component: "CloseTurn" },
      { path: "/reports", component: "Reports" },
      { path: "/wallet", component: "Wallet" },
    ],
    services: () => import("../modules/cashier/cashierService"),
    navItems: [
      {
        path: "/wallet",
        label: "Cartera",
        icon: "wallet",
        roles: ["admin"],
      },
      {
        path: "/reports",
        label: "Reportes",
        icon: "chart-line",
        roles: ["admin"],
      },
    ],
  },
  orders: {
    enabled: true,
    name: "Ordenes",
    routes: [
      { path: "/all-orders", component: "Orders" },
      { path: "/modify-order/:pedidoId", component: "EditOrder" },
    ],
    services: () => import("../modules/orders/ordersService"),
    navItems: [
      {
        path: "/all-orders",
        label: "Ordenes",
        icon: "clipboard-clock",
        roles: ["admin"],
      },
    ],
  },
  spaces: {
    enabled: true,
    name: "Salas",
    routes: [
      { path: "/rooms", component: "Rooms" },
      { path: "/tables/:roomId", component: "Tables" },
      { path: "/spaces", component: "Spaces" },
    ],
    services: () => import("../modules/spaces/spacesService"),
    navItems: [
      {
        path: "/spaces",
        label: "Administrar Espacios",
        icon: "door-open",
        roles: ["admin"],
      },
    ],
  },
};

// Funciones helper (como tu moduleRegistry original)
export function getActiveModules() {
  return Object.entries(modules)
    .filter(([_, config]) => config.enabled)
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
