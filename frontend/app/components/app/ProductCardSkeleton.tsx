import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <Skeleton className="w-full h-72 rounded-t-lg" />
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-5 w-20" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-6 w-16" />
      </CardFooter>
    </Card>
  );
} 