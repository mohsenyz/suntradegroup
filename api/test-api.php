<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Simple test endpoint
echo json_encode([
    'status' => 'success',
    'message' => 'API is working!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'server' => $_SERVER['HTTP_HOST'] ?? 'unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'unknown'
]);
?>