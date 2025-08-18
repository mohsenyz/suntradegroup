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
    
    $brands = $db->fetchAll("SELECT slug as id, name, slug, logo FROM brands ORDER BY name");
    
    echo json_encode([
        'brands' => $brands,
        'source' => 'database',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    error_log("Brands API error: " . $e->getMessage());
    
    // Fallback data if database fails
    echo json_encode([
        'brands' => [
            ['id' => 'sun-brand', 'name' => 'سان', 'slug' => 'sun-brand', 'logo' => '/images/brands/sun-brand-logo.png']
        ],
        'status' => 'error_fallback',
        'error' => 'Database connection failed',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>