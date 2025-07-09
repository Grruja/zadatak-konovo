import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductSearch } from "@/components/app/ProductSearch";
import { ProductCard } from "@/components/app/ProductCard";
import { ProductCardSkeleton } from "@/components/app/ProductCardSkeleton";
import { CustomPagination } from "@/components/core/CustomPagination";
import api from "@/config/axios.config";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface PaginatedProductsResponse {
  data: Product[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    perPage: number;
  };
}

const fetchProducts = async (
  searchTerm: string,
  selectedCategory: string,
  page: number
): Promise<PaginatedProductsResponse> => {
  const params = new URLSearchParams();
  if (searchTerm) params.append("search", searchTerm);
  if (selectedCategory) params.append("category", selectedCategory);
  params.append("page", page.toString());

  const { data } = await api.get("/products", { params });
  return data;
};

export default function ProductsPage() {
  const { logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useQuery<PaginatedProductsResponse, Error>({
    queryKey: ["products", searchTerm, selectedCategory, page],
    queryFn: () => fetchProducts(searchTerm, selectedCategory, page),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const products = response?.data;
  const meta = response?.meta;

  const handlePageChange = useCallback((newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    if (newPage > 0) {
      newParams.set("page", newPage.toString());
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);

  const handlePrefetch = useCallback(async (prefetchPage: number) => {
    await queryClient.prefetchQuery({
      queryKey: ["products", searchTerm, selectedCategory, prefetchPage],
      queryFn: () => fetchProducts(searchTerm, selectedCategory, prefetchPage),
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    });
  }, [queryClient, searchTerm, selectedCategory]);

  const skeletonCards = useMemo(() =>
    Array.from({ length: 12 }, (_, index) => (
      <ProductCardSkeleton key={index} />
    )), []
  );

  return (
    <div className="container mx-auto p-4">
      <header className="flex flex-row justify-between items-center mb-16 gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex items-center gap-2">
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <ProductSearch />

      <main>
        {isPending && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {skeletonCards}
          </div>
        )}
        {isError && (
          <p className="text-center text-destructive">
            Error fetching products: {error.message}
          </p>
        )}
        {products && products.length > 0 && !isPending && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {meta && (
              <CustomPagination
                meta={meta}
                onPageChange={handlePageChange}
                onPrefetch={handlePrefetch}
              />
            )}
          </>
        )}
        {products && products.length === 0 && !isPending && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || selectedCategory ? (
                <>
                  No products found for your search criteria.
                </>
              ) : (
                "No products available at the moment."
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}