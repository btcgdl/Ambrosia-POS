import Link from "next/link";
import { modules } from "../lib/modules";

export default function HomePage() {
  const activeModules = Object.entries(modules).filter(
    ([_, config]) => config.enabled,
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Sistema Modular</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeModules.map(([key, config]) => (
          <Link
            key={key}
            href={`/${key}`}
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{config.name}</h2>
            <p className="text-gray-600">
              Acceder al módulo de {config.name.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
