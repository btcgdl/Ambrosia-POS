import { useState } from "react";
import NavBar from "../components/navbar/NavBar";
import Header from "../components/header/Header";
import { useMock } from "../contexts/MockSocketContext";

export default function Users() {
    const { users, addUser, updateUser, deleteUser } = useMock();
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ nombre: "", role: "waiter", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            updateUser({ ...form, id: editing });
        } else {
            addUser(form);
        }
        setForm({ nombre: "", role: "waiter", password: "" });
        setEditing(null);
    };

    const startEdit = (user) => {
        setForm({ nombre: user.nombre, role: user.role, password: user.password });
        setEditing(user.id);
    };

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
                        <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl">
                            <input
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Nombre"
                                className="text-2xl p-3 rounded-lg"
                                required
                            />
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="text-2xl p-3 rounded-lg"
                            >
                                <option value="admin">Admin</option>
                                <option value="waiter">Mesero</option>
                            </select>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                className="text-2xl p-3 rounded-lg"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600"
                            >
                                {editing ? "Actualizar Usuario" : "Agregar Usuario"}
                            </button>
                        </form>

                        <div className="w-full max-w-4xl mt-4 space-y-4">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md"
                                >
                                    <div>
                                        <strong>{user.nombre}</strong> ({user.role})
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                            onClick={() => startEdit(user)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            onClick={() => deleteUser(user.id)}
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
