"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLanguage } from "@/context/LanguageContext"; // Import the useLanguage hook

interface Category {
  id: string;
  name: string;
  productsCount: number; // Number of products in this category
}

interface CategoryTableProps {
  selectedShopId: string | null;
}

export function CategoryTable({ selectedShopId }: CategoryTableProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Number of items per page

  const { translations } = useLanguage(); // Use the translations

  const fetchCategories = useCallback(async () => {
    if (!selectedShopId) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/category?shopId=${selectedShopId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories.");
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: translations.error,
        description: translations.failedToFetchShops,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedShopId, translations]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`/api/category?id=${categoryToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category.");
      }

      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryToDelete)
      );

      toast({
        title: translations.success,
        description: translations.itemDeletedSuccessfully,
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: translations.error,
        description: translations.failedToDeleteItem,
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteDialog(true);
  };

  const toggleSelectCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]); // Deselect all
    } else {
      setSelectedCategories(categories.map((category) => category.id)); // Select all
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>{translations.loading}...</div>;
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selectedCategories.length === categories.length}
                onChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>{translations.categoryName}</TableHead>
            <TableHead>{translations.numberOfProducts}</TableHead>
            <TableHead>{translations.delete}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCategories.length > 0 ? (
            currentCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleSelectCategory(category.id)}
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className="flex justify-center items-center">
                  {category.productsCount}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => confirmDelete(category.id)}
                  >
                    {translations.delete}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                {translations.noCategoriesAvailable}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-muted-foreground">
          {selectedCategories.length} {translations.of} {categories.length}{" "}
          {translations.selected}.
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center w-full mt-4">
        <Pagination>
          <PaginationContent>
            {currentPage === 1 ? (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ pointerEvents: "none", color: "#ccc" }}
                >
                  &lt;
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              </PaginationItem>
            )}
            {[...Array(totalPages)].map((_, pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(pageIndex + 1)}
                  isActive={currentPage === pageIndex + 1}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage === totalPages ? (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{ pointerEvents: "none", color: "#ccc" }}
                >
                  &gt;
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translations.confirmDeletion}</DialogTitle>
          </DialogHeader>
          <p>{translations.deleteConfirmationMessage}</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              {translations.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {translations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
