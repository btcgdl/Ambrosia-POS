import React, { useState } from "react";

// Componente de Pestañas Reutilizable
// Acepta una prop `tabs` que es un array de objetos.
// Cada objeto debe tener: { label: 'Título de la Pestaña', content: <JSX /> }
const Tabs = ({ tabs }) => {
  // Estado para manejar el índice de la pestaña activa. Inicia en 0.
  const [activeTab, setActiveTab] = useState(0);

  // Si no se proporcionan pestañas o el array está vacío, no se renderiza nada.
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="w-full  mx-auto">
      {/* Contenedor de los botones de las pestañas */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            // Al hacer clic, se actualiza el estado con el nuevo índice
            onClick={() => setActiveTab(index)}
            className={`
              py-3 px-6 font-medium text-md focus:outline-none transition-all duration-300 ease-in-out
              ${
                activeTab === index
                  ? "border-b-2 border-indigo-600 text-indigo-600" // Estilos para la pestaña activa
                  : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-t-lg" // Estilos para pestañas inactivas
              }
            `}
            // Atributos de accesibilidad
            role="tab"
            aria-selected={activeTab === index}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenedor del contenido de la pestaña activa */}
      <div className="p-5 bg-white rounded-b-lg shadow-md">
        {/* Se renderiza solo el contenido de la pestaña que corresponde al índice activo */}
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
