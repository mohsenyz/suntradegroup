<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Password');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration
$PASSWORD = 'suntradegroup2024';
$UPLOAD_DIR = '../public/images/products';
$ORIGINALS_DIR = $UPLOAD_DIR . '/originals';
$MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
$ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
$ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

// Ensure directories exist
if (!is_dir($UPLOAD_DIR)) {
    mkdir($UPLOAD_DIR, 0755, true);
}
if (!is_dir($ORIGINALS_DIR)) {
    mkdir($ORIGINALS_DIR, 0755, true);
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

// Generate unique filename
function generateUniqueFilename($originalName, $directory) {
    $pathInfo = pathinfo($originalName);
    $extension = strtolower($pathInfo['extension'] ?? 'jpg');
    $baseName = preg_replace('/[^a-zA-Z0-9]/', '-', $pathInfo['filename'] ?? 'product-image');
    $baseName = preg_replace('/-+/', '-', $baseName);
    $baseName = trim($baseName, '-');
    
    if (empty($baseName)) {
        $baseName = 'product-' . time();
    }
    
    $counter = 0;
    $fileName = $baseName . '.' . $extension;
    
    while (file_exists($directory . '/' . $fileName)) {
        $counter++;
        $fileName = $baseName . '-' . $counter . '.' . $extension;
    }
    
    return $fileName;
}

// Convert to WebP
function convertToWebP($sourcePath, $destinationPath, $quality = 80) {
    if (!function_exists('imagewebp')) {
        return false;
    }

    $imageInfo = getimagesize($sourcePath);
    if (!$imageInfo) {
        return false;
    }
    
    $mimeType = $imageInfo['mime'];
    $image = null;
    
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            $image = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $image = imagecreatefrompng($sourcePath);
            imagealphablending($image, false);
            imagesavealpha($image, true);
            break;
        case 'image/gif':
            $image = imagecreatefromgif($sourcePath);
            break;
        case 'image/webp':
            return copy($sourcePath, $destinationPath);
    }
    
    if (!$image) {
        return false;
    }
    
    $result = imagewebp($image, $destinationPath, $quality);
    imagedestroy($image);
    
    return $result;
}

// Resize image if needed
function resizeImage($sourcePath, $destinationPath, $maxWidth = 1200, $maxHeight = 1200, $quality = 90) {
    $imageInfo = getimagesize($sourcePath);
    if (!$imageInfo) {
        return false;
    }
    
    $sourceWidth = $imageInfo[0];
    $sourceHeight = $imageInfo[1];
    $mimeType = $imageInfo['mime'];
    
    // If image is small enough, just copy it
    if ($sourceWidth <= $maxWidth && $sourceHeight <= $maxHeight) {
        return copy($sourcePath, $destinationPath);
    }
    
    // Calculate new dimensions
    $ratio = min($maxWidth / $sourceWidth, $maxHeight / $sourceHeight);
    $newWidth = intval($sourceWidth * $ratio);
    $newHeight = intval($sourceHeight * $ratio);
    
    // Create source image
    $sourceImage = null;
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            $sourceImage = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $sourceImage = imagecreatefrompng($sourcePath);
            break;
        case 'image/gif':
            $sourceImage = imagecreatefromgif($sourcePath);
            break;
        case 'image/webp':
            $sourceImage = imagecreatefromwebp($sourcePath);
            break;
    }
    
    if (!$sourceImage) {
        return copy($sourcePath, $destinationPath);
    }
    
    // Create destination image
    $destImage = imagecreatetruecolor($newWidth, $newHeight);
    
    // Preserve transparency for PNG
    if ($mimeType === 'image/png') {
        imagealphablending($destImage, false);
        imagesavealpha($destImage, true);
        $transparent = imagecolorallocatealpha($destImage, 255, 255, 255, 127);
        imagefilledrectangle($destImage, 0, 0, $newWidth, $newHeight, $transparent);
    }
    
    // Resize
    imagecopyresampled($destImage, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $sourceWidth, $sourceHeight);
    
    // Save
    $result = false;
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            $result = imagejpeg($destImage, $destinationPath, $quality);
            break;
        case 'image/png':
            $result = imagepng($destImage, $destinationPath);
            break;
        case 'image/gif':
            $result = imagegif($destImage, $destinationPath);
            break;
        case 'image/webp':
            $result = imagewebp($destImage, $destinationPath, $quality);
            break;
    }
    
    imagedestroy($sourceImage);
    imagedestroy($destImage);
    
    return $result;
}

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    authenticate();
    
    $file = $_FILES['image'];
    
    // Validate file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Upload failed', 'message' => 'File upload error code: ' . $file['error']]);
        exit();
    }
    
    if ($file['size'] > $MAX_FILE_SIZE) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large', 'message' => 'Maximum file size is 10MB']);
        exit();
    }
    
    // Validate file type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $fileType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($fileType, $ALLOWED_TYPES)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type', 'message' => 'Only JPG, PNG, WebP, and GIF images are allowed']);
        exit();
    }
    
    // Validate extension
    $pathInfo = pathinfo($file['name']);
    $extension = strtolower($pathInfo['extension'] ?? '');
    if (!in_array($extension, $ALLOWED_EXTENSIONS)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file extension', 'message' => 'Allowed extensions: jpg, jpeg, png, webp, gif']);
        exit();
    }
    
    try {
        // Generate filenames
        $originalFilename = generateUniqueFilename($file['name'], $ORIGINALS_DIR);
        $processedFilename = generateUniqueFilename($file['name'], $UPLOAD_DIR);
        $webpFilename = pathinfo($processedFilename, PATHINFO_FILENAME) . '.webp';
        
        $originalPath = $ORIGINALS_DIR . '/' . $originalFilename;
        $processedPath = $UPLOAD_DIR . '/' . $processedFilename;
        $webpPath = $UPLOAD_DIR . '/' . $webpFilename;
        
        // Save original
        if (!move_uploaded_file($file['tmp_name'], $originalPath)) {
            throw new Exception('Failed to save original file');
        }
        
        // Create optimized version
        if (!resizeImage($originalPath, $processedPath, 1200, 1200, 85)) {
            throw new Exception('Failed to process image');
        }
        
        // Create WebP version
        $webpCreated = convertToWebP($processedPath, $webpPath, 80);
        
        // Get image info
        $imageInfo = getimagesize($processedPath);
        
        $response = [
            'success' => true,
            'message' => 'Image uploaded successfully',
            'filename' => $processedFilename,
            'url' => '/images/products/' . $processedFilename,
            'original_url' => '/images/products/originals/' . $originalFilename,
            'size' => filesize($processedPath),
            'dimensions' => [
                'width' => $imageInfo[0],
                'height' => $imageInfo[1]
            ]
        ];
        
        if ($webpCreated) {
            $response['webp_url'] = '/images/products/' . $webpFilename;
        }
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        // Clean up on error
        if (isset($originalPath) && file_exists($originalPath)) {
            unlink($originalPath);
        }
        if (isset($processedPath) && file_exists($processedPath)) {
            unlink($processedPath);
        }
        if (isset($webpPath) && file_exists($webpPath)) {
            unlink($webpPath);
        }
        
        http_response_code(500);
        echo json_encode(['error' => 'Upload failed', 'message' => $e->getMessage()]);
    }
    
    exit();
}

