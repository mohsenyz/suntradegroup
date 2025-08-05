<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataFile = __DIR__ . '/data/brands.json';

if (file_exists($dataFile)) {
    $data = file_get_contents($dataFile);
    echo $data;
} else {
    echo json_encode([
        'brands' => [
            ['id' => 'sun-brand', 'name' => 'سان', 'slug' => 'sun-brand', 'logo' => '/images/brands/sun-brand-logo.png'],
            ['id' => 'moon-brand', 'name' => 'مون', 'slug' => 'moon-brand', 'logo' => '/images/brands/moon-brand-logo.png']
        ],
        'status' => 'fallback_data',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>