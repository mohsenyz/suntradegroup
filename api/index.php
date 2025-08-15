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

// Configuration
$DATA_DIR = __DIR__ . '/data';
$PASSWORD = 'suntradegroup2024';

// Database instance
$db = Database::getInstance();

// Authentication function
function authenticate() {
    global $PASSWORD;
    
    $headers = getallheaders();
    $provided_password = $headers['X-Password'] ?? $_POST['password'] ?? $_GET['password'] ?? '';
    
    if ($provided_password !== $PASSWORD) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized', 'message' => 'Invalid password']);
        exit();
    }
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $path);
$path = trim($path, '/');

// Rate limiting function using SQLite
function checkRateLimit($ip, $endpoint = 'contact', $limit = 5, $windowMinutes = 60) {
    global $db;
    
    $now = time();
    $windowStart = $now - ($windowMinutes * 60);
    
    try {
        // Get existing rate limit record
        $rateLimit = $db->fetch(
            "SELECT requests FROM rate_limits WHERE endpoint = ? AND ip_address = ?",
            [$endpoint, $ip]
        );
        
        $requests = [];
        if ($rateLimit) {
            $requests = json_decode($rateLimit['requests'], true) ?: [];
        }
        
        // Clean old timestamps
        $requests = array_filter($requests, function($timestamp) use ($windowStart) {
            return $timestamp > $windowStart;
        });
        
        // Check if limit exceeded
        if (count($requests) >= $limit) {
            return false;
        }
        
        // Add current request timestamp
        $requests[] = $now;
        
        // Update or insert rate limit record
        if ($rateLimit) {
            $db->update(
                'rate_limits',
                ['requests' => json_encode($requests), 'updated_at' => date('Y-m-d H:i:s')],
                'endpoint = ? AND ip_address = ?',
                [$endpoint, $ip]
            );
        } else {
            $db->insert('rate_limits', [
                'endpoint' => $endpoint,
                'ip_address' => $ip,
                'requests' => json_encode($requests)
            ]);
        }
        
        return true;
        
    } catch (Exception $e) {
        error_log("Rate limiting error: " . $e->getMessage());
        // Allow request if rate limiting fails
        return true;
    }
}

// Validate and sanitize input
function validateContactInput($input) {
    $errors = [];
    
    // Required fields
    if (empty($input['name']) || strlen(trim($input['name'])) < 2) {
        $errors[] = 'Name is required (minimum 2 characters)';
    }
    
    if (empty($input['email']) || !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Valid email is required';
    }
    
    if (empty($input['message']) || strlen(trim($input['message'])) < 10) {
        $errors[] = 'Message is required (minimum 10 characters)';
    }
    
    // Length limits
    if (strlen($input['name']) > 100) {
        $errors[] = 'Name too long (maximum 100 characters)';
    }
    
    if (strlen($input['email']) > 255) {
        $errors[] = 'Email too long (maximum 255 characters)';
    }
    
    if (strlen($input['message']) > 2000) {
        $errors[] = 'Message too long (maximum 2000 characters)';
    }
    
    return $errors;
}

// Contact form submission endpoint
if ($path === 'contact' && $method === 'POST') {
    // Get client IP
    $clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (strpos($clientIP, ',') !== false) {
        $clientIP = trim(explode(',', $clientIP)[0]);
    }
    
    // Check rate limit (5 submissions per hour)
    if (!checkRateLimit($clientIP, 'contact', 5, 60)) {
        http_response_code(429);
        echo json_encode([
            'error' => 'Rate limit exceeded',
            'message' => 'Too many contact form submissions. Please try again later.'
        ]);
        exit();
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request', 'message' => 'Invalid JSON data']);
        exit();
    }
    
    // Validate input
    $validationErrors = validateContactInput($input);
    if (!empty($validationErrors)) {
        http_response_code(400);
        echo json_encode(['error' => 'Validation failed', 'messages' => $validationErrors]);
        exit();
    }
    
    // Prepare contact data for SQLite
    $contactData = [
        'name' => htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8'),
        'email' => filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL),
        'message' => htmlspecialchars(trim($input['message']), ENT_QUOTES, 'UTF-8'),
        'subject' => isset($input['subject']) ? htmlspecialchars(trim($input['subject']), ENT_QUOTES, 'UTF-8') : '',
        'phone' => isset($input['phone']) ? htmlspecialchars(trim($input['phone']), ENT_QUOTES, 'UTF-8') : '',
        'ip_address' => $clientIP,
        'status' => 'new',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    try {
        $contactId = $db->insert('contacts', $contactData);
        echo json_encode([
            'success' => true,
            'message' => 'Contact form submitted successfully',
            'id' => $contactId
        ]);
    } catch (Exception $e) {
        error_log("Contact form error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save contact form']);
    }
    exit();
}

// Special initialization route (now initializes SQLite with sample data)
if ($path === 'init' && $method === 'POST') {
    authenticate();
    
    try {
        // Run database migration if needed
        require_once __DIR__ . '/database/migrate.php';
        $migrator = new DataMigrator();
        
        // Check if data already exists
        $productCount = $db->fetch("SELECT COUNT(*) as count FROM products");
        
        if ($productCount['count'] == 0) {
            // Run migration
            $success = $migrator->migrate();
            
            if ($success) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Database initialized with data from JSON files',
                    'migrated' => true
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'error' => 'Failed to migrate data',
                    'message' => 'Check server logs for details'
                ]);
            }
        } else {
            echo json_encode([
                'success' => true,
                'message' => 'Database already contains data',
                'migrated' => false
            ]);
        }
    } catch (Exception $e) {
        error_log("Initialization error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Initialization failed', 'message' => $e->getMessage()]);
    }
    exit();
}

