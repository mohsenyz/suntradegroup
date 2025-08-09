import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  TextsData, 
  ProductsData, 
  CategoriesData, 
  BrandsData, 
  ApiResponse, 
  SaveResponse 
} from '../types';

// API Client Configuration
const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:8080/api' 
  : '/api';
const API_PASSWORD = 'suntradegroup2024';

// Base fetch wrapper with authentication
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Password': API_PASSWORD,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      error: 'Network Error', 
      message: `HTTP ${response.status}: ${response.statusText}` 
    }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// API Functions
export const api = {
  // Get data
  getTexts: async (category: string): Promise<ApiResponse<any>> => 
    apiRequest(`/texts-${category}`),
  
  getProducts: async (): Promise<ApiResponse<ProductsData>> => 
    apiRequest('/products'),
    
  getCategories: async (): Promise<ApiResponse<CategoriesData>> => 
    apiRequest('/categories'),
    
  getBrands: async (): Promise<ApiResponse<BrandsData>> => 
    apiRequest('/brands'),

  // Save data
  saveTexts: async (category: string, data: any): Promise<SaveResponse> => 
    apiRequest('/', {
      method: 'POST',
      body: JSON.stringify({ filename: `texts-${category}`, data }),
    }),

  saveProducts: async (data: ProductsData): Promise<SaveResponse> => 
    apiRequest('/', {
      method: 'POST',
      body: JSON.stringify({ filename: 'products', data }),
    }),

  saveCategories: async (data: CategoriesData): Promise<SaveResponse> => 
    apiRequest('/', {
      method: 'POST',
      body: JSON.stringify({ filename: 'categories', data }),
    }),

  saveBrands: async (data: BrandsData): Promise<SaveResponse> => 
    apiRequest('/', {
      method: 'POST',
      body: JSON.stringify({ filename: 'brands', data }),
    }),

  // List files
  listFiles: async (): Promise<{ files: Array<{ name: string; size: number; modified: number }> }> => 
    apiRequest('/'),
};

// React Query Keys
export const queryKeys = {
  texts: (category: string) => ['texts', category] as const,
  products: () => ['products'] as const,
  categories: () => ['categories'] as const,
  brands: () => ['brands'] as const,
  files: () => ['files'] as const,
};

// React Query Hooks
export const useTexts = (category: string) => {
  return useQuery({
    queryKey: queryKeys.texts(category),
    queryFn: () => api.getTexts(category),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: queryKeys.products(),
    queryFn: api.getProducts,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: api.getCategories,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: queryKeys.brands(),
    queryFn: api.getBrands,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation Hooks
export const useSaveTexts = (category: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.saveTexts(category, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.texts(category) });
    },
  });
};

export const useSaveProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.saveProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });
    },
  });
};

export const useSaveCategories = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.saveCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
    },
  });
};

export const useSaveBrands = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.saveBrands,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
    },
  });
};