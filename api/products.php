<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Password');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple products endpoint without authentication for testing
$dataFile = __DIR__ . '/data/products.json';

if (file_exists($dataFile)) {
    $data = file_get_contents($dataFile);
    echo $data;
} else {
    // Return sample data if file doesn't exist
    echo json_encode([
        'products' => [
            [
                'id' => 'test-1',
                'name' => 'تست محصول',
                'slug' => 'test-product',
                'brand' => 'تست',
                'category' => 'test',
                'price' => '10000',
                'images' => ['/images/products/test.jpg'],
                'description' => 'این یک محصول تستی است'
            ]
        ],
        'categories' => [],
        'brands' => [],
        'status' => 'fallback_data',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>