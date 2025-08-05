<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataFile = __DIR__ . '/data/categories.json';

if (file_exists($dataFile)) {
    $data = file_get_contents($dataFile);
    echo $data;
} else {
    echo json_encode([
        'categories' => [
            ['id' => 'nails-saws', 'name' => 'میخ و اره', 'slug' => 'nails-saws'],
            ['id' => 'locks-cylinders', 'name' => 'قفل و سیلندر', 'slug' => 'locks-cylinders'],
            ['id' => 'shovels-pickaxes', 'name' => 'بیل و کلنگ', 'slug' => 'shovels-pickaxes'],
            ['id' => 'mesh-chains', 'name' => 'توری و زنجیر', 'slug' => 'mesh-chains'],
            ['id' => 'ropes-threads', 'name' => 'طناب و نخ', 'slug' => 'ropes-threads']
        ],
        'status' => 'fallback_data',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>