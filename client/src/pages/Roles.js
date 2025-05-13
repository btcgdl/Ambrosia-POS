import { useState } from "react";
import NavBar from "../components/navbar/NavBar";
import Header from "../components/header/Header";
import { useMock } from "../contexts/MockSocketContext";

export default function Roles() {
    const { roles, addRole, updateRole, deleteRole } = useMock();
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ role: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            updateRole({ ...form, id: editing });
        } else {
            addRole(form);
        }
        setForm({ role: "", password: "" });
        setEditing(null);
        setShowPassword(false);
    };

    const startEdit = (role) => {
        setForm({ role: role.role, password: role.password });
        setEditing(role.id);
        setShowPassword(false);
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[80%] w-[80%] bg-amber-200 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
                        <h2 className="text-3xl font-bold">Gestión de Roles</h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl">
                            <input
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                placeholder="Nombre del Rol"
                                className="text-2xl p-3 rounded-lg"
                                required
                            />
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Contraseña"
                                    className="text-2xl p-3 rounded-lg w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl"
                                >
                                    {showPassword ? "👁️‍🗨️" : "👁️"}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600"
                            >
                                {editing ? "Actualizar Rol" : "Agregar Rol"}
                            </button>
                        </form>

                        <div className="w-full max-w-4xl mt-4 space-y-4">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md"
                                >
                                    <div>
                                        <strong>{role.role}</strong> – Contraseña: ****
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                            onClick={() => startEdit(role)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            onClick={() => deleteRole(role.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}