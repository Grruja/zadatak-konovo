<?php

namespace App\Controllers;

use App\Core\ApiResponse;
use App\Core\Request;
use App\Services\KonovoApiService;
use App\Exceptions\ExternalApiException;

class ProductController
{
    private KonovoApiService $konovoApiService;

    public function __construct()
    {
        $this->konovoApiService = new KonovoApiService();
    }

    public function productList(Request $request, string $token): void
    {
        try {
            $body = $request->getBody();
            
            $category = $body['category'] ?? null;
            $searchTerm = $body['search'] ?? null;
            $page = isset($body['page']) ? (int)$body['page'] : 1;

            $products = $this->konovoApiService->getProducts($token, $category, $searchTerm, $page);

            ApiResponse::json($products);
        } catch (ExternalApiException $e) {
            if ($e->getCode() === 401) {
                ApiResponse::json(['error' => 'TOKEN_EXPIRED', 'message' => 'Session expired'], 401);
            } else {
                ApiResponse::json(['error' => 'API_ERROR', 'message' => $e->getMessage()], $e->getCode());
            }
        } catch (\Exception $e) {
            ApiResponse::json(['error' => 'INTERNAL_ERROR', 'message' => 'Internal server error'], 500);
        }
    }

    public function categories(Request $request, string $token): void
    {
        try {
            $categories = $this->konovoApiService->getCategories($token);

            ApiResponse::json(['data' => $categories]);
        } catch (ExternalApiException $e) {
            if ($e->getCode() === 401) {
                ApiResponse::json(['error' => 'TOKEN_EXPIRED', 'message' => 'Session expired'], 401);
            } else {
                ApiResponse::json(['error' => 'API_ERROR', 'message' => $e->getMessage()], $e->getCode());
            }
        } catch (\Exception $e) {
            ApiResponse::json(['error' => 'INTERNAL_ERROR', 'message' => 'Internal server error'], 500);
        }
    }

    public function singleProduct(Request $request, string $token, string $id): void
    {
        try {
            $product = $this->konovoApiService->getProductById($token, $id);

            if ($product === null) {
                ApiResponse::json(['message' => 'Product not found.'], 404);
                exit;
            }

            ApiResponse::json($product);
        } catch (ExternalApiException $e) {
            if ($e->getCode() === 401) {
                ApiResponse::json(['error' => 'TOKEN_EXPIRED', 'message' => 'Session expired'], 401);
            } else {
                ApiResponse::json(['error' => 'API_ERROR', 'message' => $e->getMessage()], $e->getCode());
            }
        } catch (\Exception $e) {
            ApiResponse::json(['error' => 'INTERNAL_ERROR', 'message' => 'Internal server error'], 500);
        }
    }
} 