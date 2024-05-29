import React from "react";
import { Button } from "@/components/ui/button";

interface AddButtonProps {
  onClick: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <Button variant="outline" onClick={onClick}>
      Add URL
    </Button>
  );
};
