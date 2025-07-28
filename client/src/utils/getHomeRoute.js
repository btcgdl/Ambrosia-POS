import config from "../config";
import { homeRoutePriority } from "./homeRoutes";

export function getHomeRoute() {
  for (const entry of homeRoutePriority) {
    if (entry.module === "default" || config.modules[entry.module]) {
      return entry.route;
    }
  }
  console.log("No se encontro ruta viable");
  return "/all-orders";
}
