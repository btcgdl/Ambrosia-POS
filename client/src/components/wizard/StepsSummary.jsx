"use client"
import {Card, CardHeader, CardBody, CardFooter, Avatar, Button} from "@heroui/react";
import { Edit2 } from "lucide-react"

export function WizardSummary({ data, onEdit }) {
  const businessTypeLabel = data.businessType === "store" ? "Tienda" : "Restaurante"

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Resumen de tu configuración</h2>
      <p className="text-muted-foreground mb-8">Verifica que todos los datos sean correctos antes de completar</p>
      <div className="space-y-4">

        <Card>
          <CardHeader className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-xs font-medium text-muted-foreground uppercase">Tipo de negocio</p>
              <p className="text-lg font-semibold text-foreground mt-1">{businessTypeLabel}</p>
            </div>
            <Button
              isIconOnly
              color="primary"
              onPress={() => onEdit(1)}
              className="p-2"
              endContent={
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              }
            />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-xs font-medium text-muted-foreground uppercase">Cuenta de usuario</p>
              <p className="text-lg font-semibold text-foreground mt-1">{data.userName}</p>
              <p className="text-lg text-muted-foreground mt-1">Contraseña: {"*".repeat(data.userPassword.length)}</p>
            </div>
            <Button
              isIconOnly
              color="primary"
              onPress={() => onEdit(2)}
              className="p-2"
              endContent={
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              }
            />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-xs font-medium text-muted-foreground uppercase">Datos de la tienda</p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Nombre</p>
                  <p className="font-semibold text-foreground">{data.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dirección</p>
                  <p className="font-semibold text-foreground">{data.businessAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="font-semibold text-foreground">{data.businessPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">{data.businessEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">RFC</p>
                  <p className="font-semibold text-foreground">{data.businessRFC}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Moneda</p>
                  <p className="font-semibold text-foreground">{data.businessCurrency}</p>
                </div>
              </div>
              {data.storeLogo && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">Logo</p>
                  <img
                    src={URL.createObjectURL(data.storeLogo) || "/placeholder.svg"}
                    alt="Store logo"
                    className="w-16 h-16 object-cover rounded border border-border"
                  />
                </div>
              )}
            </div>
            <Button
              isIconOnly
              color="primary"
              onPress={() => onEdit(3)}
              className="p-2"
              endContent={
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              }
            />
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
