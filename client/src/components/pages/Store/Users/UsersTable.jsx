"use client";

import { useTranslations } from "next-intl";
import { Button, Chip } from "@heroui/react";
import { Pencil, Trash } from 'lucide-react';

export function UsersTable({ users, onEditUser, onDeleteUser }) {
  const t = useTranslations("users");

  return (
    <section className="shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-green-800 text-white text-left">
            <th className="py-2 px-3">{t("name")}</th>
            <th className="py-2 px-3">{t("role")}</th>
            <th className="py-2 px-3">{t("email")}</th>
            <th className="py-2 px-3">{t("phone")}</th>
            <th className="py-2 px-3">{t("status")}</th>
            <th className="py-2 px-3 text-right">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={user.id}
              className={idx % 2 === 0 ? "bg-green-50" : "bg-green-100"}
            >
              <td className="py-2 px-3">{user.name}</td>
              <td className="py-2 px-3">
                <Chip
                  className="bg-green-200 text-xs text-green-800 border border-green-300"
                >
                  {user.role}
                </Chip>
              </td>
              <td className="py-2 px-3">{user.email}</td>
              <td className="py-2 px-3">{user.phone}</td>
              <td className="py-2 px-3">
                <Chip
                  className="bg-green-200 text-xs text-green-800 border border-green-300"
                >
                  {user.status}
                </Chip>
              </td>
              <td className="flex justify-end space-x-4 py-2 px-3">
                <Button
                  isIconOnly
                  className="text-xs text-white bg-blue-500"
                  onPress={() => onEditUser(user)}
                >
                  <Pencil />
                </Button>
                <Button
                  isIconOnly
                  color="danger"
                  className="text-xs text-white"
                  onPress={() => onDeleteUser(user)}
                >
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
