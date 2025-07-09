import { memo } from "react";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/helpers/text.helper";
import api from "@/config/axios.config";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();

  const prefetchProductDetail = async () => {
    await queryClient.prefetchQuery({
      queryKey: ["product", product.id],
      queryFn: async () => {
        const { data } = await api.get(`/products/${product.id}`);
        return data;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };

  return (
    <Link 
      to={`/products/${product.id}`}
      onMouseEnter={prefetchProductDetail}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="aspect-square w-full overflow-hidden rounded-t-lg p-6">
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardTitle className="text-lg font-semibold mb-2 truncate">
            {product.name}
          </CardTitle>
          {product.category && (
            <span className="inline-block bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium max-w-full truncate">
              {product.category}
            </span>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xl font-bold text-primary">
            {formatPrice(product.price)} <span className="text-sm text-gray-500">RSD</span>
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}); 