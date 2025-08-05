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
            authenticate();
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