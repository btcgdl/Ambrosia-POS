import { findRouteConfig } from "../../../lib/modules";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingCard from "../../../components/LoadingCard";
import { ModuleWrapper } from "../../../components/auth/ModuleWrapper";

export default async function ModuleSubPage({ params, searchParams }) {
  const { module, slug } = await params;
  const resolvedSearchParams = await searchParams;
  const pathname = `/${module}/${slug.join("/")}`;

  const routeConfig = findRouteConfig(pathname);
  if (!routeConfig) {
    notFound();
  }

  // Extraer parámetros dinámicos de la ruta
  const extractDynamicParams = (routePath, actualPath) => {
    const routeSegments = routePath.split("/").filter(Boolean);
    const pathSegments = actualPath.split("/").filter(Boolean);
    const dynamicParams = {};

    routeSegments.forEach((segment, i) => {
      if (segment.startsWith(":")) {
        const paramName = segment.slice(1); // Remover el ":"
        dynamicParams[paramName] = pathSegments[i];
      }
    });

    return dynamicParams;
  };

  const dynamicParams = extractDynamicParams(routeConfig.route.path, pathname);

  // Determinar la carpeta del componente
  const componentPath =
    routeConfig.moduleConfig.componentPath || routeConfig.module;

  // Cargar componente específico desde la carpeta correcta
  const ComponentToRender = dynamic(
    () =>
      import(
        `../../../modules/${componentPath}/${routeConfig.route.component}`
      ),
    {
      loading: () => <LoadingCard message="Cargando componente..." />,
      ssr: true,
    },
  );

  // ✅ Solo pasar datos serializables
  return (
    <ModuleWrapper>
      <ComponentToRender
        moduleKey={routeConfig.module}
        params={{ module, slug, ...dynamicParams }}
        route={pathname}
        dynamicParams={dynamicParams}
        searchParams={resolvedSearchParams}
      />
    </ModuleWrapper>
  );
}
