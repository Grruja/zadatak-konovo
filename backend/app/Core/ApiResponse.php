<?php

namespace App\Core;

class ApiResponse
{
    /**
     * Send a JSON response.
     *
     * @param mixed $data The data to be encoded as JSON.
     * @param int $statusCode The HTTP status code.
     */
    public static function json($data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        
        // Allow from any origin
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        echo json_encode($data);
        exit;
    }
} 