import { API_CONFIG, getFullUrl } from '../config/api.config';
import { ApiResponse, Category } from '../types/api.types';

export class ApiService {
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.CATEGORIES));
      const data: ApiResponse<Category[]> = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.errorMessage || 'Failed to fetch categories');
      }
      
      // Ensure data.data is an array
      if (!Array.isArray(data.data)) {
        console.error('Received data is not an array:', data.data);
        return [];
      }
      
      return data.data.map(category => ({
        ...category,
        name: category.name || 'Unnamed Category', // Provide fallback for empty names
        children: Array.isArray(category.children) ? category.children : [] // Ensure children is always an array
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  static async createCategory(name: string, parentId: number | null = null): Promise<Category> {
    try {
      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.CATEGORIES), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          parentId === null
            ? { name }  // Don't include parentId for root-level categories
            : { name, parentId }
        ),
      });

      const data: ApiResponse<Category> = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.errorMessage || 'Failed to create category');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  static async deleteCategory(categoryId: number): Promise<void> {
    try {
      const url = `${getFullUrl(API_CONFIG.ENDPOINTS.CATEGORIES)}?categoryIds=${categoryId}`;
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Don't try to parse response as JSON if it's empty
      const text = await response.text();
      if (text) {
        try {
          const data: ApiResponse<void> = JSON.parse(text);
          if (!data.success) {
            throw new Error(data.errorMessage || 'Failed to delete category');
          }
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          // If we can't parse the JSON but the response was OK, we'll consider it successful
          if (response.ok) {
            return;
          }
          throw new Error('Invalid response format');
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  static async updateCategory(categoryId: number, name: string): Promise<Category> {
    try {
      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.CATEGORIES), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: categoryId,
          name,
          parentId: null  // Include parentId as null for consistency with create endpoint
        }),
      });

      const data: ApiResponse<Category> = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.errorMessage || 'Failed to update category');
      }

      return data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  static async getCountries() {
    try {
      const response = await fetch(getFullUrl('/Dictionaries/Country'));
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.errorMessage || 'Failed to fetch countries');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  static async createCountry(name: string) {
    try {
      const response = await fetch(getFullUrl('/Dictionaries/Country'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.errorMessage || 'Failed to create country');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating country:', error);
      throw error;
    }
  }

  static async getProducts(page: number, pageSize: number, sortBy: string = 'id', sortDesc: boolean = true, filters: any = null) {
    try {
      const skip = pageSize * (page - 1);
      let url = getFullUrl(`/Dictionaries/Products?Take=${pageSize}&Skip=${skip}&SortBy=${sortBy}&SortByDescendingOrder=${sortDesc}`);
      
      // Add filter parameters if provided
      if (filters) {
        // Handle CategoryIds (array)
        if (filters.CategoryIds && filters.CategoryIds.length > 0) {
          url += `&CategoryIds=${filters.CategoryIds.join(',')}`;
        }
        
        // Handle CountryIds (array)
        if (filters.CountryIds && filters.CountryIds.length > 0) {
          url += `&CountryIds=${filters.CountryIds.join(',')}`;
        }
        
        // Handle simple string/number parameters
        if (filters.Code) url += `&Code=${encodeURIComponent(filters.Code)}`;
        if (filters.Name) url += `&Name=${encodeURIComponent(filters.Name)}`;
        if (filters.PriceStart) url += `&PriceStart=${filters.PriceStart}`;
        if (filters.PriceEnd) url += `&PriceEnd=${filters.PriceEnd}`;
        if (filters.DateStart) url += `&DateStart=${filters.DateStart}`;
        if (filters.DateEnd) url += `&DateEnd=${filters.DateEnd}`;
      }
      
      console.log('API Request URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.errorMessage || 'Failed to fetch products');
      }
      
      return {
        items: data.data?.products || [],
        totalCount: data.data?.count || 0
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async getProductsByCategory(categoryId: number, page: number, pageSize: number, sortBy: string = 'id', sortDesc: boolean = true, filters: any = null) {
    try {
      const skip = pageSize * (page - 1);
      let url = getFullUrl(`/Dictionaries/Products?CategoryIds=${categoryId}&Take=${pageSize}&Skip=${skip}&SortBy=${sortBy}&SortByDescendingOrder=${sortDesc}`);
      
      // Add filter parameters if provided
      if (filters) {
        // Skip CategoryIds since we're already filtering by category
        
        // Handle CountryIds (array)
        if (filters.CountryIds && filters.CountryIds.length > 0) {
          url += `&CountryIds=${filters.CountryIds.join(',')}`;
        }
        
        // Handle simple string/number parameters
        if (filters.Code) url += `&Code=${encodeURIComponent(filters.Code)}`;
        if (filters.Name) url += `&Name=${encodeURIComponent(filters.Name)}`;
        if (filters.PriceStart) url += `&PriceStart=${filters.PriceStart}`;
        if (filters.PriceEnd) url += `&PriceEnd=${filters.PriceEnd}`;
        if (filters.DateStart) url += `&DateStart=${filters.DateStart}`;
        if (filters.DateEnd) url += `&DateEnd=${filters.DateEnd}`;
      }
      
      console.log('API Request URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.errorMessage || 'Failed to fetch products by category');
      }
      
      return {
        items: data.data?.products || [],
        totalCount: data.data?.count || 0
      };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  static async createProduct(productData: {
    categoryId: number;
    code: string;
    name: string;
    price: number;
    countryId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      // Format dates as ISO strings if they exist
      const formattedData = {
        ...productData,
        startDate: productData.startDate ? new Date(productData.startDate).toISOString() : undefined,
        endDate: productData.endDate ? new Date(productData.endDate).toISOString() : undefined,
      };

      const response = await fetch(getFullUrl('/Dictionaries/Products'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.errorMessage || 'Failed to create product');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async deleteProduct(productId: number) {
    try {
      const response = await fetch(getFullUrl(`/Dictionaries/Products/${productId}`), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle empty response similar to deleteCategory
      const text = await response.text();
      if (text) {
        try {
          const data = JSON.parse(text);
          if (!data.success) {
            throw new Error(data.errorMessage || 'Failed to delete product');
          }
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          // If we can't parse the JSON but the response was OK, we'll consider it successful
          if (response.ok) {
            return;
          }
          throw new Error('Invalid response format');
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  static async deleteProducts(productIds: number[]) {
    try {
      if (!productIds.length) return;
      
      // Build query string with multiple productIds parameters
      const queryParams = productIds.map(id => `productIds=${id}`).join('&');
      const url = getFullUrl(`/Dictionaries/Products?${queryParams}`);
      
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle empty response
      const text = await response.text();
      if (text) {
        try {
          const data = JSON.parse(text);
          if (!data.success) {
            throw new Error(data.errorMessage || 'Failed to delete products');
          }
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          // If we can't parse the JSON but the response was OK, we'll consider it successful
          if (response.ok) {
            return;
          }
          throw new Error('Invalid response format');
        }
      }
    } catch (error) {
      console.error('Error deleting multiple products:', error);
      throw error;
    }
  }

  static async updateProduct(id: number, product: any) {
    try {
      // Remove the ID from the URL path but keep it in the request body
      const response = await fetch(getFullUrl(`/Dictionaries/Products`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.errorMessage || 'Failed to update product');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
} 