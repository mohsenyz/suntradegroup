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

// Configuration
$DATA_DIR = __DIR__ . '/data';
$PASSWORD = 'suntradegroup2024';

// Ensure data directory exists
if (!is_dir($DATA_DIR)) {
    mkdir($DATA_DIR, 0755, true);
}

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

// Rate limiting function
function checkRateLimit($ip, $endpoint = 'contact', $limit = 5, $windowMinutes = 60) {
    global $DATA_DIR;
    
    $rateLimitFile = $DATA_DIR . '/rate_limits.json';
    $now = time();
    $windowStart = $now - ($windowMinutes * 60);
    
    // Load existing rate limit data
    $rateLimits = [];
    if (file_exists($rateLimitFile)) {
        $content = file_get_contents($rateLimitFile);
        $rateLimits = json_decode($content, true) ?: [];
    }
    
    // Initialize endpoint if not exists
    if (!isset($rateLimits[$endpoint])) {
        $rateLimits[$endpoint] = [];
    }
    
    // Initialize IP if not exists
    if (!isset($rateLimits[$endpoint][$ip])) {
        $rateLimits[$endpoint][$ip] = [];
    }
    
    // Clean old timestamps
    $rateLimits[$endpoint][$ip] = array_filter(
        $rateLimits[$endpoint][$ip], 
        function($timestamp) use ($windowStart) {
            return $timestamp > $windowStart;
        }
    );
    
    // Check if limit exceeded
    if (count($rateLimits[$endpoint][$ip]) >= $limit) {
        return false;
    }
    
    // Add current request timestamp
    $rateLimits[$endpoint][$ip][] = $now;
    
    // Save updated rate limits
    file_put_contents($rateLimitFile, json_encode($rateLimits, JSON_PRETTY_PRINT));
    
    return true;
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
    
    // Sanitize input
    $contactData = [
        'id' => uniqid(time() . '_', true),
        'name' => htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8'),
        'email' => filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL),
        'message' => htmlspecialchars(trim($input['message']), ENT_QUOTES, 'UTF-8'),
        'subject' => isset($input['subject']) ? htmlspecialchars(trim($input['subject']), ENT_QUOTES, 'UTF-8') : '',
        'phone' => isset($input['phone']) ? htmlspecialchars(trim($input['phone']), ENT_QUOTES, 'UTF-8') : '',
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => $clientIP,
        'status' => 'new',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];
    
    // Load existing contacts
    $contactsFile = $DATA_DIR . '/contacts.json';
    $contacts = ['contacts' => []];
    
    if (file_exists($contactsFile)) {
        $content = file_get_contents($contactsFile);
        $contacts = json_decode($content, true) ?: ['contacts' => []];
    }
    
    // Add new contact
    array_unshift($contacts['contacts'], $contactData);
    
    // Keep only last 1000 contacts to prevent file from growing too large
    $contacts['contacts'] = array_slice($contacts['contacts'], 0, 1000);
    
    // Save contacts
    $jsonData = json_encode($contacts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (file_put_contents($contactsFile, $jsonData) !== false) {
        echo json_encode([
            'success' => true,
            'message' => 'Contact form submitted successfully',
            'id' => $contactData['id']
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save contact form']);
    }
    exit();
}

// Special initialization route
if ($path === 'init' && $method === 'POST') {
    authenticate();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $initData = $input['data'] ?? [];
    
    $initialized = [];
    $errors = [];
    
    // Initialize each data type
    foreach ($initData as $type => $data) {
        $filename = '';
        switch ($type) {
            case 'products':
                $filename = 'products.json';
                break;
            case 'categories':
                $filename = 'categories.json';
                break;
            case 'brands':
                $filename = 'brands.json';
                break;
            case 'texts-common':
            case 'texts-pages':
            case 'texts-forms':
                $filename = $type . '.json';
                break;
            default:
                $errors[] = "Unknown data type: $type";
                continue 2;
        }
        
        $filepath = $DATA_DIR . '/' . $filename;
        
        // Only initialize if file doesn't exist
        if (!file_exists($filepath)) {
            $jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            if (file_put_contents($filepath, $jsonData) !== false) {
                $initialized[] = $type;
            } else {
                $errors[] = "Failed to initialize $type";
            }
        } else {
            $initialized[] = "$type (already exists)";
        }
    }
    
    echo json_encode([
        'success' => true,
        'initialized' => $initialized,
        'errors' => $errors,
        'message' => 'Initialization completed'
    ]);
    exit();
}

// Route handling
switch ($method) {
    case 'GET':
        if (empty($path)) {
            // List all JSON files
            authenticate();
            $files = glob($DATA_DIR . '/*.json');
            $fileList = array_map(function($file) {
                return [
                    'name' => basename($file, '.json'),
                    'size' => filesize($file),
                    'modified' => filemtime($file)
                ];
            }, $files);
            echo json_encode(['files' => $fileList]);
        } else {
            // Get specific file
            // Public endpoints don't require authentication
            $publicEndpoints = ['products', 'categories', 'brands', 'texts-common', 'texts-pages', 'texts-forms'];
            // Contacts require authentication for admin access
            if (!in_array($path, $publicEndpoints)) {
                authenticate();
            }
            $filename = $path . '.json';
            $filepath = $DATA_DIR . '/' . $filename;
            
            if (file_exists($filepath)) {
                $content = file_get_contents($filepath);
                $data = json_decode($content, true);
                if ($data === null) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Invalid JSON file']);
                } else {
                    echo json_encode([
                        'filename' => $path,
                        'data' => $data,
                        'modified' => filemtime($filepath)
                    ]);
                }
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'File not found']);
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
        
        $filename = $input['filename'] . '.json';
        $filepath = $DATA_DIR . '/' . $filename;
        
        // Validate JSON data
        $jsonData = json_encode($input['data'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if ($jsonData === false) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON data']);
            break;
        }
        
        // Create backup if file exists
        if (file_exists($filepath)) {
            $backupPath = $DATA_DIR . '/backups';
            if (!is_dir($backupPath)) {
                mkdir($backupPath, 0755, true);
            }
            copy($filepath, $backupPath . '/' . $filename . '.' . time() . '.bak');
        }
        
        // Write file
        if (file_put_contents($filepath, $jsonData) !== false) {
            echo json_encode([
                'success' => true,
                'filename' => $input['filename'],
                'size' => filesize($filepath),
                'modified' => filemtime($filepath)
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to write file']);
        }
        break;
        
    case 'DELETE':
        authenticate();
        
        if (empty($path)) {
            http_response_code(400);
            echo json_encode(['error' => 'Filename required']);
            break;
        }
        
        $filename = $path . '.json';
        $filepath = $DATA_DIR . '/' . $filename;
        
        if (file_exists($filepath)) {
            // Create backup before deletion
            $backupPath = $DATA_DIR . '/backups';
            if (!is_dir($backupPath)) {
                mkdir($backupPath, 0755, true);
            }
            copy($filepath, $backupPath . '/' . $filename . '.' . time() . '.deleted');
            
            if (unlink($filepath)) {
                echo json_encode(['success' => true, 'message' => 'File deleted']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete file']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'File not found']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>