<?php

class Database {
    private static $instance = null;
    private $connection;
    private $dbPath;

    private function __construct() {
        $this->dbPath = __DIR__ . '/suntradegroup.db';
        $this->connect();
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    private function connect() {
        try {
            // Create SQLite connection with UTF-8 support
            $this->connection = new PDO('sqlite:' . $this->dbPath);
            
            // Set error mode to exceptions
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Enable foreign key constraints
            $this->connection->exec('PRAGMA foreign_keys = ON');
            
            // Set UTF-8 encoding for Persian/Farsi content
            $this->connection->exec('PRAGMA encoding = "UTF-8"');
            
            // Enable JSON1 extension (usually built-in with SQLite 3.38+)
            $this->connection->exec('SELECT json_valid("{}");');
            
            // Set journal mode for better concurrent access
            $this->connection->exec('PRAGMA journal_mode = WAL');
            
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    public function getConnection() {
        // Check if connection is still alive
        if ($this->connection === null) {
            $this->connect();
        }
        return $this->connection;
    }

    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database query failed: " . $e->getMessage() . " SQL: " . $sql);
            throw new Exception("Database query failed: " . $e->getMessage());
        }
    }

    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insert($table, $data) {
        $columns = array_keys($data);
        $placeholders = array_map(function($col) { return ':' . $col; }, $columns);
        
        $sql = "INSERT INTO {$table} (" . implode(', ', $columns) . ") 
                VALUES (" . implode(', ', $placeholders) . ")";
        
        $stmt = $this->query($sql, $data);
        return $this->connection->lastInsertId();
    }

    public function update($table, $data, $where, $whereParams = []) {
        $setParts = array_map(function($col) { return $col . ' = :' . $col; }, array_keys($data));
        
        $sql = "UPDATE {$table} SET " . implode(', ', $setParts) . " WHERE {$where}";
        
        $params = array_merge($data, $whereParams);
        return $this->query($sql, $params);
    }

    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        return $this->query($sql, $params);
    }

    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }

    public function commit() {
        return $this->connection->commit();
    }

    public function rollback() {
        return $this->connection->rollback();
    }

    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }

    public function backup($backupPath = null) {
        if ($backupPath === null) {
            $backupPath = __DIR__ . '/backups/suntradegroup_' . date('Y-m-d_H-i-s') . '.db';
        }
        
        // Create backup directory if it doesn't exist
        $backupDir = dirname($backupPath);
        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        // Copy database file
        if (copy($this->dbPath, $backupPath)) {
            return $backupPath;
        } else {
            throw new Exception("Failed to create database backup");
        }
    }

    public function exportToJson($outputPath = null) {
        if ($outputPath === null) {
            $outputPath = __DIR__ . '/exports/suntradegroup_export_' . date('Y-m-d_H-i-s') . '.json';
        }

        // Create export directory if it doesn't exist
        $exportDir = dirname($outputPath);
        if (!is_dir($exportDir)) {
            mkdir($exportDir, 0755, true);
        }

        $export = [];
        
        // Export all tables
        $tables = ['categories', 'brands', 'products', 'product_variants', 
                  'contacts', 'ui_texts', 'rate_limits', 'company_info'];
        
        foreach ($tables as $table) {
            try {
                $export[$table] = $this->fetchAll("SELECT * FROM {$table}");
            } catch (Exception $e) {
                // Table might not exist yet
                $export[$table] = [];
            }
        }

        $json = json_encode($export, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        if (file_put_contents($outputPath, $json)) {
            return $outputPath;
        } else {
            throw new Exception("Failed to export database to JSON");
        }
    }

    public function checkHealth() {
        try {
            $this->query("SELECT 1");
            return ['status' => 'healthy', 'message' => 'Database connection is working'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    // Prevent cloning of singleton
    private function __clone() {}

    // Prevent unserialization of singleton
    public function __wakeup() {}
}