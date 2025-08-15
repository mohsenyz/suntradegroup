<?php

require_once __DIR__ . '/Database.php';

class DataMigrator {
    private $db;
    private $dataPath;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->dataPath = __DIR__ . '/../data/';
    }
    
    public function migrate($dryRun = false) {
        try {
            echo "Starting data migration" . ($dryRun ? " (DRY RUN)" : "") . "...\n";
            
            // Create backup of existing database if not dry run
            if (!$dryRun) {
                $backupPath = $this->db->backup();
                echo "✓ Database backup created: {$backupPath}\n";
            }
            
            // Start transaction
            if (!$dryRun) {
                $this->db->beginTransaction();
            }
            
            // Step 1: Migrate categories and brands first (referenced by products)
            $this->migrateCategories($dryRun);
            $this->migrateBrands($dryRun);
            
            // Step 2: Migrate company info and UI texts
            $this->migrateCompanyInfo($dryRun);
            $this->migrateUITexts($dryRun);
            
            // Step 3: Migrate products (depends on categories and brands)
            $this->migrateProducts($dryRun);
            
            // Step 4: Migrate contacts and rate limits
            $this->migrateContacts($dryRun);
            $this->migrateRateLimits($dryRun);
            
            // Commit transaction
            if (!$dryRun) {
                $this->db->commit();
                echo "\n✓ All data migrated successfully!\n";
            } else {
                echo "\n✓ Dry run completed - no data was actually migrated.\n";
            }
            
            // Show final statistics
            $this->showMigrationStatistics();
            
            return true;
            
        } catch (Exception $e) {
            if (!$dryRun && $this->db->getConnection()->inTransaction()) {
                $this->db->rollback();
            }
            echo "\n❌ Migration failed: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    private function migrateCategories($dryRun) {
        echo "\nMigrating categories...\n";
        
        // Load categories from multiple sources
        $sources = [
            $this->dataPath . 'categories.json',
            $this->dataPath . 'products.json' // Categories also embedded here
        ];
        
        $allCategories = [];
        
        foreach ($sources as $source) {
            if (!file_exists($source)) {
                echo "⚠ Source file not found: {$source}\n";
                continue;
            }
            
            $data = json_decode(file_get_contents($source), true);
            if (!$data) {
                echo "⚠ Failed to parse JSON: {$source}\n";
                continue;
            }
            
            if (isset($data['categories'])) {
                foreach ($data['categories'] as $category) {
                    $slug = $category['id'] ?? $category['slug'] ?? null;
                    if ($slug && !isset($allCategories[$slug])) {
                        $allCategories[$slug] = [
                            'slug' => $slug,
                            'name' => $category['name']
                        ];
                    }
                }
            }
        }
        
        echo "Found " . count($allCategories) . " unique categories\n";
        
        if (!$dryRun) {
            foreach ($allCategories as $category) {
                try {
                    $this->db->insert('categories', $category);
                    echo "✓ Migrated category: {$category['name']}\n";
                } catch (Exception $e) {
                    echo "⚠ Failed to migrate category {$category['name']}: " . $e->getMessage() . "\n";
                }
            }
        } else {
            foreach ($allCategories as $category) {
                echo "✓ Would migrate category: {$category['name']}\n";
            }
        }
    }
    
    private function migrateBrands($dryRun) {
        echo "\nMigrating brands...\n";
        
        // Load brands from multiple sources
        $sources = [
            $this->dataPath . 'brands.json',
            $this->dataPath . 'products.json' // Brands also embedded here
        ];
        
        $allBrands = [];
        
        foreach ($sources as $source) {
            if (!file_exists($source)) {
                echo "⚠ Source file not found: {$source}\n";
                continue;
            }
            
            $data = json_decode(file_get_contents($source), true);
            if (!$data) {
                echo "⚠ Failed to parse JSON: {$source}\n";
                continue;
            }
            
            if (isset($data['brands'])) {
                foreach ($data['brands'] as $brand) {
                    $slug = $brand['id'] ?? $brand['slug'] ?? null;
                    $name = $brand['name'] ?? null;
                    
                    if ($slug && $name && !isset($allBrands[$slug])) {
                        $allBrands[$slug] = [
                            'slug' => $slug,
                            'name' => $name,
                            'logo' => $brand['logo'] ?? null
                        ];
                    }
                }
            }
        }
        
        echo "Found " . count($allBrands) . " unique brands\n";
        
        if (!$dryRun) {
            foreach ($allBrands as $brand) {
                try {
                    $this->db->insert('brands', $brand);
                    echo "✓ Migrated brand: {$brand['name']}\n";
                } catch (Exception $e) {
                    echo "⚠ Failed to migrate brand {$brand['name']}: " . $e->getMessage() . "\n";
                }
            }
        } else {
            foreach ($allBrands as $brand) {
                echo "✓ Would migrate brand: {$brand['name']}\n";
            }
        }
    }
    
    private function migrateProducts($dryRun) {
        echo "\nMigrating products...\n";
        
        $productsFile = $this->dataPath . 'products.json';
        if (!file_exists($productsFile)) {
            echo "⚠ Products file not found: {$productsFile}\n";
            return;
        }
        
        $data = json_decode(file_get_contents($productsFile), true);
        if (!$data || !isset($data['products'])) {
            echo "⚠ No products found in file\n";
            return;
        }
        
        // Get brand and category ID mappings
        $brandMap = $this->getBrandIdMap();
        $categoryMap = $this->getCategoryIdMap();
        
        $products = $data['products'];
        echo "Found " . count($products) . " products\n";
        
        foreach ($products as $product) {
            try {
                // Map brand and category references
                $brandId = null;
                if (isset($product['brand'])) {
                    // Try to find brand by name first, then by slug
                    $brandId = $brandMap[$product['brand']] ?? null;
                    if (!$brandId && $dryRun) {
                        echo "⚠ Brand not found for product {$product['name']}: {$product['brand']} (will be created during migration)\n";
                    }
                }
                
                $categoryId = null;
                if (isset($product['category'])) {
                    // Try to find category by slug first, then by name
                    $categoryId = $categoryMap[$product['category']] ?? null;
                    if (!$categoryId && $dryRun) {
                        echo "⚠ Category not found for product {$product['name']}: {$product['category']} (will be created during migration)\n";
                    }
                }
                
                // Prepare product data
                $productData = [
                    'slug' => $product['slug'],
                    'name' => $product['name'],
                    'brand_id' => $brandId,
                    'category_id' => $categoryId,
                    'short_description' => $product['shortDescription'] ?? null,
                    'full_description' => $product['fullDescription'] ?? null,
                    'base_price' => $product['basePrice'] ?? null,
                    'currency' => $product['currency'] ?? 'تومان',
                    'main_image' => $product['mainImage'] ?? null,
                    'properties' => isset($product['properties']) ? json_encode($product['properties']) : null,
                    'specifications' => isset($product['specifications']) ? json_encode($product['specifications']) : null,
                    'seo_data' => json_encode([
                        'title' => $product['seoTitle'] ?? null,
                        'description' => $product['seoDescription'] ?? null,
                        'keywords' => $product['seoKeywords'] ?? null
                    ]),
                    'images' => isset($product['images']) ? json_encode($product['images']) : null,
                    'keywords' => isset($product['keywords']) ? json_encode($product['keywords']) : null,
                    'availability' => $product['availability'] ?? true,
                    'featured' => $product['featured'] ?? false
                ];
                
                if (!$dryRun) {
                    $productId = $this->db->insert('products', $productData);
                    echo "✓ Migrated product: {$product['name']} (ID: {$productId})\n";
                    
                    // Migrate product variants
                    if (isset($product['variants']) && is_array($product['variants'])) {
                        $this->migrateProductVariants($productId, $product['variants'], $dryRun);
                    }
                } else {
                    echo "✓ Would migrate product: {$product['name']}\n";
                    if (isset($product['variants'])) {
                        echo "  └── with " . count($product['variants']) . " variants\n";
                    }
                }
                
            } catch (Exception $e) {
                echo "❌ Failed to migrate product {$product['name']}: " . $e->getMessage() . "\n";
            }
        }
    }
    
    private function migrateProductVariants($productId, $variants, $dryRun) {
        foreach ($variants as $variant) {
            try {
                $variantData = [
                    'product_id' => $productId,
                    'variant_slug' => $variant['id'] ?? uniqid(),
                    'name' => $variant['name'],
                    'sku' => $variant['sku'] ?? null,
                    'price' => $variant['price'] ?? null,
                    'price_modifier' => $variant['priceModifier'] ?? 0,
                    'stock' => $variant['stock'] ?? 0,
                    'properties' => isset($variant['properties']) ? json_encode($variant['properties']) : null,
                    'images' => isset($variant['images']) ? json_encode($variant['images']) : null,
                    'availability' => $variant['availability'] ?? true,
                    'is_default' => $variant['isDefault'] ?? false
                ];
                
                if (!$dryRun) {
                    $variantId = $this->db->insert('product_variants', $variantData);
                    echo "  ✓ Migrated variant: {$variant['name']} (ID: {$variantId})\n";
                } else {
                    echo "  ✓ Would migrate variant: {$variant['name']}\n";
                }
                
            } catch (Exception $e) {
                echo "  ❌ Failed to migrate variant {$variant['name']}: " . $e->getMessage() . "\n";
            }
        }
    }
    
    private function migrateContacts($dryRun) {
        echo "\nMigrating contacts...\n";
        
        $contactsFile = $this->dataPath . 'contacts.json';
        if (!file_exists($contactsFile)) {
            echo "⚠ Contacts file not found: {$contactsFile}\n";
            return;
        }
        
        $data = json_decode(file_get_contents($contactsFile), true);
        if (!$data || !isset($data['contacts'])) {
            echo "⚠ No contacts found in file\n";
            return;
        }
        
        $contacts = $data['contacts'];
        echo "Found " . count($contacts) . " contacts\n";
        
        foreach ($contacts as $contact) {
            try {
                $contactData = [
                    'name' => $contact['name'],
                    'email' => $contact['email'],
                    'phone' => $contact['phone'] ?? null,
                    'subject' => $contact['subject'] ?? null,
                    'message' => $contact['message'] ?? null,
                    'status' => $contact['status'] ?? 'new',
                    'ip_address' => $contact['ip'] ?? null,
                    'user_agent' => $contact['user_agent'] ?? null,
                    'created_at' => $contact['timestamp'] ?? null
                ];
                
                if (!$dryRun) {
                    $contactId = $this->db->insert('contacts', $contactData);
                    echo "✓ Migrated contact: {$contact['name']} (ID: {$contactId})\n";
                } else {
                    echo "✓ Would migrate contact: {$contact['name']}\n";
                }
                
            } catch (Exception $e) {
                echo "❌ Failed to migrate contact {$contact['name']}: " . $e->getMessage() . "\n";
            }
        }
    }
    
    private function migrateUITexts($dryRun) {
        echo "\nMigrating UI texts...\n";
        
        $textFiles = [
            'common' => $this->dataPath . 'texts-common.json',
            'forms' => $this->dataPath . 'texts-forms.json',
            'pages' => $this->dataPath . 'texts-pages.json'
        ];
        
        foreach ($textFiles as $category => $filePath) {
            if (!file_exists($filePath)) {
                echo "⚠ Text file not found: {$filePath}\n";
                continue;
            }
            
            $data = json_decode(file_get_contents($filePath), true);
            if (!$data) {
                echo "⚠ Failed to parse text file: {$filePath}\n";
                continue;
            }
            
            $textData = [
                'category' => $category,
                'content' => json_encode($data)
            ];
            
            if (!$dryRun) {
                try {
                    $this->db->insert('ui_texts', $textData);
                    echo "✓ Migrated UI texts: {$category}\n";
                } catch (Exception $e) {
                    echo "❌ Failed to migrate UI texts {$category}: " . $e->getMessage() . "\n";
                }
            } else {
                echo "✓ Would migrate UI texts: {$category}\n";
            }
        }
    }
    
    private function migrateCompanyInfo($dryRun) {
        echo "\nMigrating company info...\n";
        
        $productsFile = $this->dataPath . 'products.json';
        if (!file_exists($productsFile)) {
            echo "⚠ Products file not found: {$productsFile}\n";
            return;
        }
        
        $data = json_decode(file_get_contents($productsFile), true);
        if (isset($data['companyInfo'])) {
            $companyData = [
                'id' => 1,
                'data' => json_encode($data['companyInfo'])
            ];
            
            if (!$dryRun) {
                try {
                    $this->db->insert('company_info', $companyData);
                    echo "✓ Migrated company info\n";
                } catch (Exception $e) {
                    echo "❌ Failed to migrate company info: " . $e->getMessage() . "\n";
                }
            } else {
                echo "✓ Would migrate company info\n";
            }
        } else {
            echo "⚠ No company info found\n";
        }
    }
    
    private function migrateRateLimits($dryRun) {
        echo "\nMigrating rate limits...\n";
        
        $rateLimitsFile = $this->dataPath . 'rate_limits.json';
        if (!file_exists($rateLimitsFile)) {
            echo "⚠ Rate limits file not found: {$rateLimitsFile}\n";
            return;
        }
        
        $data = json_decode(file_get_contents($rateLimitsFile), true);
        if (!$data) {
            echo "⚠ Failed to parse rate limits file\n";
            return;
        }
        
        foreach ($data as $endpoint => $ipData) {
            foreach ($ipData as $ip => $requests) {
                $rateLimitData = [
                    'endpoint' => $endpoint,
                    'ip_address' => $ip,
                    'requests' => json_encode($requests)
                ];
                
                if (!$dryRun) {
                    try {
                        $this->db->insert('rate_limits', $rateLimitData);
                        echo "✓ Migrated rate limit: {$endpoint} / {$ip}\n";
                    } catch (Exception $e) {
                        echo "❌ Failed to migrate rate limit {$endpoint}/{$ip}: " . $e->getMessage() . "\n";
                    }
                } else {
                    echo "✓ Would migrate rate limit: {$endpoint} / {$ip}\n";
                }
            }
        }
    }
    
    private function getBrandIdMap() {
        if (!$this->db) return [];
        
        try {
            $brands = $this->db->fetchAll("SELECT id, name, slug FROM brands");
            $map = [];
            foreach ($brands as $brand) {
                $map[$brand['name']] = $brand['id'];
                $map[$brand['slug']] = $brand['id'];
            }
            return $map;
        } catch (Exception $e) {
            return [];
        }
    }
    
    private function getCategoryIdMap() {
        if (!$this->db) return [];
        
        try {
            $categories = $this->db->fetchAll("SELECT id, name, slug FROM categories");
            $map = [];
            foreach ($categories as $category) {
                $map[$category['name']] = $category['id'];
                $map[$category['slug']] = $category['id'];
            }
            return $map;
        } catch (Exception $e) {
            return [];
        }
    }
    
    private function showMigrationStatistics() {
        echo "\n" . str_repeat("=", 50) . "\n";
        echo "MIGRATION STATISTICS\n";
        echo str_repeat("=", 50) . "\n";
        
        $tables = ['categories', 'brands', 'products', 'product_variants', 'contacts', 'ui_texts', 'rate_limits', 'company_info'];
        
        foreach ($tables as $table) {
            try {
                $result = $this->db->fetch("SELECT COUNT(*) as count FROM {$table}");
                $count = $result['count'] ?? 0;
                echo sprintf("%-20s: %d records\n", ucfirst(str_replace('_', ' ', $table)), $count);
            } catch (Exception $e) {
                echo sprintf("%-20s: Error\n", ucfirst(str_replace('_', ' ', $table)));
            }
        }
        
        echo str_repeat("=", 50) . "\n";
    }
}

// Allow running this script directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    $migrator = new DataMigrator();
    
    $command = $argv[1] ?? 'migrate';
    $dryRun = in_array('--dry-run', $argv);
    
    switch ($command) {
        case 'migrate':
            $success = $migrator->migrate($dryRun);
            exit($success ? 0 : 1);
            
        default:
            echo "Usage: php migrate.php [migrate] [--dry-run]\n";
            echo "  migrate   - Migrate data from JSON to SQLite\n";
            echo "  --dry-run - Show what would be migrated without making changes\n";
            exit(1);
    }
}