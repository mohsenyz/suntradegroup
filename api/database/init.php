<?php

require_once __DIR__ . '/Database.php';

class DatabaseInitializer {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function initialize() {
        try {
            echo "Starting database initialization...\n";
            
            // Read and execute schema
            $schemaPath = __DIR__ . '/init.sql';
            if (!file_exists($schemaPath)) {
                throw new Exception("Schema file not found: {$schemaPath}");
            }
            
            $schema = file_get_contents($schemaPath);
            if ($schema === false) {
                throw new Exception("Failed to read schema file");
            }
            
            // Split schema into individual statements
            $statements = $this->splitSqlStatements($schema);
            
            // Execute each statement
            $connection = $this->db->getConnection();
            $connection->beginTransaction();
            
            foreach ($statements as $statement) {
                $statement = trim($statement);
                if (empty($statement) || substr($statement, 0, 2) === '--') {
                    continue; // Skip empty lines and comments
                }
                
                try {
                    $connection->exec($statement);
                } catch (PDOException $e) {
                    echo "Warning: Statement failed (might be expected): " . $e->getMessage() . "\n";
                    echo "Statement: " . substr($statement, 0, 100) . "...\n";
                    // Don't rollback, some failures are expected (like table already exists)
                }
            }
            
            if ($connection->inTransaction()) {
                $connection->commit();
            }
            
            // Verify schema creation
            $this->verifySchema();
            
            echo "Database initialization completed successfully!\n";
            
            return true;
            
        } catch (Exception $e) {
            if (isset($connection) && $connection->inTransaction()) {
                $connection->rollback();
            }
            echo "Database initialization failed: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    private function splitSqlStatements($sql) {
        // Split statements properly handling triggers with BEGIN/END blocks
        $statements = [];
        $lines = explode("\n", $sql);
        $currentStatement = '';
        $inTrigger = false;
        
        foreach ($lines as $line) {
            $line = trim($line);
            
            // Skip comment lines and empty lines
            if (empty($line) || substr($line, 0, 2) === '--') {
                continue;
            }
            
            // Skip PRAGMA statements that might be duplicate
            if (stripos($line, 'PRAGMA') === 0) {
                continue;
            }
            
            // Check if we're starting a trigger
            if (stripos($line, 'CREATE TRIGGER') !== false) {
                $inTrigger = true;
            }
            
            $currentStatement .= $line . "\n";
            
            // For triggers, wait for END; to finish the statement
            if ($inTrigger && stripos($line, 'END;') !== false) {
                $statements[] = trim($currentStatement);
                $currentStatement = '';
                $inTrigger = false;
            }
            // For regular statements, semicolon ends the statement
            else if (!$inTrigger && substr(rtrim($line), -1) === ';') {
                $statements[] = trim($currentStatement);
                $currentStatement = '';
            }
        }
        
        // Add final statement if exists
        if (!empty(trim($currentStatement))) {
            $statements[] = trim($currentStatement);
        }
        
        return $statements;
    }
    
    private function verifySchema() {
        $requiredTables = [
            'categories', 'brands', 'products', 'product_variants',
            'contacts', 'ui_texts', 'rate_limits', 'company_info'
        ];
        
        echo "Verifying schema...\n";
        
        foreach ($requiredTables as $table) {
            $result = $this->db->fetch("SELECT name FROM sqlite_master WHERE type='table' AND name=?", [$table]);
            if (!$result) {
                throw new Exception("Required table '{$table}' was not created");
            }
            echo "✓ Table '{$table}' exists\n";
        }
        
        // Test JSON support
        try {
            $this->db->query("SELECT json_valid('{}')", []);
            echo "✓ JSON1 extension is working\n";
        } catch (Exception $e) {
            throw new Exception("JSON1 extension is not available: " . $e->getMessage());
        }
        
        // Test foreign key constraints
        $result = $this->db->fetch("PRAGMA foreign_keys");
        if ($result['foreign_keys'] != 1) {
            throw new Exception("Foreign key constraints are not enabled");
        }
        echo "✓ Foreign key constraints are enabled\n";
        
        echo "Schema verification completed successfully!\n";
    }
    
    public function reset() {
        try {
            echo "Resetting database...\n";
            
            $tables = [
                'rate_limits', 'product_variants', 'products', 
                'contacts', 'ui_texts', 'company_info',
                'categories', 'brands'
            ];
            
            $connection = $this->db->getConnection();
            $connection->beginTransaction();
            
            // Drop tables in reverse order due to foreign key constraints
            foreach ($tables as $table) {
                try {
                    $connection->exec("DROP TABLE IF EXISTS {$table}");
                    echo "✓ Dropped table '{$table}'\n";
                } catch (PDOException $e) {
                    echo "Warning: Failed to drop table '{$table}': " . $e->getMessage() . "\n";
                }
            }
            
            if ($connection->inTransaction()) {
                $connection->commit();
            }
            
            echo "Database reset completed!\n";
            return true;
            
        } catch (Exception $e) {
            if (isset($connection) && $connection->inTransaction()) {
                $connection->rollback();
            }
            echo "Database reset failed: " . $e->getMessage() . "\n";
            return false;
        }
    }
    
    public function getStatus() {
        try {
            $health = $this->db->checkHealth();
            
            if ($health['status'] === 'healthy') {
                // Count records in each table
                $tables = ['categories', 'brands', 'products', 'product_variants', 'contacts', 'ui_texts'];
                $counts = [];
                
                foreach ($tables as $table) {
                    try {
                        $result = $this->db->fetch("SELECT COUNT(*) as count FROM {$table}");
                        $counts[$table] = $result['count'] ?? 0;
                    } catch (Exception $e) {
                        $counts[$table] = 'N/A';
                    }
                }
                
                return [
                    'status' => 'ready',
                    'message' => 'Database is initialized and ready',
                    'table_counts' => $counts,
                    'database_path' => __DIR__ . '/suntradegroup.db'
                ];
            } else {
                return $health;
            }
            
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }
}

// Allow running this script directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    $init = new DatabaseInitializer();
    
    $command = $argv[1] ?? 'init';
    
    switch ($command) {
        case 'init':
            $success = $init->initialize();
            exit($success ? 0 : 1);
            
        case 'reset':
            $success = $init->reset();
            exit($success ? 0 : 1);
            
        case 'status':
            $status = $init->getStatus();
            echo json_encode($status, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
            exit(0);
            
        default:
            echo "Usage: php init.php [init|reset|status]\n";
            echo "  init   - Initialize database schema\n";
            echo "  reset  - Reset database (drop all tables)\n";
            echo "  status - Show database status\n";
            exit(1);
    }
}