import { useState, useEffect } from "react";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import {getUsers, addUser, updateUser, deleteUser, getRoles} from "./authService";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", pin: "", role: "" });
    const [showPin, setShowPin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [roles, setRoles] = useState([]) ;

    useEffect(() => {
        async function fetchUsers() {
            try {
                setIsLoading(true);
                const response = await getUsers();
                setUsers(response);
            } catch (err) {
                setError("Error al cargar los usuarios");
                setIsLoading(false);
            }
        }

        async function fetchRoles(){
            try {
                setIsLoading(true);
                const response = await getRoles();
                setRoles(response);
                console.log(response);
            } catch (err) {
                setError("Error al cargar los roles");
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsers().then(r => fetchRoles());
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === "pin" ? value.replace(/\D/g, "") : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const pinAsInt = parseInt(form.pin, 10);
            if (isNaN(pinAsInt)) {
                throw new Error("El PIN debe ser un número válido");
            }
            const userData = { ...form, pin: pinAsInt };
            if (editing) {
                await updateUser({ ...userData, id: editing });
            } else {
                await addUser(userData);
            }
            const response = await getUsers();
            setUsers(response);
            setForm({ name: "", pin: "", role:"" });
            setEditing(null);
            setShowPin(false);
        } catch (err) {
            setError(err.message || "Error al guardar el usuario");
        } finally {
            setIsLoading(false);
        }
    };

    const startEdit = (user) => {
        setForm({ name: user.name, pin: user.pin.toString(), role: user.role });
        setEditing(user.id);
        setShowPin(false);
    };

    const handleDelete = async (userId) => {
        setError("");
        setIsLoading(true);
        try {
            await deleteUser(userId);
            const response = await getUsers();
            setUsers(response);
        } catch (err) {
            setError(err.message || "Error al eliminar el usuario");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleShowPin = () => {
        setShowPin((prev) => !prev);
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[90%] w-[90%] bg-amber-100 flex flex-col items-center justify-center p-6">
                            <p className="text-3xl font-bold">Cargando usuarios...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error && users.length === 0) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[90%] w-[90%] bg-amber-100 flex flex-col items-center justify-center p-6">
                            <p className="text-3xl font-bold text-red-600">{error}</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
                        <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>

                        {error && <p className="text-red-600 text-xl">{error}</p>}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl">
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Nombre"
                                className="text-2xl p-3 rounded-lg"
                                required
                                disabled={isLoading}
                            />
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="text-2xl p-3 rounded-lg"
                                required
                                disabled={isLoading || roles.length === 0}
                            >
                                <option value="">Selecciona un rol</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.role}
                                    </option>
                                ))}
                            </select>
                            <div className="relative">
                                <input
                                    name="pin"
                                    type={showPin ? "text" : "password"}
                                    maxLength={6}
                                    value={form.pin}
                                    onChange={handleChange}
                                    placeholder="PIN (solo números)"
                                    className="text-2xl p-3 rounded-lg w-full"
                                    required
                                    pattern="\d*"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPin}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl"
                                    disabled={isLoading}
                                >
                                    {showPin ? "👁️‍🗨️" : "👁️"}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600"
                                disabled={isLoading}
                            >
                                {editing ? "Actualizar Usuario" : "Agregar Usuario"}
                            </button>
                        </form>

                        <div className="w-full max-w-4xl mt-4 space-y-4">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md"
                                >
                                    <div>
                                        <strong>{user.name}</strong> – PIN: ****
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                            onClick={() => startEdit(user)}
                                            disabled={isLoading}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            onClick={() => handleDelete(user.id)}
                                            disabled={isLoading}
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