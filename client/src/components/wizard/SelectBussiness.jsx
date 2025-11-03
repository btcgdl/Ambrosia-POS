"use client"

import { Store, UtensilsCrossed } from "lucide-react"
import {Card, CardHeader, CardBody } from "@heroui/card";

export function BusinessTypeStep({ value, onChange }) {
  console.log(value)
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">¿Qué tipo de negocio tienes?</h2>
      <p className="text-muted-foreground mb-8">Selecciona el tipo de negocio para personalizar tu experiencia</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          isPressable
          onPress={() => onChange("store")}
          className={`hover:bg-green-200 py-4 ${
            value === "store" ? "bg-green-100" : ""
          }`}
        >
          <CardHeader>
            <div className="flex flex-col">
              <Store className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Tienda</h3>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted-foreground">
              Venta de productos al por menor. Ideal para tiendas de ropa, electrónica, etc.
            </p>
          </CardBody>
        </Card>

        <Card
          isPressable
          onPress={() => onChange("restaurant")}
          className={`hover:bg-green-200 py-4 ${
            value === "restaurant" ? "bg-green-100" : ""
          }`}
        >
          <CardHeader>
            <div className="flex flex-col">
              <UtensilsCrossed className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Restaurante</h3>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted-foreground">
              Servicio de alimentos y bebidas. Incluye gestión de mesas y pedidos.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
