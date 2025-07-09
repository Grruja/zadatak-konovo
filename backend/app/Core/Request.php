<?php

namespace App\Core;

class Request
{
    public function getPath(): string
    {
        $path = '/' . ($_GET['url'] ?? '');
        $position = strpos($path, '?');
        if ($position === false) return $path;

        return substr($path, 0, $position);
    }

    public function getMethod(): string
    {
        return strtolower($_SERVER['REQUEST_METHOD']);
    }

    public function getBody(): array
    {
        $data = [];

        if ($this->getMethod() === 'get') {
            foreach ($_GET as $key => $value) {
                $data[$key] = filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS);
            }
        }
        
        if ($this->getMethod() === 'post') {
            // Handle form data
            foreach ($_POST as $key => $value) {
                $data[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
            }
            // Handle raw JSON
            $jsonData = json_decode(file_get_contents('php://input'), true);
            if(is_array($jsonData)) {
                $data = array_merge($data, $jsonData);
            }
        }

        return $data;
    }
}