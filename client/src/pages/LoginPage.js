import LoginInputField from "../components/Login/LoginInputField";
import { useState } from "react";
import {useUserRole} from "../contexts/UserRoleContext";
import {useNavigate} from "react-router-dom";
import {login} from "../services/authService";

export default function LoginPage() {

    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { updateUserRole } = useUserRole();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await login({role, password});
            updateUserRole(response.data.role);
            navigate("/rooms");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError("Error de red o servidor");
            console.log(error.message);
        }
    };



    return(
    <section className = "w-screen h-screen">
        {error && (
            <div className="fixed bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
                {error}
            </div>
        )}
        {loading && (
            <div className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg">
                Cargando...
            </div>
        )}
        <div
            className="w-full h-[45%] bg-[url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')] bg-cover bg-top bg-no-repeat flex items-center justify-center"
        >
            <img
                src="temporal-logo.jpg"
                alt="Logotipo temporal"
                className="w-[200px] h-[350px] object-contain"
            />
        </div>
        <div className="w-[100%] h-[55%] bg-[var(--color-primary)]">
            <h2 className="text-[50px] text-white text-center pb-[10px]">INICIAR SESIÓN</h2>
            <form className="w-[50%] mx-auto" onSubmit={handleLogin}>
                <LoginInputField 
                    name="USUARIO" 
                    placeholder="Ingrese su usuario" 
                    value={role}
                    onChange={(e)=>{setRole(e.target.value)}}
                />
                <LoginInputField 
                    name="CONTRASEÑA" 
                    placeholder="Ingrese su contraseña" 
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password"
                />
                <div className="flex justify-evenly">
                    <button 
                        type="submit"
                        className="text-white w-[20%] py-1.5 bg-black/30 cursor-pointer"
                    >
                        ENTRAR
                    </button>
                    <button 
                        type="button" 
                        className="text-white w-[20%] py-1.5 bg-black/30 cursor-pointer"
                    >
                        SALIR
                    </button>
                </div>
            </form>
        </div>
    </section>)
}