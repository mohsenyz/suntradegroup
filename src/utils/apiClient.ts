export class JsonApiClient {
  private baseUrl: string;
  private password: string;

  constructor(baseUrl?: string, password: string = 'suntradegroup2024') {
    // Auto-detect development environment
    if (!baseUrl) {
      if (typeof window !== 'undefined') {
        // Client-side: check if we're in development
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.baseUrl = isDev ? 'http://localhost:8080/api' : '/api';
      } else {
        // Server-side: default to relative path
        this.baseUrl = '/api';
      }
    } else {
      this.baseUrl = baseUrl;
    }
    
    this.password = password;
  }

  private async makeRequest(
    endpoint: string, 
    method: string = 'GET', 
    data?: unknown
  ): Promise<unknown> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Password': this.password,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      console.log(`[API] ${method} ${url}`);
      const response = await fetch(url, options);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error(`[API Error] ${method} ${url}:`, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`[API Success] ${method} ${url}`);
      return result;
    } catch (error) {
      if (error instanceof TypeError && (error as Error).message.includes('fetch')) {
        console.error('[API] Connection failed - is the PHP server running on http://localhost:8080?');
        throw new Error('Cannot connect to API server. Please start the PHP server.');
      }
      console.error('[API] Request failed:', error);
      throw error;
    }
  }

  // List all JSON files
  async listFiles(): Promise<unknown[]> {
    const response = await this.makeRequest('/') as { files?: unknown[] };
    return response.files || [];
  }

  // Get a specific JSON file
  async getFile(filename: string): Promise<unknown> {
    const response = await this.makeRequest(`/${filename}`) as { data?: unknown };
    return response.data;
  }

  // Save/update a JSON file
  async saveFile(filename: string, data: unknown): Promise<unknown> {
    return await this.makeRequest('/', 'POST', { filename, data });
  }

  // Delete a JSON file
  async deleteFile(filename: string): Promise<unknown> {
    return await this.makeRequest(`/${filename}`, 'DELETE');
  }

  // Get file info (metadata)
  async getFileInfo(filename: string): Promise<unknown> {
    const response = await this.makeRequest(`/${filename}`) as { filename?: string; modified?: string; data?: unknown };
    return {
      filename: response.filename,
      modified: response.modified,
      size: JSON.stringify(response.data).length
    };
  }

  // Initialize backend with data
  async initializeBackend(data: Record<string, unknown>): Promise<unknown> {
    return await this.makeRequest('/init', 'POST', { data });
  }

  // Check if backend is initialized
  async checkInitialization(): Promise<{ initialized: boolean; missing: string[] }> {
    try {
      const files = await this.listFiles();
      const requiredFiles = ['products', 'categories', 'brands', 'texts-common', 'texts-pages', 'texts-forms'];
      const existingFiles = files.map((f: unknown) => (f as { name?: string }).name);
      const missing = requiredFiles.filter(file => !existingFiles.includes(file));
      
      return {
        initialized: missing.length === 0,
        missing
      };
    } catch {
      return {
        initialized: false,
        missing: ['products', 'categories', 'brands', 'texts-common', 'texts-pages', 'texts-forms']
      };
    }
  }
}

// Default instance
export const apiClient = new JsonApiClient();

// Utility functions for common operations
export const jsonApi = {
  // Load products - use direct PHP file
  async loadProducts() {
    try {
      const response = await fetch('/api/products.php');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch {
      console.warn('Failed to load products from API, using local fallback');
      // Fallback to local data
      const response = await fetch('/src/data/products.json');
      return await response.json();
    }
  },

  // Save products
  async saveProducts(products: unknown) {
    return await apiClient.saveFile('products', products);
  },

  // Load texts
  async loadTexts(category: string = 'common') {
    try {
      return await apiClient.getFile(`texts-${category}`);
    } catch {
      console.warn(`Failed to load texts-${category} from API, using local fallback`);
      // Fallback to local data
      const response = await fetch(`/src/data/texts/${category}.json`);
      return await response.json();
    }
  },

  // Save texts
  async saveTexts(category: string, texts: unknown) {
    return await apiClient.saveFile(`texts-${category}`, texts);
  },

  // Load categories
  async loadCategories() {
    try {
      return await apiClient.getFile('categories');
    } catch {
      console.warn('Failed to load categories from API, using local fallback');
      // Return default categories if not found
      return {
        categories: [
          { id: 'locks-cylinders', name: 'قفل و سیلندر', slug: 'locks-cylinders' },
          { id: 'mesh-chains', name: 'توری و زنجیر', slug: 'mesh-chains' },
          { id: 'nails-saws', name: 'میخ و اره', slug: 'nails-saws' },
          { id: 'ropes-threads', name: 'طناب و نخ', slug: 'ropes-threads' },
          { id: 'shovels-pickaxes', name: 'بیل و کلنگ', slug: 'shovels-pickaxes' }
        ]
      };
    }
  },

  // Save categories
  async saveCategories(categories: unknown) {
    return await apiClient.saveFile('categories', categories);
  },

  // Load brands
  async loadBrands() {
    try {
      return await apiClient.getFile('brands');
    } catch {
      console.warn('Failed to load brands from API, using local fallback');
      // Return default brands if not found
      return {
        brands: [
          { id: 'sun-brand', name: 'سان', slug: 'sun-brand', logo: '/images/brands/sun-brand-logo.png' },
          { id: 'moon-brand', name: 'مون', slug: 'moon-brand', logo: '/images/brands/moon-brand-logo.png' }
        ]
      };
    }
  },

  // Save brands
  async saveBrands(brands: unknown) {
    return await apiClient.saveFile('brands', brands);
  }
};