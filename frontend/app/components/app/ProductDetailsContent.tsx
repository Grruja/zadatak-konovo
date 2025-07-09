import { Badge } from "@/components/ui/badge";
import { Package, Tag, Building } from "lucide-react";

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

interface ProductDetailsContentProps {
  product: Product;
}

export function ProductDetailsContent({ product }: ProductDetailsContentProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='12' fill='%236b7280' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  };

  const containsHtml = (text: string): boolean => {
    const htmlRegex = /<[^>]*>/; // Checks for HTML tags like <tags> or <tag />
    return htmlRegex.test(text);
  };

  const renderDescription = (description: string) => {
    if (!description) return null;

    if (containsHtml(description)) {
      return (
        <div
          className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      );
    }

    return (
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="space-y-4">
        <div className="aspect-square w-full overflow-hidden rounded-lg border">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-6"
            onError={handleImageError}
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <div className="text-3xl font-bold text-primary mb-4">
            {product.price.toFixed(2)} <span className="text-sm text-gray-500">RSD</span>
          </div>
        </div>

        {/* Category and Brand */}
        <div className="flex flex-wrap gap-2">
          {product.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {product.category}
            </Badge>
          )}
          {product.brand && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {product.brand}
            </Badge>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            {renderDescription(product.description)}
          </div>
        )}

        {/* Product Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Product Information</h3>
          <div className="space-y-2">
            {product.sku && (
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">SKU:</span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Stock:</span>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Product ID:</span>
              <span className="font-medium">{product.id}</span>
            </div>
          </div>
        </div>

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              This product is currently out of stock.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 