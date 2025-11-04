"use client"

import { useState } from "react"
import { Input } from "@heroui/react"
import { Eye, EyeOff } from "lucide-react"

export function UserAccountStep({ data, onChange }) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handlePasswordChange = (password) => {
    onChange({ ...data, userPassword: password })

    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    setPasswordStrength(strength)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "bg-muted"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-yellow-500"
    /* Updated password strength colors to use green palette */
    if (passwordStrength === 3) return "bg-emerald-500"
    return "bg-green-600"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength === 1) return "Débil"
    if (passwordStrength === 2) return "Regular"
    if (passwordStrength === 3) return "Buena"
    return "Muy fuerte"
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Crear cuenta de usuario</h2>
      <p className="text-muted-foreground mb-8">Estos datos serán utilizados para acceder a tu sistema PoS</p>

      <div className="space-y-6">
        <Input
          label="Nombre de Usuario"
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          value={data.userName}
          onChange={(e) => onChange({ ...data, userName: e.target.value })}
        />

        <Input
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          placeholder="Ingresa una contraseña segura"
          value={data.userPassword}
          onChange={(e) => handlePasswordChange(e.target.value)}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />
        <div>
          {data.userPassword && (
            <div className="mt-3">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= passwordStrength ? getPasswordStrengthColor() : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Fortaleza: <span className="font-medium">{getPasswordStrengthText()}</span>
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres
            especiales.
          </p>
        </div>
      </div>
    </div>
  )
}
