import React from "react";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ id, onDelete }) => {
  return (
    <Button
      className="hover:bg-red-500 w-full"
      variant="ghost"
      onClick={() => onDelete(id)}
    >
      <FaTrash className="text-red hover:text-primary" size={20} />
    </Button>
  );
};
