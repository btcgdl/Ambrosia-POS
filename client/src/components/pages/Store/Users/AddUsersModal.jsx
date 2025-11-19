"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, } from "@heroui/react";

export function AddUsersModal({ data, setData, roles, onChange, addUsersShowModal, setAddUsersShowModal }) {
  const t = useTranslations("users");
  const [showPin, setShowPin] = useState(false)
  return (
    <Modal
      isOpen={addUsersShowModal}
      onOpenChange={setAddUsersShowModal}
      backdrop="blur"
      classNames={{
        backdrop: "backdrop-blur-xs bg-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader>
          {t("modal.titleAdd")}
        </ModalHeader>
        <ModalBody>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("User data to submit:", data);
              setData({
                userName: "",
                userPin: "",
                userPhone: "",
                userEmail: "",
                userRole: "Vendedor",
              });
              setAddUsersShowModal(false);
            }}
          >
            <Input
              label={t("modal.userNameLabel")}
              type="text"
              placeholder={t("modal.userNamePlaceholder")}
              value={data.userName}
              onChange={(e) => onChange({ ...data, userName: e.target.value })}
            />
            <Input
              label={t("modal.userEmailLabel")}
              type="email"
              placeholder={t("modal.userEmailPlaceholder")}
              value={data.userEmail}
              onChange={(e) => onChange({ ...data, userEmail: e.target.value })}
            />
            <Input
              label={t("modal.userPhoneLabel")}
              type="tel"
              placeholder={t("modal.userPhonePlaceholder")}
              maxLength={10}
              value={data.userPhone}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                onChange({ ...data, userPhone: onlyNumbers });
              }}
            />
            <Input
              label={t("modal.userPinLabel")}
              type={showPin ? "text" : "password"}
              placeholder={t("modal.userPinPlaceholder")}
              maxLength={4}
              value={data.userPin}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                onChange({ ...data, userPin: onlyNumbers });
              }}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
            <Select
              label={t("modal.userRoleLabel")}
              defaultSelectedKeys={[data.userRole]}
              value={data.userRole}
              onChange={(e) => onChange({ ...data, userRole: e.target.value })}
            >
              {roles.map((role) => (
                <SelectItem key={role}>
                  {role}
                </SelectItem>
              ))}
            </Select>
            <ModalFooter className="flex justify-between p-0 my-4">
              <Button
                variant="bordered"
                type="button"
                className="px-6 py-2 border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onPress={() => setAddUsersShowModal(false)}
              >
                {t("modal.cancelButton")}
              </Button>
              <Button
                color="primary"
                className="bg-green-800"
                type="submit"
              >
                {t("modal.submitButton")}
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
