<?php
// Initialize API with sample data from the existing files

$DATA_DIR = __DIR__ . '/data';
$SOURCE_DIR = dirname(__DIR__) . '/src/data';
$PASSWORD = 'suntradegroup2024';

// Check if password is provided
if (!isset($_GET['password']) || $_GET['password'] !== $PASSWORD) {
    http_response_code(401);
    echo "Unauthorized. Use: ?password=suntradegroup2024\n";
    exit();
}

// Ensure data directory exists
if (!is_dir($DATA_DIR)) {
    mkdir($DATA_DIR, 0755, true);
}

// Copy products.json
$sourceProducts = $SOURCE_DIR . '/products.json';
$destProducts = $DATA_DIR . '/products.json';

if (file_exists($sourceProducts)) {
    $productsData = file_get_contents($sourceProducts);
    file_put_contents($destProducts, $productsData);
    echo "✓ Products data initialized\n";
} else {
    echo "⚠ Products source file not found\n";
}

// Copy text files
$textFiles = ['common', 'pages', 'forms'];
foreach ($textFiles as $file) {
    $sourceFile = $SOURCE_DIR . "/texts/{$file}.json";
    $destFile = $DATA_DIR . "/texts-{$file}.json";
    
    if (file_exists($sourceFile)) {
        $textData = file_get_contents($sourceFile);
        file_put_contents($destFile, $textData);
        echo "✓ Text data {$file} initialized\n";
    } else {
        echo "⚠ Text source file {$file} not found\n";
    }
}

// Initialize categories
$categoriesData = [
    'categories' => [
        ['id' => 'locks-cylinders', 'name' => 'قفل و سیلندر', 'slug' => 'locks-cylinders'],
        ['id' => 'mesh-chains', 'name' => 'توری و زنجیر', 'slug' => 'mesh-chains'],
        ['id' => 'nails-saws', 'name' => 'میخ و اره', 'slug' => 'nails-saws'],
        ['id' => 'ropes-threads', 'name' => 'طناب و نخ', 'slug' => 'ropes-threads'],
        ['id' => 'shovels-pickaxes', 'name' => 'بیل و کلنگ', 'slug' => 'shovels-pickaxes']
    ]
];
file_put_contents($DATA_DIR . '/categories.json', json_encode($categoriesData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo "✓ Categories data initialized\n";

// Initialize brands
$brandsData = [
    'brands' => [
        ['id' => 'sun-brand', 'name' => 'سان', 'slug' => 'sun-brand', 'logo' => '/images/brands/sun-brand-logo.png'],
        ['id' => 'moon-brand', 'name' => 'مون', 'slug' => 'moon-brand', 'logo' => '/images/brands/moon-brand-logo.png']
    ]
];
file_put_contents($DATA_DIR . '/brands.json', json_encode($brandsData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo "✓ Brands data initialized\n";

echo "\n🎉 API initialization completed!\n";
echo "You can now use the CMS and frontend with the PHP backend.\n";
?>