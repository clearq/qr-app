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
import { useLanguage } from "@/context/LanguageContext"; // Import the useLanguage hook

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ id, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { translations } = useLanguage(); // Use the translations

  const handleDelete = async () => {
    try {
      await onDelete(id);
      toast({
        title: translations.success,
        description: translations.itemDeletedSuccessfully,
      });
    } catch (error) {
      toast({
        title: translations.error,
        description: translations.failedToDeleteItem,
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
          <DialogTitle>{translations.confirmDeletion}</DialogTitle>
          <DialogDescription>
            {translations.deleteConfirmationMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            className="hover:bg-gray-100"
          >
            {translations.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {translations.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
