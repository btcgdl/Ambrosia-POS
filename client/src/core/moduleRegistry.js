const modules = {};

export function addModule(name, module) {
  modules[name] = module;
}

export function getModules() {
  return modules;
}

export function removeModules() {
  for (const key in modules) {
    delete modules[key];
  }
}

// Función adicional útil: eliminar un módulo específico
export function removeModule(name) {
  delete modules[name];
}
