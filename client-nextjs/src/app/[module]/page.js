import { modules, findRouteConfig } from "../../lib/modules";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

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

  // Determinar la carpeta del componente
  const componentPath =
    routeConfig.moduleConfig.componentPath || routeConfig.module;

  // Cargar el componente dinámicamente desde la carpeta correcta
  const ComponentToRender = dynamic(
    () =>
      import(`../../modules/${componentPath}/${routeConfig.route.component}`),
    {
      loading: () => <div>Cargando {modules[routeConfig.module].name}...</div>,
      ssr: true,
    },
  );

  // ✅ Solo pasar datos serializables
  return (
    <ComponentToRender
      moduleKey={routeConfig.module}
      moduleName={routeConfig.moduleConfig.name}
    />
  );
}
