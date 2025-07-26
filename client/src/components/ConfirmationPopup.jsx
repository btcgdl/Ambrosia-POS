import React, { useState } from "react";

const ConfirmationPopup = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de que quieres continuar?",
  customBody,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
  loading = false,
  hideDefaultButtons = false,
  customBodyProps = {},
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    const iconClass = "text-2xl";
    switch (type) {
      case "danger":
        return (
          <i
            className={`bi bi-exclamation-triangle-fill text-red-500 ${iconClass}`}
          ></i>
        );
      case "success":
        return (
          <i
            className={`bi bi-check-circle-fill text-green-500 ${iconClass}`}
          ></i>
        );
      case "info":
        return (
          <i
            className={`bi bi-info-circle-fill text-blue-500 ${iconClass}`}
          ></i>
        );
      default:
        return (
          <i
            className={`bi bi-exclamation-triangle-fill text-yellow-500 ${iconClass}`}
          ></i>
        );
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white";
      default:
        return "bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white";
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            disabled={loading}
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {customBody ? (
            typeof customBody === "function" ? (
              customBody(customBodyProps)
            ) : (
              customBody
            )
          ) : (
            <p className="text-gray-600 text-base leading-relaxed">{message}</p>
          )}
        </div>

        {/* Actions */}
        {!hideDefaultButtons && (
          <div className="flex flex-col space-y-3 p-6 pt-0 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base min-h-12 touch-manipulation"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-6 py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base min-h-12 touch-manipulation ${getConfirmButtonStyle()}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPopup;
