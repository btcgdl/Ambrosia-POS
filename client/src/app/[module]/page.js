import { modules, findRouteConfig, matchesBusiness } from "../../lib/modules";
import { notFound } from "next/navigation";
import DynamicModuleRenderer from "../../components/DynamicModuleRenderer";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
import { ModuleWrapper } from "../../components/auth/ModuleWrapper";

export function generateStaticParams() {
  return Object.keys(modules)
    .filter((key) => modules[key].enabled)
    .map((module) => ({ module }));
}

export default async function ModulePage({ params }) {
  const { module } = await params;
  const pathname = `/${module}`;

  const routeConfig = findRouteConfig(pathname);
  if (!routeConfig) {
    notFound();
  }

  const cookieStore = await cookies();
  const businessType = cookieStore.get("businessType")?.value || null;
  const routePath = routeConfig?.route?.path || pathname;
  if (
    !matchesBusiness({ path: routePath, ...routeConfig.route }, businessType)
  ) {
    notFound();
  }

  const componentPath =
    routeConfig.moduleConfig.componentPath || routeConfig.module;
  const componentBase = routeConfig.moduleConfig.componentBase || "modules"; // allow switching base dir (e.g., "components/pages")

  return (
    <ModuleWrapper>
      <DynamicModuleRenderer
        componentBase={componentBase}
        componentPath={componentPath}
        componentFile={routeConfig.route.component}
        loadingMessage={`Cargando ${modules[routeConfig.module].name}...`}
        passProps={{
          moduleKey: routeConfig.module,
          moduleName: routeConfig.moduleConfig.name,
        }}
      />
    </ModuleWrapper>
  );
}
