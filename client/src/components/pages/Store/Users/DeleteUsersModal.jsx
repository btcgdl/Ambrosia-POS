"use client";

import { useTranslations } from "next-intl";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

export function DeleteUsersModal({ user, deleteUsersShowModal, setDeleteUsersShowModal, onConfirm }) {
  const t = useTranslations("users");
  return (
    <Modal
      isOpen={deleteUsersShowModal}
      onOpenChange={setDeleteUsersShowModal}
      backdrop="blur"
      classNames={{
        backdrop: "backdrop-blur-xs bg-white/10",
      }}
    >
      <ModalContent>
        <ModalHeader>{t("modal.titleDelete")}</ModalHeader>
        <ModalBody>
          <p>{t("modal.subtitleDelete")}<b> {user?.name}</b>?</p>
          <p className="text-red-500 text-sm">{t("modal.warningDelete")}</p>
        </ModalBody>
        <ModalFooter>
          <Button onPress={() => setDeleteUsersShowModal(false)}>
            {t("modal.cancelButton")}
          </Button>
          <Button color="danger" onPress={onConfirm}>
            {t("modal.deleteButton")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
