import React from "react";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ id, onDelete }) => {
  return (
    <Button
      className="hover:bg-red-500"
      variant="outline"
      onClick={() => onDelete(id)}
    >
      🗑️
    </Button>
  );
};
