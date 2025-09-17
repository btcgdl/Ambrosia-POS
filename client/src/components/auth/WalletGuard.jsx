"use client";

import { useContext, useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";
import { AuthContext } from "../../modules/auth/AuthProvider";
import {
  loginWallet,
  logoutWallet,
} from "../../modules/cashier/cashierService";

export default function WalletGuard({
  children,
  placeholder = null,
  title = "Confirmar acceso a Wallet",
  passwordLabel = "Contraseña",
  confirmText = "Entrar",
  onAuthorized,
}) {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const expiryKey = "walletAccessExpiry";
  const expiryTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      // Ensure wallet token is cleared when leaving the page
      logoutWallet().catch(() => {});
      try {
        localStorage.removeItem(expiryKey);
      } catch (_) {}
      if (expiryTimeoutRef.current) {
        clearTimeout(expiryTimeoutRef.current);
        expiryTimeoutRef.current = null;
      }
    };
  }, []);

  // React to unauthorized wallet API responses
  useEffect(() => {
    const handler = () => {
      setAuthorized(false);
      setIsOpen(true);
      try {
        localStorage.removeItem(expiryKey);
      } catch (_) {}
      if (expiryTimeoutRef.current) {
        clearTimeout(expiryTimeoutRef.current);
        expiryTimeoutRef.current = null;
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("wallet:unauthorized", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("wallet:unauthorized", handler);
      }
    };
  }, []);

  // Do not proactively call wallet endpoints here; children handle their own data fetching

  const handleSubmit = async () => {
    if (!password) return;
    setSubmitting(true);
    try {
      await loginWallet(password);
      // Allow Set-Cookie to persist before enabling children
      await new Promise((r) => setTimeout(r, 150));
      setAuthorized(true);
      setIsOpen(false);
      // Track client-side expiry approximately (server token ~120s)
      try {
        const expiresAt = Date.now() + 110 * 1000; // 110s buffer
        localStorage.setItem(expiryKey, String(expiresAt));
        if (expiryTimeoutRef.current) clearTimeout(expiryTimeoutRef.current);
        const ms = Math.max(0, expiresAt - Date.now());
        expiryTimeoutRef.current = setTimeout(() => {
          setAuthorized(false);
          setIsOpen(true);
        }, ms + 250);
      } catch (_) {}
      if (onAuthorized) onAuthorized();
    } catch (_) {
      // apiClient already shows a toast on error
    } finally {
      setSubmitting(false);
      setPassword("");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        isDismissable={false}
        hideCloseButton
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            <Input
              label={passwordLabel}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDisabled={submitting}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onPress={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isDisabled={!password}
              isLoading={submitting}
            >
              {confirmText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {authorized ? children : placeholder}
    </>
  );
}
