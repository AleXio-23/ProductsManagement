import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MenuBar from './components/MenuBar';
import ProductTable from './components/ProductTable';
import { ApiService } from './services/api.service';
import { Product, Category } from './types/api.types';
import Dialog from './components/Dialog';
import { useToast } from './contexts/ToastContext';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

interface ProductFormData {
  categoryId: number;
  code: string;
  name: string;
  price: number;
  countryId?: number;
  startDate?: string;
  endDate?: string;
}

// Add type for sort configuration
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm' as 'confirm' | 'alert' | 'error',
    onConfirm: () => {},
    productIdsToDelete: [] as number[]
  });
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [pageTitle, setPageTitle] = useState('პროდუქტების მართვა');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'id',
    direction: 'desc'
  });

  // Get the toast functions
  const { showToast } = useToast();

  useEffect(() => {
    if (activeCategory) {
      fetchProductsByCategory(activeCategory, currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc');
    } else {
      fetchProducts(currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc');
    }
  }, [currentPage, pageSize, activeCategory, sortConfig]);

  const getCategoryName = async (categoryId: number) => {
    try {
      const categories = await ApiService.getCategories();
      
      const findCategoryName = (categories: Category[], id: number): string | null => {
        for (const category of categories) {
          if (category.id === id) return category.name;
          const childResult = findCategoryName(category.children, id);
          if (childResult) return childResult;
        }
        return null;
      };
      
      return findCategoryName(categories, categoryId);
    } catch (error) {
      console.error('Error finding category name:', error);
      return null;
    }
  };

  const fetchProducts = async (page: number, size: number, sortBy: string = 'id', sortDesc: boolean = true) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.getProducts(page, size, sortBy, sortDesc);
      setProducts(result.items);
      setTotalItems(result.totalCount);
      setPageTitle('პროდუქტების მართვა - ყველა პროდუქტი');
      setSelectedCategoryName(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId: number, page: number, size: number, sortBy: string = 'id', sortDesc: boolean = true) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!selectedCategoryName) {
        const name = await getCategoryName(categoryId);
        setSelectedCategoryName(name);
        if (name) {
          setPageTitle(`პროდუქტების მართვა - ${name}`);
        }
      }
      
      const result = await ApiService.getProductsByCategory(categoryId, page, size, sortBy, sortDesc);
      setProducts(result.items);
      setTotalItems(result.totalCount);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products for this category');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleDeleteProducts = async (productIds: number[]) => {
    try {
      // Delete products with the bulk operation
      await ApiService.deleteProducts(productIds);
      
      // Use toast notification for success
      showToast(
        `${productIds.length} პროდუქტი წარმატებით წაიშალა`,
        'success',
        'წარმატებული ოპერაცია'
      );
      
      // Refresh the products list
      if (activeCategory) {
        fetchProductsByCategory(activeCategory, currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc');
      } else {
        fetchProducts(currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc');
      }
    } catch (error) {
      console.error('Error deleting products:', error);
      
      // Show error notification
      showToast(
        error instanceof Error ? error.message : 'პროდუქტების წაშლა ვერ მოხერხდა',
        'error',
        'შეცდომა'
      );
    }
  };

  const handleAddProduct = async (productData: ProductFormData) => {
    try {
      await ApiService.createProduct(productData);
      
      // Use toast notification instead of dialog
      showToast('პროდუქტი წარმატებით დაემატა', 'success', 'წარმატებული ოპერაცია');
      
      // Refresh products list
      if (activeCategory) {
        await fetchProductsByCategory(activeCategory, currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc');
      } else {
        await fetchProducts(currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      
      // Use toast notification for error
      showToast(
        error instanceof Error ? error.message : 'პროდუქტის დამატება ვერ მოხერხდა',
        'error',
        'შეცდომა'
      );
    }
  };
  
  const handleNavigateToMain = () => {
    setActiveCategory(null);
    setCurrentPage(1);
  };

  const handleCategorySelected = async (categoryId: number) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
    setSelectedCategoryName(null); // Will be fetched in the useEffect
  };

  // Add a function to handle sorting
  const handleSort = (sortBy: string, sortDesc: boolean) => {
    setSortConfig({
      key: sortBy,
      direction: sortDesc ? 'desc' : 'asc'
    });
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleEditProduct = async (id: number, productData: any) => {
    try {
      await ApiService.updateProduct(id, productData);
      
      // Only use toast notification, no dialog
      showToast('პროდუქტი წარმატებით განახლდა', 'success', 'წარმატებული ოპერაცია');
      
      // Refresh products list
      if (activeCategory) {
        await fetchProductsByCategory(activeCategory, currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc');
      } else {
        await fetchProducts(currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      
      // Only use toast notification for error, no dialog
      showToast(
        error instanceof Error ? error.message : 'პროდუქტის განახლება ვერ მოხერხდა',
        'error',
        'შეცდომა'
      );
    }
  };

  return (
    <AppContainer>
      <MenuBar 
        onNavigateToMain={handleNavigateToMain} 
        onCategorySelected={handleCategorySelected}
        activeCategory={activeCategory}
      />
      <ContentContainer>
        <h1>{pageTitle}</h1>
        {loading ? (
          <div>პროდუქტების ჩატვირთვა...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>
            Error: {error}
            <button onClick={() => activeCategory ? 
              fetchProductsByCategory(activeCategory, currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc') : 
              fetchProducts(currentPage, pageSize, sortConfig.key, sortConfig.direction === 'desc')
            }>
              ხელახლა ცდა
            </button>
          </div>
        ) : (
          <ProductTable 
            products={products}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onDeleteProducts={handleDeleteProducts}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            activeCategory={activeCategory}
            onSort={handleSort}
            currentSort={sortConfig}
          />
        )}
        
        <Dialog 
          isOpen={dialogState.isOpen}
          title={dialogState.title}
          message={dialogState.message}
          type={dialogState.type}
          onConfirm={dialogState.onConfirm}
          onCancel={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
          confirmText={dialogState.type === 'confirm' ? 'წაშლა' : 'OK'}
        />
      </ContentContainer>
    </AppContainer>
  );
};

export default App;
