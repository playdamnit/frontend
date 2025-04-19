"use client";

import { useState } from "react";
import AIChatModal from "./AIChatModal";

interface AIChatButtonProps {
  children: React.ReactNode;
}

export default function AIChatButton({ children }: AIChatButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={handleOpenModal} className="cursor-pointer">
        {children}
      </div>
      <AIChatModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
