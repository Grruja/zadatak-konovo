<?php

namespace App\Core;

class Router
{
    private array $routes = [];
    private Request $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    private function addRoute(string $method, string $path, array $callback): self
    {
        $this->routes[$method][$path] = ['callback' => $callback, 'middleware' => null];
        return $this;
    }

    public function get(string $path, array $callback): self
    {
        return $this->addRoute('get', $path, $callback);
    }

    public function middleware(string $middlewareClass): self
    {
        $method = array_key_last($this->routes);
        $path = array_key_last($this->routes[$method]);
        if ($path !== null) {
            $this->routes[$method][$path]['middleware'] = $middlewareClass;
        }
        return $this;
    }

    public function resolve()
    {
        $path = $this->request->getPath();
        $method = $this->request->getMethod();

        if (!isset($this->routes[$method])) {
            ApiResponse::json(['message' => 'Not Found'], 404);
            return;
        }

        foreach ($this->routes[$method] as $routePath => $data) {
            $pattern = preg_replace('/\{(\w+)\}/', '(\w+)', $routePath);
            $pattern = "#^" . $pattern . "$#";

            if (preg_match($pattern, $path, $matches)) {
                $this->dispatchRoute($data, $matches);
                return; // Route found
            }
        }

        ApiResponse::json(['message' => 'Not Found'], 404);
    }

    /**
     * Dispatches the matched route to the appropriate controller and method.
     *
     * @param array $routeData The route data including callback and middleware.
     * @param array $matches The regex matches from the URL.
     */
    private function dispatchRoute(array $routeData, array $matches): void
    {
        array_shift($matches); // Remove the full matched string
        $params = $matches;

        $callback = $routeData['callback'];
        $middleware = $routeData['middleware'];
        $token = null;

        if ($middleware) {
            $token = call_user_func([$middleware, 'handle']);
        }

        $controller = new $callback[0]();
        
        $args = [$this->request];
        if ($token) {
            $args[] = $token;
        }
        $args = array_merge($args, $params);

        call_user_func_array([$controller, $callback[1]], $args);
    }
}