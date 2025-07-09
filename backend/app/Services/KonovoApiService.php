<?php

namespace App\Services;

use App\Exceptions\ExternalApiException;

class KonovoApiService
{
    private const API_URL = 'https://zadatak.konovo.rs/products';
    private const MONITOR_CATEGORY = 'Monitori';
    private const PRICE_INCREASE_RATE = 1.10;
    private const PRODUCTS_PER_PAGE = 20;

    /**
     * Fetches, processes, filters, and paginates all products.
     */
    public function getProducts(string $token, ?string $category, ?string $searchTerm, int $page = 1): array
    {
        $allProducts = $this->fetchProducts($token);
        
        $processedProducts = array_map([$this, 'processAndMapProductForList'], $allProducts);

        if ($category) {
            $processedProducts = array_filter($processedProducts, function ($product) use ($category) {
                return isset($product['category']) && strtolower($product['category']) === strtolower($category);
            });
        }

        if ($searchTerm) {
            $processedProducts = array_filter($processedProducts, function ($product) use ($searchTerm) {
                return isset($product['name']) && str_contains(strtolower($product['name']), strtolower($searchTerm));
            });
        }

        // --- Pagination Logic ---
        $limit = self::PRODUCTS_PER_PAGE;
        $totalProducts = count($processedProducts);
        $totalPages = ceil($totalProducts / $limit);
        $offset = ($page - 1) * $limit;
        
        $paginatedProducts = array_slice(array_values($processedProducts), $offset, $limit);

        return [
            'data' => $paginatedProducts,
            'meta' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalProducts' => $totalProducts,
                'perPage' => $limit,
            ],
        ];
    }

    /**
     * Fetches all unique categories from the products.
     */
    public function getCategories(string $token): array
    {
        $allProducts = $this->fetchProducts($token);
        
        $categories = [];
        foreach ($allProducts as $product) {
            if (isset($product['categoryName']) && !empty($product['categoryName'])) {
                $categories[] = $product['categoryName'];
            }
        }
        
        // Remove duplicates and sort alphabetically
        $categories = array_unique($categories);
        sort($categories);
        
        return array_values($categories);
    }

    public function getProductById(string $token, string $id): ?array
    {
        $allProducts = $this->fetchProducts($token);
        
        $foundProduct = null;
        foreach ($allProducts as $product) {
            if (isset($product['sif_product']) && (string)$product['sif_product'] === $id) {
                $foundProduct = $product;
                break;
            }
        }
        
        if (!$foundProduct) {
            return null;
        }

        return $this->processAndMapProduct($foundProduct);
    }
    
    private function fetchProducts(string $token): array
    {
        $ch = curl_init(self::API_URL);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            throw new ExternalApiException("cURL Error: {$curlError}", 500);
        }

        if ($httpCode === 401) {
            throw new ExternalApiException("Token expired or invalid", 401);
        }

        if ($httpCode !== 200) {
            $decodedResponse = json_decode($response, true);
            $message = $decodedResponse['message'] ?? 'Error fetching products from external API.';
            throw new ExternalApiException($message, $httpCode);
        }

        return json_decode($response, true) ?? [];
    }
    
    /**
     * Processes and maps product data for list view (ProductCard) - returns only essential fields.
     */
    private function processAndMapProductForList(array $product): array
    {
        // Increase price by 10% for products in the "Monitori" category.
        if (isset($product['categoryName']) && $product['categoryName'] === self::MONITOR_CATEGORY) {
            $product['price'] = ($product['price'] ?? 0) * self::PRICE_INCREASE_RATE;
        }

        return [
            'id' => $product['sif_product'] ?? null,
            'name' => $product['naziv'] ?? 'N/A',
            'price' => (float)($product['price'] ?? 0),
            'imageUrl' => $product['imgsrc'] ?? null,
            'category' => $product['categoryName'] ?? null,
        ];
    }
    
    /**
     * Processes and maps product data for detail view - returns all fields.
     */
    private function processAndMapProduct(array $product): array
    {
        // Increase price by 10% for products in the "Monitori" category.
        if (isset($product['categoryName']) && $product['categoryName'] === self::MONITOR_CATEGORY) {
            $product['price'] = ($product['price'] ?? 0) * self::PRICE_INCREASE_RATE;
        }

        // Replace "brzina" with "performanse" in the description.
        if (isset($product['description'])) {
            $product['description'] = str_ireplace('brzina', 'performanse', $product['description']);
        }

        return [
            'id' => $product['sif_product'] ?? null,
            'name' => $product['naziv'] ?? 'N/A',
            'sku' => $product['sku'] ?? null,
            'price' => (float)($product['price'] ?? 0),
            'description' => $product['description'] ?? '',
            'imageUrl' => $product['imgsrc'] ?? null,
            'category' => $product['categoryName'] ?? null,
            'brand' => $product['brandName'] ?? null,
            'stock' => (int)($product['stock'] ?? 0),
        ];
    }
} 