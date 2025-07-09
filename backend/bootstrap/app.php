<?php

use App\Core\ApiResponse;

/**
 * -------------------------------------------------------------------------
 * Set Global Exception Handler
 * -------------------------------------------------------------------------
 *
 * This ensures that any uncaught exception in the application will be
 * caught and returned as a standardized JSON response, preventing
 * raw HTML error pages from being shown to the client.
 */
set_exception_handler(function (Throwable $exception) {
    $statusCode = $exception->getCode();
    // Ensure the status code is a valid HTTP status code.
    if (!is_int($statusCode) || $statusCode < 100 || $statusCode > 599) {
        $statusCode = 500;
    }

    ApiResponse::json(['message' => $exception->getMessage()], $statusCode);
});

/**
 * -------------------------------------------------------------------------
 * Handle CORS Preflight Requests
 * -------------------------------------------------------------------------
 *
 * This block handles the browser's preflight `OPTIONS` request. It sends
 * back the necessary headers to let the browser know that the actual
 * cross-origin request (with its method and headers) is allowed.
 */
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
} 