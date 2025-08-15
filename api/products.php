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

// Include database class
require_once __DIR__ . '/database/Database.php';

try {
    $db = Database::getInstance();
    
    // Get products with their variants, brands, and categories
    $products = $db->fetchAll("
        SELECT p.*, 
               p.main_image as mainImage,
               b.name as brand_name, b.slug as brand_slug,
               c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
    ");
    
    
    // Get variants for each product
    foreach ($products as &$product) {
        $variants = $db->fetchAll(
            "SELECT * FROM product_variants WHERE product_id = ? ORDER BY is_default DESC, id ASC",
            [$product['id']]
        );
        
        // Parse JSON fields
        foreach (['properties', 'specifications', 'seo_data', 'images', 'keywords'] as $jsonField) {
            if ($product[$jsonField]) {
                $product[$jsonField] = json_decode($product[$jsonField], true);
            }
        }
        
        // Process variants
        foreach ($variants as &$variant) {
            foreach (['properties', 'images'] as $jsonField) {
                if ($variant[$jsonField]) {
                    $variant[$jsonField] = json_decode($variant[$jsonField], true);
                }
            }
        }
        
        $product['variants'] = $variants;
        
        // Set frontend-compatible fields with defaults
        $product['brand'] = $product['brand_name'] ?? 'سان ترد گروپ';
        $product['category'] = $product['category_slug'] ?? 'general';
        $product['shortDescription'] = $product['short_description'] ?? '';
        $product['fullDescription'] = $product['full_description'] ?? 'توضیحات کاملی برای این محصول ارائه نشده است.';
        $product['basePrice'] = isset($product['base_price']) ? (float)$product['base_price'] : 0;
        $product['seoData'] = $product['seo_data'] ?? [];
        $product['seoTitle'] = $product['seo_data']['title'] ?? $product['name'];
        $product['seoDescription'] = $product['shortDescription'];
        $product['seoKeywords'] = is_array($product['keywords']) ? implode(', ', $product['keywords']) : '';
        
        // Override null values that the null coalescing didn't catch
        if ($product['brand'] === null || $product['brand'] === '') {
            $product['brand'] = 'سان ترد گروپ';
        }
        if ($product['category'] === null || $product['category'] === '') {
            $product['category'] = 'general';
        }
        if ($product['fullDescription'] === null || $product['fullDescription'] === '') {
            $product['fullDescription'] = 'توضیحات کاملی برای این محصول ارائه نشده است.';
        }
    }
    
    // Get company info
    $companyInfo = $db->fetch("SELECT data FROM company_info WHERE id = 1");
    $companyData = $companyInfo ? json_decode($companyInfo['data'], true) : null;
    
    // Get categories and brands for embedded data (backward compatibility)
    $categories = $db->fetchAll("SELECT slug as id, name, slug FROM categories");
    $brands = $db->fetchAll("SELECT slug as id, name, slug, logo FROM brands");
    
    echo json_encode([
        'filename' => 'products',
        'data' => [
            'products' => $products,
            'categories' => $categories,  
            'brands' => $brands,
            'companyInfo' => $companyData
        ],
        'source' => 'database',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    error_log("Products API error: " . $e->getMessage());
    
    // Fallback to sample data if database fails
    http_response_code(500);
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
        'status' => 'error_fallback',
        'error' => 'Database connection failed',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>