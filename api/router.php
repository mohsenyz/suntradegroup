<?php
// Simple router for PHP built-in server

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle API routes
if (strpos($uri, '/api') === 0) {
    // Remove /api prefix and set proper path for the main API
    $_SERVER['REQUEST_URI'] = substr($uri, 4) ?: '/';
    include __DIR__ . '/index.php';
    return true;
}

// For all other requests, return false to use default PHP behavior
return false;
?>