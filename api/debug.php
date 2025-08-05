<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Debug information about the server environment
$info = [
    'status' => 'debug_info',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'unknown',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'unknown',
        'current_dir' => __DIR__,
    ],
    'files_in_api_dir' => [],
    'files_in_root' => [],
    'files_in_data_dir' => [],
    'htaccess_exists' => [
        'root' => file_exists('../.htaccess'),
        'api' => file_exists('.htaccess')
    ]
];

// List files in API directory
if (is_dir(__DIR__)) {
    $info['files_in_api_dir'] = array_values(array_diff(scandir(__DIR__), ['.', '..']));
}

// List files in root directory
if (is_dir('../')) {
    $files = array_diff(scandir('../'), ['.', '..']);
    $info['files_in_root'] = array_slice(array_values($files), 0, 20); // Limit to first 20 files
}

// List files in data directory
if (is_dir(__DIR__ . '/data')) {
    $info['files_in_data_dir'] = array_values(array_diff(scandir(__DIR__ . '/data'), ['.', '..']));
} else {
    $info['files_in_data_dir'] = ['directory_not_found'];
}

// Check if .htaccess content can be read
if (file_exists('../.htaccess')) {
    $htaccess_content = file_get_contents('../.htaccess');
    $info['htaccess_content'] = substr($htaccess_content, 0, 500); // First 500 chars
}

echo json_encode($info, JSON_PRETTY_PRINT);
?>