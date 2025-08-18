-- SQLite Database Schema for SunTradeGroup
-- Created: 2025-08-13
-- UTF-8 encoding with Persian/Farsi support

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;
PRAGMA encoding = "UTF-8";
PRAGMA journal_mode = WAL;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table with JSON fields for flexible data
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand_id INTEGER,
    category_id INTEGER,
    short_description TEXT,
    full_description TEXT,
    base_price DECIMAL(10,2),
    currency TEXT DEFAULT 'تومان',
    main_image TEXT,
    properties JSON,           -- Flexible key-value pairs
    specifications JSON,       -- Technical specs
    seo_data JSON,            -- SEO title, description, keywords
    images JSON,              -- Array of image paths
    keywords JSON,            -- Search keywords array
    availability BOOLEAN DEFAULT 1,
    featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Product variants with JSON for flexible properties
CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    variant_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    sku TEXT,
    price DECIMAL(10,2),
    price_modifier DECIMAL(10,2) DEFAULT 0,
    stock INTEGER DEFAULT 0,
    properties JSON,           -- Variant-specific properties
    images JSON,              -- Variant images array
    availability BOOLEAN DEFAULT 1,
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Single UI texts table with JSON structure
CREATE TABLE IF NOT EXISTS ui_texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL, -- 'common', 'forms', 'pages'
    content JSON NOT NULL,  -- Full text structure
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category)
);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    requests JSON,          -- Array of timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(endpoint, ip_address)
);

-- Company info table
CREATE TABLE IF NOT EXISTS company_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    data JSON NOT NULL,     -- Full company information
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Category banners table
CREATE TABLE IF NOT EXISTS category_banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT NOT NULL,
    alt TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Brands indexes
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_name ON brands(name);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at);

-- Product variants indexes
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_slug ON product_variants(variant_slug);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_availability ON product_variants(availability);
CREATE INDEX IF NOT EXISTS idx_product_variants_is_default ON product_variants(is_default);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_ip_address ON contacts(ip_address);

-- UI texts indexes
CREATE INDEX IF NOT EXISTS idx_ui_texts_category ON ui_texts(category);
CREATE INDEX IF NOT EXISTS idx_ui_texts_updated_at ON ui_texts(updated_at);

-- Rate limits indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_endpoint ON rate_limits(endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_address ON rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON rate_limits(created_at);

-- Category banners indexes
CREATE INDEX IF NOT EXISTS idx_category_banners_category ON category_banners(category);
CREATE INDEX IF NOT EXISTS idx_category_banners_active ON category_banners(active);
CREATE INDEX IF NOT EXISTS idx_category_banners_display_order ON category_banners(display_order);

-- Triggers for updated_at timestamps
CREATE TRIGGER IF NOT EXISTS trigger_categories_updated_at 
    AFTER UPDATE ON categories
    BEGIN
        UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_brands_updated_at 
    AFTER UPDATE ON brands
    BEGIN
        UPDATE brands SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_products_updated_at 
    AFTER UPDATE ON products
    BEGIN
        UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_product_variants_updated_at 
    AFTER UPDATE ON product_variants
    BEGIN
        UPDATE product_variants SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_contacts_updated_at 
    AFTER UPDATE ON contacts
    BEGIN
        UPDATE contacts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_ui_texts_updated_at 
    AFTER UPDATE ON ui_texts
    BEGIN
        UPDATE ui_texts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_rate_limits_updated_at 
    AFTER UPDATE ON rate_limits
    BEGIN
        UPDATE rate_limits SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_company_info_updated_at 
    AFTER UPDATE ON company_info
    BEGIN
        UPDATE company_info SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_category_banners_updated_at 
    AFTER UPDATE ON category_banners
    BEGIN
        UPDATE category_banners SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;