// Route handling
switch ($method) {
    case 'GET':
        if (empty($path)) {
            // List all data types
            authenticate();
            try {
                $tables = ['categories', 'brands', 'products', 'contacts', 'ui_texts'];
                $dataList = [];
                
                foreach ($tables as $table) {
                    $result = $db->fetch("SELECT COUNT(*) as count FROM {$table}");
                    $dataList[] = [
                        'name' => $table,
                        'count' => $result['count'],
                        'type' => 'table'
                    ];
                }
                
                // Map table names to expected frontend file names
                $fileList = [];
                foreach ($dataList as $item) {
                    switch($item['name']) {
                        case 'ui_texts':
                            // UI texts are accessed as separate endpoints
                            $fileList[] = ['name' => 'texts-common'];
                            $fileList[] = ['name' => 'texts-pages'];
                            $fileList[] = ['name' => 'texts-forms'];
                            break;
                        default:
                            $fileList[] = ['name' => $item['name']];
                            break;
                    }
                }
                
                echo json_encode(['files' => $fileList]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to list data', 'message' => $e->getMessage()]);
            }
        } else {
            // Get specific data
            $publicEndpoints = ['products', 'categories', 'brands', 'texts-common', 'texts-pages', 'texts-forms'];
            
            if (!in_array($path, $publicEndpoints)) {
                authenticate();
            }
            
            try {
                switch ($path) {
                    case 'products':
                        // Get products with their variants, brands, and categories
                        $products = $db->fetchAll("
                            SELECT p.*, 
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
                        }
                        
                        // Get company info
                        $companyInfo = $db->fetch("SELECT data FROM company_info WHERE id = 1");
                        $companyData = $companyInfo ? json_decode($companyInfo['data'], true) : null;
                        
                        // Get categories and brands for embedded data (backward compatibility)
                        $categories = $db->fetchAll("SELECT id as slug, name, slug FROM categories");
                        $brands = $db->fetchAll("SELECT id as slug, name, slug, logo FROM brands");
                        
                        echo json_encode([
                            'filename' => 'products',
                            'data' => [
                                'products' => $products,
                                'categories' => $categories,
                                'brands' => $brands,
                                'companyInfo' => $companyData
                            ],
                            'source' => 'database'
                        ]);
                        break;
                        
                    case 'categories':
                        $categories = $db->fetchAll("SELECT slug as id, name, slug FROM categories ORDER BY name");
                        echo json_encode([
                            'filename' => 'categories',
                            'data' => ['categories' => $categories],
                            'source' => 'database'
                        ]);
                        break;
                        
                    case 'brands':
                        $brands = $db->fetchAll("SELECT slug as id, name, slug, logo FROM brands ORDER BY name");
                        echo json_encode([
                            'filename' => 'brands',
                            'data' => ['brands' => $brands],
                            'source' => 'database'
                        ]);
                        break;
                        
                    case 'contacts':
                        $contacts = $db->fetchAll("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 1000");
                        
                        // Convert to old format for compatibility
                        $contactsFormatted = [];
                        foreach ($contacts as $contact) {
                            $contactsFormatted[] = [
                                'id' => $contact['id'],
                                'name' => $contact['name'],
                                'email' => $contact['email'],
                                'phone' => $contact['phone'],
                                'subject' => $contact['subject'],
                                'message' => $contact['message'],
                                'timestamp' => $contact['created_at'],
                                'ip' => $contact['ip_address'],
                                'status' => $contact['status'],
                                'user_agent' => $contact['user_agent']
                            ];
                        }
                        
                        echo json_encode([
                            'filename' => 'contacts',
                            'data' => ['contacts' => $contactsFormatted],
                            'source' => 'database'
                        ]);
                        break;
                        
                    case 'texts-common':
                    case 'texts-forms':
                    case 'texts-pages':
                        $category = str_replace('texts-', '', $path);
                        $textData = $db->fetch("SELECT content FROM ui_texts WHERE category = ?", [$category]);
                        
                        if ($textData) {
                            $content = json_decode($textData['content'], true);
                            echo json_encode([
                                'filename' => $path,
                                'data' => $content,
                                'source' => 'database'
                            ]);
                        } else {
                            http_response_code(404);
                            echo json_encode(['error' => 'Text data not found']);
                        }
                        break;
                        
                    default:
                        http_response_code(404);
                        echo json_encode(['error' => 'Endpoint not found']);
                        break;
                }
            } catch (Exception $e) {
                error_log("API GET error: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
            }
        }
        break;
        
    case 'POST':
    case 'PUT':
        authenticate();
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['filename']) || !isset($input['data'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid request', 'message' => 'filename and data are required']);
            break;
        }
        
        try {
            $db->beginTransaction();
            
            switch ($input['filename']) {
                case 'products':
                    // Handle products update
                    $data = $input['data'];
                    
                    // Update company info if provided
                    if (isset($data['companyInfo'])) {
                        $companyData = ['data' => json_encode($data['companyInfo'])];
                        
                        $existing = $db->fetch("SELECT id FROM company_info WHERE id = 1");
                        if ($existing) {
                            $db->update('company_info', $companyData, 'id = ?', [1]);
                        } else {
                            $companyData['id'] = 1;
                            $db->insert('company_info', $companyData);
                        }
                    }
                    
                    // Handle products if provided
                    if (isset($data['products']) && is_array($data['products'])) {
                        // This is a complex operation - for now, we'll maintain backward compatibility
                        // by allowing JSON format updates but converting to relational data
                        
                        // Clear existing products and variants
                        $db->query("DELETE FROM product_variants");
                        $db->query("DELETE FROM products");
                        
                        foreach ($data['products'] as $productData) {
                            // Find or create brand
                            $brandId = null;
                            if (isset($productData['brand'])) {
                                $brand = $db->fetch("SELECT id FROM brands WHERE name = ?", [$productData['brand']]);
                                $brandId = $brand ? $brand['id'] : null;
                            }
                            
                            // Find or create category
                            $categoryId = null;
                            if (isset($productData['category'])) {
                                $category = $db->fetch("SELECT id FROM categories WHERE slug = ?", [$productData['category']]);
                                $categoryId = $category ? $category['id'] : null;
                            }
                            
                            // Insert product
                            // Handle both JSON format (camelCase) and database format (snake_case)
                            $product = [
                                'slug' => $productData['slug'],
                                'name' => $productData['name'],
                                'brand_id' => $brandId ?? $productData['brand_id'] ?? null,
                                'category_id' => $categoryId ?? $productData['category_id'] ?? null,
                                'short_description' => $productData['shortDescription'] ?? $productData['short_description'] ?? null,
                                'full_description' => $productData['fullDescription'] ?? $productData['full_description'] ?? null,
                                'base_price' => $productData['basePrice'] ?? $productData['base_price'] ?? null,
                                'currency' => $productData['currency'] ?? 'تومان',
                                'main_image' => $productData['mainImage'] ?? $productData['main_image'] ?? ($productData['images'][0] ?? null),
                                'properties' => isset($productData['properties']) ? json_encode($productData['properties']) : null,
                                'specifications' => isset($productData['specifications']) ? json_encode($productData['specifications']) : null,
                                'seo_data' => isset($productData['seo_data']) ? 
                                    (is_string($productData['seo_data']) ? $productData['seo_data'] : json_encode($productData['seo_data'])) :
                                    json_encode([
                                        'title' => $productData['seoTitle'] ?? null,
                                        'description' => $productData['seoDescription'] ?? null,
                                        'keywords' => $productData['seoKeywords'] ?? null
                                    ]),
                                'images' => isset($productData['images']) ? json_encode($productData['images']) : null,
                                'keywords' => isset($productData['keywords']) ? json_encode($productData['keywords']) : null,
                                'availability' => $productData['availability'] ?? true,
                                'featured' => $productData['featured'] ?? false
                            ];
                            
                            $productId = $db->insert('products', $product);
                            
                            // Insert variants
                            if (isset($productData['variants']) && is_array($productData['variants'])) {
                                foreach ($productData['variants'] as $variantData) {
                                    $variant = [
                                        'product_id' => $productId,
                                        'variant_slug' => $variantData['id'] ?? uniqid(),
                                        'name' => $variantData['name'],
                                        'sku' => $variantData['sku'] ?? null,
                                        'price' => $variantData['price'] ?? null,
                                        'price_modifier' => $variantData['priceModifier'] ?? 0,
                                        'stock' => $variantData['stock'] ?? 0,
                                        'properties' => isset($variantData['properties']) ? json_encode($variantData['properties']) : null,
                                        'images' => isset($variantData['images']) ? json_encode($variantData['images']) : null,
                                        'availability' => $variantData['availability'] ?? true,
                                        'is_default' => $variantData['isDefault'] ?? false
                                    ];
                                    
                                    $db->insert('product_variants', $variant);
                                }
                            }
                        }
                    }
                    break;
                    
                case 'categories':
                    if (isset($input['data']['categories'])) {
                        // Clear and rebuild categories
                        $db->query("DELETE FROM categories");
                        
                        foreach ($input['data']['categories'] as $categoryData) {
                            $category = [
                                'slug' => $categoryData['id'] ?? $categoryData['slug'],
                                'name' => $categoryData['name']
                            ];
                            $db->insert('categories', $category);
                        }
                    }
                    break;
                    
                case 'brands':
                    if (isset($input['data']['brands'])) {
                        // Clear and rebuild brands
                        $db->query("DELETE FROM brands");
                        
                        foreach ($input['data']['brands'] as $brandData) {
                            $brand = [
                                'slug' => $brandData['id'] ?? $brandData['slug'],
                                'name' => $brandData['name'],
                                'logo' => $brandData['logo'] ?? null
                            ];
                            $db->insert('brands', $brand);
                        }
                    }
                    break;
                    
                case 'texts-common':
                case 'texts-forms':
                case 'texts-pages':
                    $category = str_replace('texts-', '', $input['filename']);
                    
                    // Get existing content to merge with new data
                    $existing = $db->fetch("SELECT content FROM ui_texts WHERE category = ?", [$category]);
                    
                    if ($existing) {
                        // Merge new data with existing content
                        $existingContent = json_decode($existing['content'], true) ?: [];
                        $newContent = array_replace_recursive($existingContent, $input['data']);
                        $content = json_encode($newContent);
                        
                        $db->update('ui_texts', ['content' => $content], 'category = :category', ['category' => $category]);
                    } else {
                        // If no existing content, use input data as-is
                        $content = json_encode($input['data']);
                        $db->insert('ui_texts', ['category' => $category, 'content' => $content]);
                    }
                    break;
                    
                default:
                    throw new Exception("Unknown data type: " . $input['filename']);
            }
            
            $db->commit();
            
            echo json_encode([
                'success' => true,
                'filename' => $input['filename'],
                'message' => 'Data updated successfully',
                'source' => 'database'
            ]);
            
        } catch (Exception $e) {
            $db->rollback();
            error_log("API UPDATE error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update data', 'message' => $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        authenticate();
        
        if (empty($path)) {
            http_response_code(400);
            echo json_encode(['error' => 'Data type required']);
            break;
        }
        
        try {
            // Create backup before deletion
            $backupPath = $db->backup();
            
            switch ($path) {
                case 'products':
                    $db->query("DELETE FROM product_variants");
                    $db->query("DELETE FROM products");
                    break;
                case 'categories':
                    $db->query("DELETE FROM categories");
                    break;
                case 'brands':
                    $db->query("DELETE FROM brands");
                    break;
                case 'contacts':
                    $db->query("DELETE FROM contacts");
                    break;
                default:
                    throw new Exception("Cannot delete data type: " . $path);
            }
            
            echo json_encode([
                'success' => true, 
                'message' => 'Data deleted successfully',
                'backup' => $backupPath
            ]);
            
        } catch (Exception $e) {
            error_log("API DELETE error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete data', 'message' => $e->getMessage()]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>