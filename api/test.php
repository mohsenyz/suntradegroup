<?php
// Simple test script for the API

$PASSWORD = 'suntradegroup2024';

// Check if password is provided
if (!isset($_GET['password']) || $_GET['password'] !== $PASSWORD) {
    http_response_code(401);
    echo "Unauthorized. Use: ?password=suntradegroup2024\n";
    exit();
}

echo "<h1>API Test Results</h1>\n";
echo "<pre>\n";

// Test 1: List files
echo "=== Test 1: List Files ===\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/api/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Password: suntradegroup2024']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $httpCode\n";
echo "Response: $response\n\n";

// Test 2: Get products
echo "=== Test 2: Get Products ===\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/api/products');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Password: suntradegroup2024']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $httpCode\n";
if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "Products found: " . count($data['data']['products'] ?? []) . "\n";
} else {
    echo "Response: $response\n";
}
echo "\n";

// Test 3: Save test data
echo "=== Test 3: Save Test Data ===\n";
$testData = [
    'filename' => 'test',
    'data' => [
        'message' => 'Hello from API test!',
        'timestamp' => time()
    ]
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/api/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-Password: suntradegroup2024'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $httpCode\n";
echo "Response: $response\n\n";

// Test 4: Get test data back
echo "=== Test 4: Get Test Data ===\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/api/test');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Password: suntradegroup2024']);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Status: $httpCode\n";
echo "Response: $response\n\n";

echo "=== Test Complete ===\n";
echo "</pre>\n";
?>