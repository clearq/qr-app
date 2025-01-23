"use client";

import { useCallback, useEffect, useState } from "react";
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

interface Product {
  id: string;
  title: string;
  description?: string;
}

interface ProductsTableProps {
  selectedShopId: string | null;
}

// Utility function to strip HTML tags
const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

// Utility function to truncate text
const truncateText = (text: string, maxWords: number = 3): string => {
  const words = text.split(" ").filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

export function ProductsTable({ selectedShopId }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const itemsPerPage = 5;

  const fetchProducts = useCallback(async () => {
    if (!selectedShopId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/product/${selectedShopId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error fetching products",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedShopId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/product?id=${productToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product.");
      }

      setProducts((prev) =>
        prev.filter((product) => product.id !== productToDelete)
      );

      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error Deleting Product",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setShowDeleteDialog(true);
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]); // Deselect all
    } else {
      setSelectedProducts(products.map((product) => product.id)); // Select all
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={selectedProducts.length === products.length}
                onChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => {
              const plainTextDescription = stripHtml(product.description || "");
              const truncatedDescription = truncateText(plainTextDescription);

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                    />
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{truncatedDescription}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => confirmDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No products available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedProducts.length} of {products.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this product? This action cannot be
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
