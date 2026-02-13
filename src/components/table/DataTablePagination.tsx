// DataTablePagination.tsx
// DataTablePagination.tsx
import type {Table} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";
import { Button } from "@/components/ui/button.tsx";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
                                             table,
                                           }: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  // Helper to generate page numbers to display
  // Returns an array of numbers (0-indexed) or "..." for ellipsis
  const getPageNumbers = () => {
    const totalPageCount = pageCount;
    const currentPage = pageIndex + 1;
    const siblingCount = 1; // How many numbers to show immediately around current page

    // If few pages, show all of them without ellipsis
    if (totalPageCount <= 5) {
      return Array.from({ length: totalPageCount }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // Always show First Page
    pages.push(1);

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - siblingCount);
    const endPage = Math.min(totalPageCount - 1, currentPage + siblingCount);

    // Add ellipsis before startPage if there's a gap
    if (startPage > 2) {
      pages.push("...");
    }

    // Add pages in the middle range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis after endPage if there's a gap
    if (endPage < totalPageCount - 1) {
      pages.push("...");
    }

    // Always show Last Page
    pages.push(totalPageCount);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Page Size Selector */}
      <div className="flex items-center space-x-2 w-full">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[5, 10, 25, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
            {/* "All" sets page size to total row count */}
            <SelectItem value={`${table.getFilteredRowModel().rows.length}`}>All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pagination Controls */}
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              First
            </Button>
          </PaginationItem>

          <PaginationItem>
            <PaginationPrevious
              onClick={() => !table.getCanPreviousPage() ? null : table.previousPage()}
              aria-disabled={!table.getCanPreviousPage()}
              className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {/* Render Dynamic Page Numbers */}
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const pageNum = Number(page);
            const isCurrent = pageNum === pageIndex + 1;

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => table.setPageIndex(pageNum - 1)}
                  isActive={isCurrent}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => !table.getCanNextPage() ? null : table.nextPage()}
              aria-disabled={!table.getCanNextPage()}
              className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              Last
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}