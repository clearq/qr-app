import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"; // Assuming you're using a dialog component
import { toast } from "@/components/ui/use-toast";

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ id, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete(id);
      toast({
        title: "Success",
        description: "The item has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false); // Close the dialog after deletion
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-red-50 text-red-600 hover:text-red-700 p-2 rounded-lg transition-colors duration-200"
        >
          <FaTrash size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