// Handle image deletion
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    authenticate();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $filename = $input['filename'] ?? '';
    
    if (empty($filename)) {
        http_response_code(400);
        echo json_encode(['error' => 'Filename required']);
        exit();
    }
    
    // Clean filename
    $filename = ltrim($filename, '/');
    $filename = str_replace('images/products/', '', $filename);
    $filename = basename($filename); // Security: prevent directory traversal
    
    $deleted = [];
    $errors = [];
    
    // Delete main file
    $mainPath = $UPLOAD_DIR . '/' . $filename;
    if (file_exists($mainPath)) {
        if (unlink($mainPath)) {
            $deleted[] = $filename;
        } else {
            $errors[] = 'Failed to delete main file';
        }
    }
    
    // Delete WebP version
    $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
    $webpFilename = $nameWithoutExt . '.webp';
    $webpPath = $UPLOAD_DIR . '/' . $webpFilename;
    if (file_exists($webpPath) && $filename !== $webpFilename) {
        if (unlink($webpPath)) {
            $deleted[] = $webpFilename;
        } else {
            $errors[] = 'Failed to delete WebP file';
        }
    }
    
    // Delete original
    $originalPath = $ORIGINALS_DIR . '/' . $filename;
    if (file_exists($originalPath)) {
        if (unlink($originalPath)) {
            $deleted[] = 'original: ' . $filename;
        } else {
            $errors[] = 'Failed to delete original file';
        }
    }
    
    if (empty($deleted)) {
        http_response_code(404);
        echo json_encode(['error' => 'File not found']);
        exit();
    }
    
    echo json_encode([
        'success' => count($errors) === 0,
        'deleted' => $deleted,
        'errors' => $errors,
        'message' => count($errors) === 0 ? 'Image deleted successfully' : 'Partial deletion'
    ]);
    
    exit();
}

// Handle GET request - list available images
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $images = [];
    
    // Scan for image files
    $extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    foreach ($extensions as $ext) {
        $files = glob($UPLOAD_DIR . '/*.' . $ext);
        foreach ($files as $file) {
            $filename = basename($file);
            $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
            
            // Skip WebP files if original exists
            if ($ext === 'webp') {
                $hasOriginal = false;
                foreach (['jpg', 'jpeg', 'png', 'gif'] as $origExt) {
                    if (file_exists($UPLOAD_DIR . '/' . $nameWithoutExt . '.' . $origExt)) {
                        $hasOriginal = true;
                        break;
                    }
                }
                if ($hasOriginal) continue;
            }
            
            $info = getimagesize($file);
            $imageData = [
                'filename' => $filename,
                'url' => '/images/products/' . $filename,
                'size' => filesize($file),
                'modified' => filemtime($file),
                'width' => $info[0] ?? 0,
                'height' => $info[1] ?? 0
            ];
            
            // Check for WebP version
            $webpPath = $UPLOAD_DIR . '/' . $nameWithoutExt . '.webp';
            if (file_exists($webpPath)) {
                $imageData['webp_url'] = '/images/products/' . $nameWithoutExt . '.webp';
            }
            
            // Check for original
            $originalPath = $ORIGINALS_DIR . '/' . $filename;
            if (file_exists($originalPath)) {
                $imageData['original_url'] = '/images/products/originals/' . $filename;
            }
            
            $images[] = $imageData;
        }
    }
    
    // Sort by modification time (newest first)
    usort($images, function($a, $b) {
        return $b['modified'] - $a['modified'];
    });
    
    echo json_encode([
        'success' => true,
        'images' => $images,
        'count' => count($images)
    ]);
    exit();
}

// Invalid method
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>