"use client";
import { motion } from "motion/react";
import closeIcon from "@/assets/UI/close-icon.svg";

import ModalBackdrop from "./modal-backdrop";
import Image from "next/image";
import { CartContext } from "@/store/cart-context";
import { use, useEffect, useRef } from "react";

function Modal({ children, onClose, label }) {
  const { isCartModal, setIsCartModal } = use(CartContext);

  useEffect(() => {
    function handleClick(event) {
      console.log("clicked");

      if (!event.target.closest(".modal-content-wrapper")) {
        if (isCartModal) {
          setIsCartModal(false);
        }
        return;
      }
    }
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  if (label === "cart") {
    return (
      <>
        <ModalBackdrop />
        <motion.dialog
          id="cart-modal"
          initial={{
            x: 500,
            opacity: 0.5,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
          }}
          exit={{
            x: 500,
            opacity: 0.5,
          }}
          open
        >
          <Image src={closeIcon} alt="close-icon" onClick={onClose} priority />
          <div className="modal-content-wrapper">{children}</div>
        </motion.dialog>
      </>
    );
  }

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <motion.dialog
        id="search-modal"
        initial={{
          y: -500,
          opacity: 0.5,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          type: "spring",
        }}
        exit={{
          y: -500,
          opacity: 0.5,
        }}
        open
      >
        <Image src={closeIcon} alt="close-icon" onClick={onClose} priority />
        <div className="modal-content-wrapper">{children}</div>
      </motion.dialog>
    </>
  );
}

export default Modal;
