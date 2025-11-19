import { modules, findRouteConfig } from "../../lib/modules";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingCard from "../../components/LoadingCard";
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

  const componentPath =
    routeConfig.moduleConfig.componentPath || routeConfig.module;

  const ComponentToRender = dynamic(
    () =>
      import(`../../modules/${componentPath}/${routeConfig.route.component}`),
    {
      loading: () => (
        <LoadingCard
          message={`Cargando ${modules[routeConfig.module].name}...`}
        />
      ),
      ssr: true,
    },
  );

  return (
    <ModuleWrapper>
      <ComponentToRender
        moduleKey={routeConfig.module}
        moduleName={routeConfig.moduleConfig.name}
      />
    </ModuleWrapper>
  );
}
