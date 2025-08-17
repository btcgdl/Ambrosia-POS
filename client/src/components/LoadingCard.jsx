"use client";
import { Card, CardBody, Spinner } from "@heroui/react";

export default function LoadingCard({ 
  message = "Cargando...", 
  size = "lg", 
  color = "success",
  fullScreen = true 
}) {
  const containerClass = fullScreen 
    ? "min-h-screen gradient-fresh flex items-center justify-center p-4"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClass}>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white">
        <CardBody className="flex flex-col items-center justify-center py-12">
          <Spinner size={size} color={color} />
          <p className="text-lg font-semibold text-deep mt-4">
            {message}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}