"use client";

import { useEffect, useState } from "react";
import { getUsers, loginFromService } from "./authService";
import { ChefHat, Delete, LogIn, Users, Trash2 } from "lucide-react";
import {
  addToast,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
export default function PinLoginNew() {
  const [pin, setPin] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([
    {
      id: "no-employee",
      name: "No hay Empleados Disponibles",
      role: "",
      pin: "",
      avatar: "MG",
    },
  ]);
  const { login, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function getUsersFromService() {
      try {
        const users = await getUsers();

        const employeesWithRoleName = users.map((user) => {
          return {
            ...user,
            role: "Empleado", //TODO Update with RoleName
            avatar: "MG", //TODO FOR UPDATE : Add avatar image
          };
        });

        setEmployees(employeesWithRoleName);
        console.log(users);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
    getUsersFromService();
  }, []);

  const handleNumberClick = (number) => {
    if (pin.length < 4) {
      setPin((prev) => prev + number);
      setError("");
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError("");
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  const handleLogin = async () => {
    if (!selectedUser) {
      setError("Por favor selecciona un empleado");
      return;
    }

    if (pin.length < 4) {
      setError("El PIN debe tener al menos 4 dígitos");
      return;
    }

    setIsLoading(true);
    setError("");

    const employee = employees.find((emp) => emp.id === selectedUser);

    setTimeout(async () => {
      try {
        await loginFromService({ name: employee.name, pin });

        // Consultar usuario desde /api/auth/me (servidor) para datos derivados
        const meRes = await fetch("/api/auth/me", { credentials: "include" });
        if (meRes.ok) {
          const me = await meRes.json();
          // Mantener compatibilidad con módulos que leen localStorage
          if (me?.userId) localStorage.setItem("userId", me.userId);
          if (me?.role) localStorage.setItem("roleId", me.role);
          // Nombre visible (no sensible) desde selección
          localStorage.setItem("username", employee.name);
        }

        addToast({
          title: "Inicio de sesión exitoso",
          description: `¡Bienvenido ${employee.name}! Acceso concedido como ${employee.role}.`,
          color: "success",
        });
        setPin("");
        setSelectedUser("");
        login();
        router.push("/");
        setIsLoading(false);
      } catch (error) {
        setError("PIN incorrecto para el empleado seleccionado.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", ""],
  ];

  return (
    <div className="min-h-screen gradient-fresh flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white mx-auto my-auto">
        <CardHeader className="text-center space-y-3 pb-4 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mx-auto w-16 h-16 bg-mint rounded-full flex items-center justify-center shadow-lg">
              <ChefHat className="w-8 h-8 text-forest" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-deep">
                Restaurante Verde
              </h1>
              <p className="text-forest mt-2 text-base text-center">
                Ingresa tu PIN para acceder al sistema
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-4 px-6 pb-6">
          {/* User Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-deep flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Seleccionar Empleado
            </label>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              placeholder="Toca para elegir tu nombre"
              variant="bordered"
              size="lg"
              aria-label="Employees"
              classNames={{
                trigger:
                  "h-12 border-2 border-mint/30 hover:border-forest data-[focus=true]:border-forest",
                label: "text-forest/70 text-base",
                value: "text-lg text-deep",
                listboxWrapper: "max-h-80",
                popoverContent: "bg-white/95 backdrop-blur-md",
              }}
              listboxProps={{
                itemClasses: {
                  base: [
                    "rounded-md",
                    "text-default-500",
                    "transition-opacity",
                    "data-[hover=true]:text-foreground",
                    "data-[hover=true]:bg-default-100",
                    "data-[selectable=true]:focus:bg-default-50",
                    "data-[pressed=true]:opacity-70",
                    "data-[focus-visible=true]:ring-default-500",
                  ],
                },
              }}
              renderValue={(items) => {
                return items.map((item) => {
                  const employee = employees.find((emp) => emp.id === item.key);
                  if (!employee) return null;

                  return (
                    <div key={item.key} className="flex items-center gap-3">
                      <Avatar
                        className="flex-shrink-0 bg-mint text-forest font-bold"
                        size="sm"
                        name={employee.avatar}
                      />
                      <div className="flex flex-col">
                        <span className="text-deep font-semibold">
                          {employee.name}
                        </span>
                        <span className="text-forest text-sm">
                          {employee.role}
                        </span>
                      </div>
                    </div>
                  );
                });
              }}
            >
              {employees.map((employee) => (
                <SelectItem
                  key={employee.id}
                  value={employee.id}
                  textValue={employee.name}
                  className="py-2"
                >
                  <div className="flex items-center gap-4">
                    <Avatar
                      className="flex-shrink-0 bg-mint text-forest font-bold shadow-sm"
                      size="md"
                      name={employee.avatar}
                      fallback={employee.avatar}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-deep text-lg">
                        {employee.name}
                      </span>
                      <span className="text-forest text-sm">
                        {employee.role}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* PIN Display */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-deep">
              PIN de Acceso
            </label>
            <div className="text-center">
              <Input
                type="password"
                variant="bordered"
                value={pin}
                readOnly
                size="lg"
                placeholder="----"
                maxLength={4}
              />
            </div>
            {error && (
              <div className="text-red-600 text-base text-center font-semibold bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Number Pad - Usando las clases personalizadas */}
          <div className="grid grid-cols-3 gap-4">
            {numbers.flat().map((number, index) => (
              <Button
                key={index}
                variant={number ? "outline" : "ghost"}
                size="md"
                className={`h-14 text-xl font-bold transition-all duration-200 ${
                  number
                    ? "border-2 border-mint bg-cream/50 hover:bg-mint hover:text-deep hover:border-forest active:scale-95 shadow-md"
                    : "invisible"
                }`}
                onPress={() => number && handleNumberClick(number)}
                disabled={isLoading || !number}
              >
                {number}
              </Button>
            ))}
          </div>

          {/* Action Buttons - Usando las clases personalizadas */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="md"
              onPress={handleDelete}
              disabled={isLoading || pin.length === 0}
              className="h-12 text-base font-semibold border-2 border-lime bg-lime/20 hover:bg-lime hover:text-deep active:scale-95"
            >
              <Delete className="w-4 h-4 mr-2" />
              Borrar
            </Button>
            <Button
              variant="outline"
              size="md"
              onPress={handleClear}
              disabled={isLoading || pin.length === 0}
              className="h-12 text-base font-semibold border-2 border-lime bg-lime/20 hover:bg-lime hover:text-deep active:scale-95"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>

          {/* Login Button - Usando gradiente personalizado */}
          <Button
            onPress={handleLogin}
            disabled={isLoading || pin.length === 0}
            size="md"
            className="w-full h-14 text-lg font-bold gradient-forest text-white shadow-lg active:scale-95 transition-all duration-200 border-0"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Verificando...
              </div>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </>
            )}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
