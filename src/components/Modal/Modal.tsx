import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
children: React.ReactNode;
onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
useEffect(() => {
const onKey = (e: KeyboardEvent) => {
if (e.key === "Escape") onClose();
};
document.addEventListener("keydown", onKey);
return () => document.removeEventListener("keydown", onKey);
}, [onClose]);

return ReactDOM.createPortal(
<div className={css.backdrop} role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
<div className={css.modal}>{children}</div>
</div>,
document.body
);
}