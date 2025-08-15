<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Password');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database class
require_once __DIR__ . '/database/Database.php';

try {
    $db = Database::getInstance();
    
    $categories = $db->fetchAll("SELECT slug as id, name, slug FROM categories ORDER BY name");
    
    echo json_encode([
        'categories' => $categories,
        'source' => 'database',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    error_log("Categories API error: " . $e->getMessage());
    
    // Fallback data if database fails
    echo json_encode([
        'categories' => [
            ['id' => 'nails-saws', 'name' => 'میخ و اره', 'slug' => 'nails-saws'],
            ['id' => 'locks-cylinders', 'name' => 'قفل و سیلندر', 'slug' => 'locks-cylinders'],
            ['id' => 'shovels-pickaxes', 'name' => 'بیل و کلنگ', 'slug' => 'shovels-pickaxes'],
            ['id' => 'mesh-chains', 'name' => 'توری و زنجیر', 'slug' => 'mesh-chains'],
            ['id' => 'ropes-threads', 'name' => 'طناب و نخ', 'slug' => 'ropes-threads']
        ],
        'status' => 'error_fallback',
        'error' => 'Database connection failed',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>