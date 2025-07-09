<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/bootstrap/app.php';

use App\Controllers\ProductController;
use App\Core\Request;
use App\Core\Router;
use App\Middlewares\EnsureJwtTokenIsPresent;

$request = new Request();
$router = new Router($request);

$router->get('/api/products', [ProductController::class, 'productList'])
       ->middleware(EnsureJwtTokenIsPresent::class);

$router->get('/api/categories', [ProductController::class, 'categories'])
       ->middleware(EnsureJwtTokenIsPresent::class);

$router->get('/api/products/{id}', [ProductController::class, 'singleProduct'])
       ->middleware(EnsureJwtTokenIsPresent::class);

$router->resolve();