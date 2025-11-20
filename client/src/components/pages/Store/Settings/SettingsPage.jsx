"use client";

import { StoreLayout } from "../StoreLayout";

export default function SettingsPage() {
  return (
    <StoreLayout>
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-green-900">
          Configuración
        </h1>
        <p className="text-sm text-gray-700">
          Administra los datos y permisos de tu tienda
        </p>
      </header>

      {/* Main card */}
      <section className="max-w-3xl rounded-lg border border-green-300 bg-[#f5ffe9] shadow p-6">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-green-900">
            Información principal
          </h2>
          <p className="text-xs text-gray-600">
            Datos básicos de la tienda
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-green-900">
          {/* Nombre */}
          <div>
            <div className="text-xs font-semibold text-gray-600">Nombre</div>
            <div className="mt-0.5 font-medium">LSS Restaurant</div>
          </div>

          {/* RFC */}
          <div>
            <div className="text-xs font-semibold text-gray-600">RFC</div>
            <div className="mt-0.5 text-green-800">GASE23432</div>
          </div>

          {/* Dirección */}
          <div>
            <div className="text-xs font-semibold text-gray-600">Dirección</div>
            <div className="mt-0.5">Galeana #286</div>
          </div>

          {/* Email */}
          <div>
            <div className="text-xs font-semibold text-gray-600">Email</div>
            <div className="mt-0.5 text-green-800">
              contacto@lssrestaurant.com
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <div className="text-xs font-semibold text-gray-600">Teléfono</div>
            <div className="mt-0.5 text-green-800">44313244566</div>
          </div>

          {/* Descripción */}
          <div className="md:col-span-2 mt-2">
            <div className="text-xs font-semibold text-gray-600">
              Descripción
            </div>
            <div className="mt-0.5 font-medium">
              Restaurante de comida típica mexicana.
            </div>
          </div>

          {/* Horarios */}
          <div className="mt-2">
            <div className="text-xs font-semibold text-gray-600">
              Horario de apertura
            </div>
            <div className="mt-0.5 font-medium">10:00</div>
          </div>
          <div className="mt-2">
            <div className="text-xs font-semibold text-gray-600">
              Horario de cierre
            </div>
            <div className="mt-0.5 font-medium">20:00</div>
          </div>
        </div>

        <div className="mt-6">
          <button className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
            Editar Información
          </button>
        </div>
      </section>
    </StoreLayout>
  );
}
