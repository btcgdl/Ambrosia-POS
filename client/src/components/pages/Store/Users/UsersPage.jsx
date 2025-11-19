"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { StoreLayout } from "../StoreLayout";
import { UsersTable } from "./UsersTable";
import { AddUsersModal } from "./AddUsersModal";

const USERS = [
  {
    id: 1,
    name: "Jordano Anaya",
    role: "Cajero",
    email: "jordipirata@ambrosia.dev",
    phone: "4431342288",
    status: "Activo",
  },
  {
    id: 2,
    name: "Alberto Vidarte",
    role: "Almacen",
    email: "betornillo@ambrosia.dev",
    phone: "4431236969",
    status: "Activo",
  },
  {
    id: 3,
    name: "Carlos Ruz",
    role: "Supervisor",
    email: "carlosruz@ambrosia.dev",
    phone: "4431342288",
    status: "Activo",
  },
];

export default function UsersPage() {

  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    userName: "",
    userPin: "",
    userPhone: "",
    userEmail: "",
    userRole: "Vendedor",
  })
  const handleDataChange = (newData) => {
    setData((prev) => ({ ...prev, ...newData }))
  }
  const ROLES = [
    "Vendedor",
    "Cajero",
    "Supervisor",
    "Almacén",
  ];
  const t = useTranslations("users");

  return (
    <StoreLayout>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-green-900">{t("title")}</h1>
          <p className="text-gray-800 mt-4">
            {t("subtitle")}
          </p>
        </div>
        <Button
          color="primary"
          className="bg-green-800"
          onPress={() => setShowModal(true)}
        >
          {t("addUser")}
        </Button>
      </header>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <UsersTable users={USERS} />
      </div>
      {showModal && (
        <AddUsersModal
          data={data}
          setData={setData}
          roles={ROLES}
          onChange={handleDataChange}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </StoreLayout>
  );
}
