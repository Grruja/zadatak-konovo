import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/config/axios.config";

interface CategoriesResponse {
  data: string[];
}

export function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";

  const { data: categoriesResponse, isPending: isCategoriesPending } = useQuery<
    CategoriesResponse,
    Error
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const categories = useMemo(() => categoriesResponse?.data || [], [categoriesResponse?.data]);

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSearchTerm) {
      newParams.set("search", newSearchTerm);
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleCategoryChange = useCallback((newCategory: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newCategory && newCategory !== "All") {
      newParams.set("category", newCategory);
    } else {
      newParams.delete("category");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  return (
    <div className="gap-2 mb-12 flex flex-row items-center">
      <Input
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Select
        value={selectedCategory || "All"}
        onValueChange={handleCategoryChange}
        disabled={isCategoriesPending}
      >
        <SelectTrigger className="min-w-24 sm:min-w-58">
          <SelectValue
            placeholder={
              isCategoriesPending
                ? "Loading categories..."
                : "Filter by category"
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {categories.map((cat: string) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 