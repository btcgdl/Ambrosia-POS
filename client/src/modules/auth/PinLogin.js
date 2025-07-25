﻿import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import { getUsers, loginFromService } from "./authService";
import { getHomeRoute } from "../../utils/getHomeRoute";
import { jwtDecode } from "jwt-decode";
import { useUserRole } from "../../contexts/UserRoleContext";
import { useAuth } from "./useAuth";
import {getLogger} from "../../utils/loggerStore";

export default function PinLogin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { login, logout } = useAuth();
  const { updateUserRole } = useUserRole();
  const showLog = getLogger();

  useEffect(() => {
    async function getUsersFromService() {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
    getUsersFromService();
  }, []);

  const handleButtonClick = (num) => {
    if (pin.length < 4) {
      setPin((prevPin) => prevPin + num);
    }
  };

  const handleClear = () => {
    setPin(pin.slice(0, -1));
  };

  const handleLogInWithPin = async () => {
    if (!selectedUser) {
      if (showLog) showLog("error", "Seleccione un usuario");
      return;
    }
    if (pin.length < 4) {
      if (showLog) showLog("error", "El pin debe ser de 4 digitos");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await loginFromService({ name: selectedUser, pin });
      const accessToken = getCookieValue("accessToken");
      const tokenData = await jwtDecode(accessToken);
      console.log(tokenData);
      updateUserRole(tokenData.role);
      localStorage.setItem("userId", tokenData.userId);
      login();
      navigate(getHomeRoute());
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getCookieValue = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)"),
    );
    return match ? match[2] : null;
  };

  if (isLoading) {
    return (
      <main className="h-[90%] w-full flex items-center justify-center">
        <div className="h-[80%] w-[80%] bg-amber-200 flex flex-col items-center justify-center p-6">
          <p className="text-3xl font-bold">Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[90%] w-full flex items-center justify-center">
      <div className="h-[80%] w-[80%] bg-amber-200 rounded-xl p-4 flex flex-col items-center justify-center gap-4 flex-wrap overflow-hidden">
        <h2 className="text-3xl font-bold">Ingresa con tu PIN</h2>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="text-xl p-2 rounded-lg w-full max-w-md bg-white border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          {users.length !== 0 && <option key="">Selecciona un usuario</option>}
          {users.length !== 0 ? (
            users.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))
          ) : (
            <option key="">No hay usuarios disponibles</option>
          )}
        </select>

        <div className="text-3xl font-bold mb-2">
          <p>PIN Ingresado:</p>
          <div className={"min-h-[2.5rem] text-center"}>
            <span>{"*".repeat(pin.length)}</span>
          </div>
        </div>

        {error && <p className="text-red-600 text-xl">{error}</p>}

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className="bg-gray-800 text-white py-4 px-6 text-2xl rounded-lg hover:bg-gray-700 max-w-full"
              onClick={() => handleButtonClick(num)}
              disabled={isLoading}
            >
              {num}
            </button>
          ))}
          <div className="col-span-3 flex justify-center">
            <button
              className="bg-gray-800 text-white py-4 px-6 text-2xl rounded-lg hover:bg-gray-700 max-w-full"
              onClick={() => handleButtonClick(0)}
              disabled={isLoading}
            >
              0
            </button>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          <button
            className="bg-red-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-red-600"
            onClick={handleClear}
            disabled={isLoading}
          >
            Borrar
          </button>
          <button
            onClick={handleLogInWithPin}
            className="bg-green-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-green-600"
          >
            Ingresar
          </button>
        </div>
      </div>
    </main>
  );
}
