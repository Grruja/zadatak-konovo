<?php

namespace App\Middlewares;

use App\Core\ApiResponse;

class EnsureJwtTokenIsPresent
{
    /**
     * Checks for a "Bearer" token in the "Authorization" header.
     * If the token is found, it is returned. Otherwise, it sends a 401 Unauthorized
     *
     * @return string The extracted JWT token.
     */
    public static function handle(): string
    {
        $authHeader = null;
        
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } 
        // Fallback for other environments
        else {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            }
        }

        if (!$authHeader) {
            ApiResponse::json(['message' => 'Authorization header not found.'], 401);
            exit;
        }

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }

        ApiResponse::json(['message' => 'Bearer token not found or improperly formatted.'], 401);
        exit;
    }
} 