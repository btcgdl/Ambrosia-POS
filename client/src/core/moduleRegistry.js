const modules = {};

export function addModule(name, module) {
    modules[name] = module;
}

export function getModules() {
    return modules;
}