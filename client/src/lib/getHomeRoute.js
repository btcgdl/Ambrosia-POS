import { modules } from "./modules";
import { homeRoutesByUserType, homeRoutePriority } from "./homeRoutes";

export function getHomeRoute(user = null) {
  // Si no hay usuario, usar el comportamiento anterior
  if (!user) {
    for (const entry of homeRoutePriority) {
      if (entry.module === "default" || modules[entry.module]?.enabled) {
        return entry.route;
      }
    }
    console.log("No se encontro ruta viable");
    return "/all-orders";
  }

  // Obtener configuración específica del usuario
  let userRoutes = [];
  
  // 1. Primero buscar por rol específico si existe
  if (user.role && homeRoutesByUserType.roles[user.role]) {
    userRoutes = homeRoutesByUserType.roles[user.role];
  }
  // 2. Luego por tipo de usuario (admin/user)
  else if (user.isAdmin && homeRoutesByUserType.admin) {
    userRoutes = homeRoutesByUserType.admin;
  }
  else if (!user.isAdmin && homeRoutesByUserType.user) {
    userRoutes = homeRoutesByUserType.user;
  }
  // 3. Fallback a configuración por defecto
  else {
    userRoutes = homeRoutePriority;
  }

  // Buscar la primera ruta disponible para este usuario
  for (const entry of userRoutes) {
    if (entry.module === "default" || modules[entry.module]?.enabled) {
      console.log(`🏠 Ruta home para ${user.isAdmin ? 'admin' : 'usuario'}: ${entry.route}`);
      return entry.route;
    }
  }

  console.log("No se encontro ruta viable para el usuario");
  return "/all-orders";
}
