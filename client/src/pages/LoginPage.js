import LoginInputField from "../components/Login/LoginInputField";
import { useState } from "react";
import {useUserRole} from "../contexts/UserRoleContext";
import {useNavigate} from "react-router-dom";
import {useMock} from "../contexts/MockSocketContext";

export default function LoginPage() {

    const [userName, setUserName] = useState("");
    const [passWord, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const responseTest = {
        "status": 200,
        "message": "Login successful",
        "data": {
            "role": "admin",
        }
    };

    const { updateUserRole } = useUserRole();
    const navigate = useNavigate();
    const {users} = useMock();

    /*const handleLogin = async () => {
        const formData = new FormData();
        formData.append("username", userName);
        formData.append("password", passWord);
        setLoading(true);
        setError(null);
      
        try {
            const response = await fetch("https://tu-api.com/login", {
                method: "POST",
                body: formData
            });
      
            const result = await response.json();
            console.log("Respuesta del servidor:", result);
            setLoading(false);
      
            if (response.ok) {
                
            } else {
                setError(result.error || "Error desconocido");
            }
            updateUserRole(responseTest.data.role);
            navigate("/rooms");
      
        } catch (error) {
            setLoading(false);
            /!*setError("Error de red o servidor");*!/
        }
    };*/



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
            <form className="w-[50%] mx-auto">
                <LoginInputField 
                    name="USUARIO" 
                    placeholder="Ingrese su usuario" 
                    value={userName} 
                    onChange={(e)=>{setUserName(e.target.value)}}
                />
                <LoginInputField 
                    name="CONTRASEÑA" 
                    placeholder="Ingrese su contraseña" 
                    value={passWord} 
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password"
                />
                <div className="flex justify-evenly">
                    <button 
                        type="button" 
                        className="text-white w-[20%] py-1.5 bg-black/30"
                        onClick={/*handleLogin*/()=>{
                            const user = users.find(user => user.nombre === userName && user.password === passWord);
                            if (user){
                                updateUserRole(user.role);
                                navigate("/rooms");
                            }
                        }}
                    >
                        ENTRAR
                    </button>
                    <button 
                        type="button" 
                        className="text-white w-[20%] py-1.5 bg-black/30" 
                    >
                        SALIR
                    </button>
                </div>
            </form>
        </div>
    </section>)
}