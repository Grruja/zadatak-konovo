import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface ProductErrorProps {
  title?: string;
  message: string;
  buttonText?: string;
  buttonLink?: string;
}

export function ProductError({ 
  title = "Error Loading Product",
  message,
  buttonText = "Return to Products",
  buttonLink = "/products"
}: ProductErrorProps) {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-destructive text-lg mb-6">{message}</p>
        <Link to={buttonLink}>
          <Button>{buttonText}</Button>
        </Link>
      </div>
    </div>
  );
} 