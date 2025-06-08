const modules = {};

export function addModule(name, module) {
    console.log("adding module")
    modules[name] = module;
}

export function getModules() {
    return modules;
}