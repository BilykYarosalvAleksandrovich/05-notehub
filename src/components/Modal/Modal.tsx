import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

// ⬅️ ВИДАЛЕНО ГЛОБАЛЬНЕ ОГОЛОШЕННЯ modalRoot

export default function Modal({ onClose, children }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // ⬅️ Отримуємо цільовий елемент тут, коли компонент монтується
  const modalRoot = document.querySelector("#modal-root") as HTMLElement;

  // Логіка блокування прокручування
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Логіка закриття по клавіші ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Логіка закриття по кліку на бекдроп
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // ⬅️ КРИТИЧНА ПЕРЕВІРКА: Якщо елемент не знайдено, не рендеримо нічого
  if (!modalRoot) {
    console.error("Target container #modal-root not found in the DOM.");
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={css.backdrop}
      ref={backdropRef}
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
