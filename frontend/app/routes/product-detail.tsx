import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ProductDetailsSkeleton } from "@/components/app/ProductDetailsSkeleton";
import { ProductDetailsContent } from "@/components/app/ProductDetailsContent";
import { ProductNotFound } from "@/components/app/ProductNotFound";
import { ProductError } from "@/components/app/ProductError";
import api from "@/config/axios.config";
import { ArrowLeft } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  brand: string;
  stock: number;
  sku?: string;
}

export default function ProductDetailPage() {
  const { logout } = useAuth();
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        return data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error('PRODUCT_NOT_FOUND');
        }
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        return false;
      }
      return failureCount < 3;
    },
  });

  const renderContent = () => {
    if (isPending) {
      return <ProductDetailsSkeleton />;
    }

    if (isError) {
      if (error.message === 'PRODUCT_NOT_FOUND') {
        return <ProductNotFound />;
      }

      return <ProductError message={error.message} />;
    }

    if (!product) {
      return <ProductNotFound />;
    }

    return <ProductDetailsContent product={product} />;
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex flex-row justify-between items-center mb-8 gap-4">
        <Link to="/products" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </header>

      {renderContent()}
    </div>
  );
} 