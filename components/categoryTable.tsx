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
        title: "Error fetching categories",
        description: "Failed to load categories. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedShopId]);

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
        title: "Category Deleted",
        description: "The category was successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error Deleting Category",
        description: "An unexpected error occurred.",
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
    return <div>Loading categories...</div>;
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
            <TableHead>Category Name</TableHead>
            <TableHead>Number of Products</TableHead>
            <TableHead>Delete</TableHead>
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
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No categories available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-muted-foreground">
          {selectedCategories.length} of {categories.length} selected.
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
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
