import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  perPage: number;
}

interface CustomPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPrefetch?: (page: number) => void;
  className?: string;
}

/**
 * Example usage in products.tsx
 */
export function CustomPagination({ 
  meta, 
  onPageChange, 
  onPrefetch,
  className = "mt-8" 
}: CustomPaginationProps) {
  const { currentPage, totalPages } = meta;

  const paginationItems = useMemo(() => {
    if (totalPages <= 1) return [];

    const items = [];

    items.push(1);

    if (currentPage > 4) {
      items.push("ellipsis-start");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) {
        items.push(i);
      }
    }

    if (currentPage < totalPages - 3) {
      items.push("ellipsis-end");
    }

    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handlePrefetch = (page: number) => {
    if (onPrefetch && page > 0 && page <= totalPages && page !== currentPage) {
      onPrefetch(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            onMouseEnter={() => {
              if (currentPage > 1) {
                handlePrefetch(currentPage - 1);
              }
            }}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        
        {paginationItems.map((item, index) => (
          <PaginationItem key={index}>
            {item === "ellipsis-start" || item === "ellipsis-end" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={item === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(item as number);
                }}
                onMouseEnter={() => {
                  handlePrefetch(item as number);
                }}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            onMouseEnter={() => {
              if (currentPage < totalPages) {
                handlePrefetch(currentPage + 1);
              }
            }}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
} 