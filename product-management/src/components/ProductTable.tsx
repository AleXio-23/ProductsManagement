import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ApiService } from '../services/api.service';
import { Category, Product } from '../types/api.types';
import Dialog from './Dialog';
import { useToast } from '../contexts/ToastContext';
import { getFullUrl } from '../config/api.config';

interface ProductResultModel {
  id: number;
  categoryId: number;
  code: string;
  name: string;
  price: number;
  countryId?: number;
  countryName?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

interface CategoryNode {
  id: number;
  name: string;
  parentId?: number;
  children?: CategoryNode[];
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  color: #495057;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #6c757d;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
  
  span {
    margin-right: 8px;
    font-size: 14px;
    color: #495057;
  }
  
  select {
    padding: 5px 8px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
`;

const Select = styled.select`
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  
  &:hover {
    border-color: #adb5bd;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 15px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: ${props => props.active ? '#0d6efd' : 'white'};
  color: ${props => props.active ? 'white' : '#212529'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#0d6efd' : '#f8f9fa'};
  }
  
  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: #6c757d;
`;

const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PageNumber = styled(PageButton) <{ active: boolean }>`
  min-width: 32px;
  padding: 6px;
  background-color: ${props => props.active ? '#0d6efd' : 'white'};
  color: ${props => props.active ? 'white' : '#212529'};

  &:hover {
    background-color: ${props => props.active ? '#0d6efd' : '#e9ecef'};
  }
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  &:hover {
    background-color: #c82333;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const TableActions = styled.div`
  display: flex;
  gap: 12px;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  &:hover {
    background-color: #218838;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
`;

const PopupTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 500;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  height: 42px;
  background-color: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  }

  &:hover {
    border-color: #adb5bd;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: white;
  cursor: pointer;
  height: 42px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  }

  &:hover {
    border-color: #adb5bd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 2px solid #f0f0f0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary'; active?: boolean; disabled?: boolean }>`
  padding: ${props => props.variant ? '10px 20px' : '6px 12px'};
  border: ${props => props.variant ? 'none' : '1px solid #dee2e6'};
  border-radius: ${props => props.variant ? '6px' : '4px'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.65 : 1};
  font-weight: ${props => props.variant ? '500' : 'normal'};
  font-size: ${props => props.variant ? '0.95rem' : '0.875rem'};
  transition: all 0.2s ease;

  /* Determine background color based on props */
  background-color: ${props => {
    if (props.variant === 'primary') return '#0d6efd';
    else if (props.variant === 'secondary') return '#6c757d';
    else if (props.active) return '#007bff';
    else return 'white';
  }};
  
  /* Determine text color based on props */
  color: ${props => {
    if (props.variant) return 'white';
    else if (props.active) return 'white';
    else return '#007bff';
  }};
  
  &:hover {
    background-color: ${props => {
    if (props.variant === 'primary') return '#0b5ed7';
    else if (props.variant === 'secondary') return '#5c636a';
    else if (props.active) return '#007bff';
    else return '#e9ecef';
  }};
    color: ${props => {
    if (props.variant) return 'white';
    else if (props.active) return 'white';
    else return '#0056b3';
  }};
    ${props => props.variant ? 'transform: translateY(-1px);' : ''}
  }
  
  &:focus {
    ${props => props.variant ? '' : 'box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); outline: none;'}
  }
  
  &:active {
    ${props => props.variant ? 'transform: translateY(0);' : ''}
  }
`;

// Update the country selector components
const CountrySelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelect = styled.div`
  width: 100%;
  position: relative;
`;

const SelectHeader = styled.div`
  width: 100%;
  height: 42px;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:focus, &:hover {
    border-color: #80bdff;
    outline: none;
  }

  &::after {
    content: '▼';
    font-size: 12px;
    color: #6c757d;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 2px;
`;

const DropdownItem = styled.div<{ selected?: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#e9ecef' : 'white'};
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const AddCountryContainer = styled.div`
  display: flex;
  padding: 8px;
  border-top: 1px solid #dee2e6;
  background-color: #f8f9fa;
`;

const AddCountryInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-right: 8px;
`;

const AddCountryButton = styled.button`
  padding: 8px 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #218838;
  }
`;

interface Country {
  id: number;
  name: string;
  isActive: boolean;
}

interface ProductFormData {
  categoryId: number;
  code: string;
  name: string;
  price: number;
  countryId?: number;
  startDate?: string;
  endDate?: string;
  id?: number;
}

// Add interfaces for sorting
interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDeleteProducts?: (ids: number[]) => void;
  onAddProduct?: (product: ProductFormData) => void;
  onEditProduct?: (id: number, product: ProductFormData) => void;
  activeCategory?: number | null;
  onSort?: (sortBy: string, sortDesc: boolean) => void;
  currentSort?: SortConfig;
}

const countries = [
  { id: 1, name: "საქართველო" },
  { id: 2, name: "აშშ" },
  { id: 3, name: "გერმანია" },
  { id: 4, name: "იაპონია" },
  { id: 5, name: "ჩინეთი" }
];

const StyledOption = styled.option<{ depth: number }>`
  padding-left: ${props => props.depth * 20}px;
`;

const buildCategoryOptions = (categories: Category[], depth = 0, path = ''): React.ReactElement[] => {
  return categories.flatMap(category => {
    const currentPath = path ? `${path} > ${category.name}` : category.name;
    const options = [
      <StyledOption key={category.id} value={category.id} depth={depth}>
        {currentPath}
      </StyledOption>
    ];

    if (category.children && category.children.length > 0) {
      options.push(...buildCategoryOptions(category.children, depth + 1, currentPath));
    }

    return options;
  });
};

// Add helper functions to find category by id and build category path
const findCategoryById = (categories: Category[], id: number): Category | null => {
  for (const category of categories) {
    if (category.id === id) return category;
    if (category.children && category.children.length > 0) {
      const foundInChildren = findCategoryById(category.children, id);
      if (foundInChildren) return foundInChildren;
    }
  }
  return null;
};

const buildCategoryPath = (categories: Category[], id: number): string => {
  const result: string[] = [];

  const buildPath = (cats: Category[], targetId: number, path: string[] = []): boolean => {
    for (const cat of cats) {
      const currentPath = [...path, cat.name];

      if (cat.id === targetId) {
        result.push(...currentPath);
        return true;
      }

      if (cat.children && cat.children.length > 0) {
        const found = buildPath(cat.children, targetId, currentPath);
        if (found) return true;
      }
    }

    return false;
  };

  buildPath(categories, id);
  return result.join(' > ');
};

// Create a styled component for the tooltip
const CategoryCell = styled.div`
  position: relative;
  max-width: 200px;
  
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  
  &:hover span.tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  position: absolute;
  z-index: 10;
  background-color: #212529;
  color: white;
  text-align: center;
  border-radius: 4px;
  padding: 8px 12px;
  bottom: 125%;
  left: 0;
  width: auto;
  max-width: 300px;
  white-space: normal;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s;
  
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 15px;
    border-width: 5px;
    border-style: solid;
    border-color: #212529 transparent transparent transparent;
  }
`;

// Function to format category path for display
const formatCategoryPath = (fullPath: string): React.ReactElement => {
  if (!fullPath) return <span>-</span>;

  const segments = fullPath.split(' > ');

  // If it's a simple path with 0 or 1 ">" character, show it as is
  if (segments.length <= 2) {
    return <span>{fullPath}</span>;
  }

  // For deeper hierarchies, truncate and add tooltip
  const firstCategory = segments[0];
  const lastCategory = segments[segments.length - 1];
  const truncatedPath = `${firstCategory} >... > ${lastCategory}`;

  return (
    <CategoryCell>
      <span>{truncatedPath}</span>
      <Tooltip className="tooltip">{fullPath}</Tooltip>
    </CategoryCell>
  );
};

// Let's create a special version for the Category column
const CategoryTd = styled(Td)`
  max-width: 250px;
`;

// Add a new styled button for the diagram
const DiagramButton = styled.button`
  padding: 8px 16px;
  background-color: #6610f2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  &:hover {
    background-color: #520dc2;
  }
`;

// Update the diagram popup to be wider
const DiagramPopupContent = styled(PopupContent)`
  max-width: 1040px; // 800px + 30% increase
  max-height: 80vh;
  overflow-y: visible; // Change from auto to visible to prevent scrolling the entire popup
`;

const DiagramTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  color: #212529;
`;

// Keep the diagram container scrollable
const DiagramContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: auto; // Ensure vertical scrolling is contained here
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  max-height: 50vh; // Slightly reduce to ensure it fits within popup without causing popup scroll
`;

// Add styles for the selectors in the diagram popup
const DiagramControls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const SelectorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SelectorLabel = styled.label`
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
`;

const DiagramSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: white;
  min-width: 120px;
  cursor: pointer;
  
  &:hover {
    border-color: #adb5bd;
  }
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
  }
`;

// Add calendar-specific styled components
const CalendarTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 100%;
  table-layout: fixed;
`;

// Make the calendar cells and headers wider and improve layout
const CalendarHeader = styled.th`
  padding: 10px 4px;
  text-align: center;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  min-width: 110px; // Wider to fit the full date format
  position: sticky;
  top: 0;
  z-index: 1;
  font-size: 0.75rem;
  white-space: nowrap; // Prevent text from wrapping
  overflow: visible; // Allow text to overflow if needed
  
  width: 80px;

  &:first-child {
    min-width: 300px; // Wider for product names
    width: 150px!important;
    max-width: 300px;
    text-align: left;
    position: sticky;
    left: 0;
    z-index: 2;
    background-color: #f8f9fa;
  }
`;

// Update the CalendarCell styled component to handle hover states
const CalendarCell = styled.td<{ isActive?: boolean; isHovered?: boolean }>`
  padding: 12px 4px;
  text-align: center;
  border: 1px solid #dee2e6;
  background-color: ${props => {
    if (props.isHovered) {
      return props.isActive ? '#a3d7b5' : '#d9dadc'; // Darker version on hover
    }
    return props.isActive ? '#d4edda' : '#f8f9fa'; // Normal colors
  }};
  height: 30px; // Fixed height for all cells
  min-width: 110px; // Match header width
  font-size: 0.75rem; 
  transition: background-color 0.15s ease-in-out;
  
  &:first-child {
    min-width: 300px; // Wider for product names
    width: 100px;
    max-width: 300px;
    text-align: left;
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: white;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// Update the CalendarRow to handle cell hovering correctly
const CalendarRow = styled.tr`
  &:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

// Update sort indicator styles to not affect table layout
const SortIndicator = styled.span<{ direction: 'asc' | 'desc' }>`
  margin-left: 5px;
  display: inline-block;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  
  ${props => props.direction === 'asc' && `
    border-bottom: 5px solid #333;
    border-top: none;
  `}
  
  ${props => props.direction === 'desc' && `
    border-top: 5px solid #333;
    border-bottom: none;
  `}
`;

// Update sortable header component to highlight when sorted
const SortableHeader = styled(Th) <{ sortable?: boolean; isSorted?: boolean }>`
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  user-select: none;
  position: relative;
  padding-right: 25px; /* Space for sort indicator */
  background-color: ${props => props.isSorted ? '#e9ecef' : '#f8f9fa'};
  
  &:hover {
    background-color: ${props => props.sortable ? (props.isSorted ? '#dee2e6' : '#edf2f7') : '#f8f9fa'};
  }
`;

// Add a styled component for cells that can change color when their column is sorted
const SortableTd = styled(Td) <{ isSorted?: boolean }>`
  background-color: ${props => props.isSorted ? '#f1f3f5' : 'inherit'};
`;

// Update the DatePickerInput styled component
const DatePickerInput = styled.input.attrs({ type: 'date' })`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  height: 42px;
  background-color: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
  }

  &:hover {
    border-color: #adb5bd;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

// Update the styling for the pagination info display
const PaginationInfo = styled.div`
  font-size: 14px;
  color: #495057;
  padding: 0 15px;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 8px 15px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);

  span.highlight {
    font-weight: 600;
    color: #2c3e50;
    margin: 0 4px;
  }

  span.total {
    font-weight: 600;
    color: #2c3e50;
    padding-left: 5px;
    padding-right: 5px; 
  }
`;

// Keep the formatDateForInput function for displaying dates in the table
const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Add styled components for filters
const FiltersContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FiltersTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #495057;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FiltersActions = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterButton = styled.button<{ variant?: 'primary' | 'outline' }>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  transition: all 0.2s;
  background-color: ${props => props.variant === 'primary' ? '#0d6efd' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#0d6efd'};
  border: 1px solid ${props => props.variant === 'primary' ? '#0d6efd' : '#dee2e6'};
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#0b5ed7' : '#f8f9fa'};
    border-color: ${props => props.variant === 'primary' ? '#0b5ed7' : '#c1c9d0'};
  }
`;

const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0;
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
  height: 38px;
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const FilterDateInput = styled.input.attrs({ type: 'date' })`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
  height: 38px;
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const PriceRangeContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  
  span {
    color: #6c757d;
    flex-shrink: 0;
  }
  
  ${FilterInput} {
    flex: 1;
  }
`;

const SelectedFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const SelectedFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #e9f2ff;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  color: #0d6efd;
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  font-size: 0.9rem;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #dc3545;
  }
`;

// Add to the component imports
const MultiSelectContainer = styled.div`
  position: relative;
`;

const MultiSelectHeader = styled.div`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  min-height: 38px;
  height: 38px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 5px;
  box-sizing: border-box;
  overflow: hidden;
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MultiSelectOptions = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const MultiSelectOption = styled.div<{ selected: boolean }>`
  padding: 8px 10px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#e9f2ff' : 'white'};
  
  &:hover {
    background-color: ${props => props.selected ? '#d0e3ff' : '#f8f9fa'};
  }
`;

const MultiSelectTag = styled.span`
  background-color: #e9f2ff;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.8rem;
  color: #0d6efd;
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CategoryPath = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
  margin-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FilterToggle = styled.button`
  padding: 8px 16px;
  background-color: #0dcaf0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  
  &:hover {
    background-color: #0bacca;
  }
`;

// Update the date range container to match the price range container
const DateRangeContainer = styled(PriceRangeContainer)`
  ${FilterDateInput} {
    flex: 1;
  }
`;

// Add styled components for the search inputs within dropdowns
const DropdownSearchContainer = styled.div`
  padding: 8px;
  position: sticky;
  top: 0;
  background-color: white;
  border-bottom: 1px solid #dee2e6;
  z-index: 1;
`;

const DropdownSearch = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.85rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onDeleteProducts,
  onAddProduct,
  onEditProduct,
  activeCategory,
  onSort,
  currentSort = { key: 'id', direction: 'desc' }
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [isDiagramPopupOpen, setIsDiagramPopupOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [newCountryName, setNewCountryName] = useState('');
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [diagramProducts, setDiagramProducts] = useState<Product[]>([]);
  const [diagramPage, setDiagramPage] = useState(1);
  const [diagramPageSize, setDiagramPageSize] = useState(10);
  const [diagramTotalItems, setDiagramTotalItems] = useState(0);
  const [diagramLoading, setDiagramLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    categoryId: activeCategory || 0,
    code: '',
    name: '',
    price: 0,
    countryId: undefined,
    startDate: undefined,
    endDate: undefined
  });
  // Add state for delete confirmation dialog
  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    idsToDelete: number[];
  }>({
    isOpen: false,
    idsToDelete: [],
  });

  // Add search state for country and category selectors
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');

  // Filter state
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    minPrice: '',
    maxPrice: '',
    selectedCountries: new Set<number>(),
    startDate: '',
    endDate: '',
    selectedCategories: new Set<number>()
  });
  
  // Multi-select state
  const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  
  // Get the toast functions
  const { showToast } = useToast();

  // Generate array of years (5 years back and 2 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  // Array of months
  const months = [
    { value: 1, label: 'იანვარი' },
    { value: 2, label: 'თებერვალი' },
    { value: 3, label: 'მარტი' },
    { value: 4, label: 'აპრილი' },
    { value: 5, label: 'მაისი' },
    { value: 6, label: 'ივნისი' },
    { value: 7, label: 'ივლისი' },
    { value: 8, label: 'აგვისტო' },
    { value: 9, label: 'სექტემბერი' },
    { value: 10, label: 'ოქტომბერი' },
    { value: 11, label: 'ნოემბერი' },
    { value: 12, label: 'დეკემბერი' }
  ];
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const toggleCountrySelect = () => {
    setIsCountrySelectOpen(prev => !prev);
    if (isCountrySelectOpen) {
      setIsCategorySelectOpen(false);
    } else {
      setCountrySearchTerm(''); // Clear search when opening
    }
  };
  
  const toggleCategorySelect = () => {
    setIsCategorySelectOpen(prev => !prev);
    if (isCategorySelectOpen) {
      setIsCountrySelectOpen(false);
    } else {
      setCategorySearchTerm(''); // Clear search when opening
    }
  };
  
  const toggleCountrySelection = (countryId: number) => {
    setFilters(prev => {
      const newSelected = new Set(prev.selectedCountries);
      if (newSelected.has(countryId)) {
        newSelected.delete(countryId);
      } else {
        newSelected.add(countryId);
      }
      return {
        ...prev,
        selectedCountries: newSelected
      };
    });
  };
  
  const toggleCategorySelection = (categoryId: number) => {
    setFilters(prev => {
      const newSelected = new Set(prev.selectedCategories);
      if (newSelected.has(categoryId)) {
        newSelected.delete(categoryId);
      } else {
        newSelected.add(categoryId);
      }
      return {
        ...prev,
        selectedCategories: newSelected
      };
    });
  };
  
  const clearFilters = () => {
    setFilters({
      code: '',
      name: '',
      minPrice: '',
      maxPrice: '',
      selectedCountries: new Set<number>(),
      startDate: '',
      endDate: '',
      selectedCategories: new Set<number>()
    });
    setCountrySearchTerm('');
    setCategorySearchTerm('');
  };
  
  const applyFilters = () => {
    // TODO: Implement filter logic with API and parent component
    console.log('Applying filters:', filters);
    
    // Here you would typically call the parent's filter function
    // For example: onFilterChange(convertFiltersToApiParams());
  };
  
  // Build a flat list of all categories for the selector
  const flattenCategories = (categories: Category[]): { id: number, name: string, path: string }[] => {
    const result: { id: number, name: string, path: string }[] = [];
    
    const traverse = (cats: Category[], parentPath = '') => {
      cats.forEach(cat => {
        const path = parentPath ? `${parentPath} > ${cat.name}` : cat.name;
        result.push({ id: cat.id, name: cat.name, path });
        
        if (cat.children && cat.children.length > 0) {
          traverse(cat.children, path);
        }
      });
    };
    
    traverse(categories);
    return result;
  };
  
  const flatCategories = flattenCategories(categories);
  
  // Filter countries based on search term
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Filter categories based on search term
  const filteredCategories = flatCategories.filter(category => 
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) || 
    category.path.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );
  
  const getSelectedCountriesNames = () => {
    return Array.from(filters.selectedCountries).map(id => 
      countries.find(c => c.id === id)?.name || ''
    ).filter(name => name);
  };
  
  const getSelectedCategoriesNames = () => {
    return Array.from(filters.selectedCategories).map(id => {
      const cat = flatCategories.find(c => c.id === id);
      return cat ? cat.name : '';
    }).filter(name => name);
  };

  useEffect(() => {
    fetchCategories();
    fetchCountries();
  }, []);

  useEffect(() => {
    // Add click outside listener for country dropdown
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeCategory) {
      setFormData(prevData => ({
        ...prevData,
        categoryId: activeCategory
      }));
    }
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await ApiService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const countriesData = await ApiService.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleAddCountry = async () => {
    if (!newCountryName.trim()) return;

    try {
      setIsAddingCountry(true);
      // Call the API
      try {
        await ApiService.createCountry(newCountryName);
        // Success - refresh countries list
        await fetchCountries();
        showToast('ქვეყანა წარმატებით დაემატა', 'success', 'წარმატებული ოპერაცია');
      } catch (error) {
        // If the error is just a JSON parsing error, the country might still have been added
        if (error instanceof SyntaxError) {
          console.warn('JSON parsing error, but country might have been added successfully');
          // Refresh countries list anyway
          await fetchCountries();
          showToast('ქვეყანა წარმატებით დაემატა', 'success', 'წარმატებული ოპერაცია');
        } else {
          // Real error
          throw error;
        }
      }

      // Clear input and close dropdown
      setNewCountryName('');
      setIsCountryDropdownOpen(false);
    } catch (error) {
      console.error('Error adding country:', error);

      // Use toast notification for error
      showToast(
        error instanceof Error ? error.message : 'ქვეყნის დამატება ვერ მოხერხდა',
        'error',
        'შეცდომა'
      );
    } finally {
      setIsAddingCountry(false);
    }
  };

  // Update the popup title and button text based on mode
  const popupTitle = isEditMode ? 'პროდუქტის რედაქტირება' : 'ახალი პროდუქტი';
  const submitButtonText = isEditMode ? 'განახლება' : 'შენახვა';

  // Function to get days in a month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  // Update the formatCalendarDate function to show full date in dd/mm/yyyy format
  const formatCalendarDate = (year: number, month: number, day: number): string => {
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  };

  // Function to check if a date falls within a product's date range
  const isDateInProductRange = (product: Product, year: number, month: number, day: number): boolean => {
    if (!product.startDate || !product.endDate) return false;

    // Create a date object for the day we're checking (at 00:00)
    const checkDate = new Date(Date.UTC(year, month - 1, day)).setHours(0, 0, 0, 0);

    // Parse the product start and end dates, ensuring they're at 00:00
    const startDate = new Date(product.startDate).setHours(0, 0, 0, 0);
    const endDate = new Date(product.endDate).setHours(0, 0, 0, 0);

    return checkDate >= startDate && checkDate <= endDate;
  };

  // Update the getPaginatedProducts function to use the main pagination
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return products.slice(startIndex, endIndex);
  };

  // Update the calendar rendering function
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const paginatedProducts = getPaginatedProducts();
    
    if (products.length === 0) {
      return <div style={{ padding: '20px', textAlign: 'center' }}>პროდუქტები არ მოიძებნა</div>;
    }

    return (
      <CalendarTable>
        <thead>
          <tr>
            <CalendarHeader>პროდუქტი</CalendarHeader>
            {days.map(day => (
              <CalendarHeader key={day}>
                {formatCalendarDate(selectedYear, selectedMonth, day)}
              </CalendarHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product, rowIndex) => (
            <CalendarRow 
              key={product.id}
              onMouseEnter={() => setHoveredRow(rowIndex)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <CalendarCell>
                {product.name} ({product.code})
              </CalendarCell>
              {days.map(day => {
                const isActive = isDateInProductRange(product, selectedYear, selectedMonth, day);
                return (
                  <CalendarCell
                    key={day}
                    isActive={isActive}
                    isHovered={hoveredRow === rowIndex}
                  />
                );
              })}
            </CalendarRow>
          ))}
        </tbody>
      </CalendarTable>
    );
  };

  // Format date for display in table
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ka-GE');
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return price.toLocaleString('ka-GE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate total pages for main pagination
  const totalPages = Math.ceil(totalItems / pageSize);

  // Handle page size changes for main table
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value);
    onPageSizeChange(newPageSize);
  };

  // Get page numbers for main pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at a time

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open the Add Product form
  const handleAddProductClick = () => {
    setFormData({
      categoryId: activeCategory || 0,
      code: '',
      name: '',
      price: 0,
      countryId: undefined,
      startDate: undefined,
      endDate: undefined
    });
    setIsEditMode(false);
    setEditProductId(null);
    setIsAddPopupOpen(true);
  };

  // Handle double-clicking a product row to edit
  const handleProductDoubleClick = (product: Product) => {
    // Format dates to YYYY-MM-DD format for the date picker
    const formatDateForPicker = (dateString?: string): string => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };

    setFormData({
      categoryId: product.categoryId,
      code: product.code,
      name: product.name,
      price: product.price,
      countryId: product.countryId,
      startDate: formatDateForPicker(product.startDate),
      endDate: formatDateForPicker(product.endDate)
    });
    setIsEditMode(true);
    setEditProductId(product.id);
    setIsAddPopupOpen(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = () => {
    const { idsToDelete } = deleteDialogState;
    
    // Close the dialog first
    setDeleteDialogState({
      isOpen: false,
      idsToDelete: [],
    });
    
    // Clear selected IDs
    setSelectedIds(new Set());
    
    // Call the parent handler
    if (onDeleteProducts && idsToDelete.length > 0) {
      onDeleteProducts(idsToDelete);
    }
  };

  // Update the submit handler to use toast instead of dialog
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.code || !formData.name || formData.price <= 0 || !formData.categoryId) {
        showToast('გთხოვთ შეავსოთ ყველა სავალდებულო ველი', 'warning', 'გაფრთხილება');
        return;
      }

      // Convert price to number to ensure it's the right type
      const productData = {
        ...formData,
        price: Number(formData.price)
      };

      // Close popup
      setIsAddPopupOpen(false);

      // Call the appropriate handler based on mode
      if (isEditMode && editProductId !== null && onEditProduct) {
        // For editing, include the ID in the request body as well
        onEditProduct(editProductId, {
          ...productData,
          id: editProductId
        });
      } else if (onAddProduct) {
        onAddProduct(productData);
      }

      // Reset the form data
      setFormData({
        categoryId: activeCategory || 0,
        code: '',
        name: '',
        price: 0,
        countryId: undefined,
        startDate: undefined,
        endDate: undefined
      });

      // Reset edit state
      setIsEditMode(false);
      setEditProductId(null);

    } catch (error) {
      console.error('Error creating/updating product:', error);

      // Show error toast
      showToast(
        error instanceof Error ? error.message : 'პროდუქტის შექმნა/განახლება ვერ მოხერხდა',
        'error',
        'შეცდომა'
      );
    }
  };

  // Handle delete button click - show confirmation dialog
  const handleDeleteClick = (ids: number[]) => {
    if (ids.length === 0) return;
    
    setDeleteDialogState({
      isOpen: true,
      idsToDelete: ids,
    });
  };

  // Handle cancel deletion
  const handleCancelDelete = () => {
    setDeleteDialogState({
      isOpen: false,
      idsToDelete: [],
    });
  };

  // Restore the handleSort and renderSortIndicator functions
  const handleSort = (key: string) => {
    if (!onSort) return;

    const direction =
      currentSort.key === key && currentSort.direction === 'desc'
        ? 'asc'
        : 'desc';

    onSort(key, direction === 'desc');
  };

  // Function to render sort indicator
  const renderSortIndicator = (key: string) => {
    if (currentSort.key !== key) return null;

    return (
      <SortIndicator
        direction={currentSort.direction}
      />
    );
  };

  // Add function to load diagram products
  const fetchDiagramProducts = async () => {
    try {
      setDiagramLoading(true);
      
      // Get the current filter criteria from ApiService or props
      const filterCriteria = {
        categoryId: activeCategory,
        sortBy: currentSort.key,
        sortByDescendingOrder: currentSort.direction === 'desc'
      };
      
      // Make API call to get products for the diagram with page 1
      let response;
      if (activeCategory) {
        response = await ApiService.getProductsByCategory(
          activeCategory,
          1,
          diagramPageSize,
          filterCriteria.sortBy,
          filterCriteria.sortByDescendingOrder
        );
      } else {
        response = await ApiService.getProducts(
          1,
          diagramPageSize,
          filterCriteria.sortBy,
          filterCriteria.sortByDescendingOrder
        );
      }
      
      // Extract products and total count from the response
      setDiagramProducts(response.items || []);
      setDiagramTotalItems(response.totalCount || 0);
      
      // Reset to first page
      setDiagramPage(1);
    } catch (error) {
      console.error('Error fetching diagram products:', error);
    } finally {
      setDiagramLoading(false);
    }
  };

  // Handle opening the diagram popup
  const handleOpenDiagram = async () => {
    // Load diagram products first, then open the popup
    await fetchDiagramProducts();
    setIsDiagramPopupOpen(true);
  };

  // Add a function for diagram pagination
  const handleDiagramPageChange = async (page: number) => {
    try {
      setDiagramLoading(true);
      setDiagramPage(page);
      
      // Get the current filter criteria
      const filterCriteria = {
        categoryId: activeCategory,
        sortBy: currentSort.key,
        sortByDescendingOrder: currentSort.direction === 'desc'
      };
      
      // Make API call to get products for the diagram with the new page
      let response;
      if (activeCategory) {
        response = await ApiService.getProductsByCategory(
          activeCategory,
          page,
          diagramPageSize,
          filterCriteria.sortBy,
          filterCriteria.sortByDescendingOrder
        );
      } else {
        response = await ApiService.getProducts(
          page,
          diagramPageSize,
          filterCriteria.sortBy,
          filterCriteria.sortByDescendingOrder
        );
      }
      
      // Extract products and total count from the response
      setDiagramProducts(response.items || []);
      setDiagramTotalItems(response.totalCount || 0);
    } catch (error) {
      console.error('Error fetching diagram products:', error);
    } finally {
      setDiagramLoading(false);
    }
  };

  // Add function to handle diagram page size change
  const handleDiagramPageSizeChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value);
    setDiagramPageSize(newPageSize);
    
    // Reset to first page and reload with new page size
    const page = 1;
    setDiagramPage(page);
    
    try {
      setDiagramLoading(true);
      
      // Get the current filter criteria
      const filterCriteria = {
        categoryId: activeCategory,
        sortBy: currentSort.key,
        sortByDescendingOrder: currentSort.direction === 'desc'
      };
      
      // Make API call to get products for the diagram with the new page size
      let response;
      if (activeCategory) {
        response = await ApiService.getProductsByCategory(
          activeCategory,
          page,
          newPageSize,
          filterCriteria.sortBy,
          filterCriteria.sortByDescendingOrder
        );
      } else {
        response = await ApiService.getProducts(
          page,
          newPageSize,
          filterCriteria.sortBy,
          filterCriteria.sortByDescendingOrder
        );
      }
      
      // Extract products and total count from the response
      setDiagramProducts(response.items || []);
      setDiagramTotalItems(response.totalCount || 0);
    } catch (error) {
      console.error('Error fetching diagram products:', error);
    } finally {
      setDiagramLoading(false);
    }
  };

  // Calculate total pages for diagram pagination
  const diagramTotalPages = Math.ceil(diagramTotalItems / diagramPageSize);

  // Get page numbers for diagram pagination
  const getDiagramPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at a time

    let startPage = Math.max(1, diagramPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(diagramTotalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < diagramTotalPages) {
      if (endPage < diagramTotalPages - 1) pageNumbers.push('...');
      pageNumbers.push(diagramTotalPages);
    }

    return pageNumbers;
  };

  // Update the renderDiagramCalendar function to properly handle the diagramProducts array
  const renderDiagramCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    if (diagramLoading) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          მიმდინარეობს მონაცემების ჩატვირთვა...
        </div>
      );
    }
    
    if (diagramProducts.length === 0) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          პროდუქტები არ მოიძებნა
        </div>
      );
    }

    return (
      <CalendarTable>
        <thead>
          <tr>
            <CalendarHeader>პროდუქტი</CalendarHeader>
            {days.map(day => (
              <CalendarHeader key={day}>
                {formatCalendarDate(selectedYear, selectedMonth, day)}
              </CalendarHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {diagramProducts.map((product, rowIndex) => (
            <CalendarRow 
              key={product.id}
              onMouseEnter={() => setHoveredRow(rowIndex)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <CalendarCell>
                {product.name} ({product.code})
              </CalendarCell>
              {days.map(day => {
                const isActive = isDateInProductRange(product, selectedYear, selectedMonth, day);
                return (
                  <CalendarCell
                    key={day}
                    isActive={isActive}
                    isHovered={hoveredRow === rowIndex}
                  />
                );
              })}
            </CalendarRow>
          ))}
        </tbody>
      </CalendarTable>
    );
  };

  return (
    <TableContainer>
      <TableHeader>
        <AddButton onClick={handleAddProductClick}>
          დამატება
        </AddButton>
        <TableActions>
          {selectedIds.size > 0 && (
            <DeleteButton onClick={() => handleDeleteClick(Array.from(selectedIds))}>
              წაშლა ({selectedIds.size})
            </DeleteButton>
          )}
          <DiagramButton onClick={handleOpenDiagram}>
            დიაგრამა
          </DiagramButton>
          <FilterToggle onClick={() => setIsFiltersVisible(!isFiltersVisible)}>
            {isFiltersVisible ? '⬆️ ფილტრი' : '⬇️ ფილტრი'}
          </FilterToggle>
        </TableActions>
      </TableHeader>

      {isFiltersVisible && (
        <FiltersContainer>
          <FiltersHeader>
            <FiltersTitle>
              <span>🔍</span> ფილტრები
            </FiltersTitle>
            <FiltersActions>
              <FilterButton onClick={clearFilters}>გასუფთავება</FilterButton>
              <FilterButton variant="primary" onClick={applyFilters}>გამოყენება</FilterButton>
            </FiltersActions>
          </FiltersHeader>
          
          <FiltersRow>
            <FilterGroup>
              <FilterLabel>კოდი</FilterLabel>
              <FilterInput 
                type="text"
                name="code"
                value={filters.code}
                onChange={handleFilterChange}
                placeholder="ფილტრი კოდით"
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>დასახელება</FilterLabel>
              <FilterInput 
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="ფილტრი დასახელებით"
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>ფასი</FilterLabel>
              <PriceRangeContainer>
                <FilterInput 
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="მინ"
                  min="0"
                />
                <span>-</span>
                <FilterInput 
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="მაქს"
                  min="0"
                />
              </PriceRangeContainer>
            </FilterGroup>
          </FiltersRow>
          
          <FiltersRow>
            <FilterGroup>
              <FilterLabel>ქვეყანა</FilterLabel>
              <MultiSelectContainer>
                <MultiSelectHeader onClick={toggleCountrySelect}>
                  {filters.selectedCountries.size === 0 ? (
                    <span style={{ color: '#6c757d' }}>აირჩიეთ ქვეყანა</span>
                  ) : (
                    getSelectedCountriesNames().map(name => (
                      <MultiSelectTag key={name}>
                        {name}
                        <RemoveFilterButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            const countryId = countries.find(c => c.name === name)?.id;
                            if (countryId) toggleCountrySelection(countryId);
                          }}
                        >
                          ×
                        </RemoveFilterButton>
                      </MultiSelectTag>
                    ))
                  )}
                </MultiSelectHeader>
                
                {isCountrySelectOpen && (
                  <MultiSelectOptions>
                    <DropdownSearchContainer>
                      <DropdownSearch
                        type="text"
                        placeholder="ძებნა..."
                        value={countrySearchTerm}
                        onChange={(e) => setCountrySearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </DropdownSearchContainer>
                    {filteredCountries.map(country => (
                      <MultiSelectOption 
                        key={country.id}
                        selected={filters.selectedCountries.has(country.id)}
                        onClick={() => toggleCountrySelection(country.id)}
                      >
                        {country.name}
                      </MultiSelectOption>
                    ))}
                  </MultiSelectOptions>
                )}
              </MultiSelectContainer>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>თარიღის დიაპაზონი</FilterLabel>
              <DateRangeContainer>
                <FilterDateInput 
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  placeholder="დაწყების თარიღი"
                />
                <span>-</span>
                <FilterDateInput 
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  placeholder="დასრულების თარიღი"
                />
              </DateRangeContainer>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>კატეგორია</FilterLabel>
              <MultiSelectContainer>
                <MultiSelectHeader onClick={toggleCategorySelect}>
                  {filters.selectedCategories.size === 0 ? (
                    <span style={{ color: '#6c757d' }}>აირჩიეთ კატეგორია</span>
                  ) : (
                    getSelectedCategoriesNames().map(name => (
                      <MultiSelectTag key={name}>
                        {name}
                        <RemoveFilterButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            const catId = flatCategories.find(c => c.name === name)?.id;
                            if (catId) toggleCategorySelection(catId);
                          }}
                        >
                          ×
                        </RemoveFilterButton>
                      </MultiSelectTag>
                    ))
                  )}
                </MultiSelectHeader>
                
                {isCategorySelectOpen && (
                  <MultiSelectOptions>
                    <DropdownSearchContainer>
                      <DropdownSearch
                        type="text"
                        placeholder="ძებნა..."
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </DropdownSearchContainer>
                    {filteredCategories.map(category => (
                      <MultiSelectOption 
                        key={category.id}
                        selected={filters.selectedCategories.has(category.id)}
                        onClick={() => toggleCategorySelection(category.id)}
                      >
                        {category.name}
                        <CategoryPath>{category.path.replace(category.name, '')}</CategoryPath>
                      </MultiSelectOption>
                    ))}
                  </MultiSelectOptions>
                )}
              </MultiSelectContainer>
            </FilterGroup>
          </FiltersRow>
        </FiltersContainer>
      )}

      {isAddPopupOpen && (
        <PopupOverlay onClick={() => setIsAddPopupOpen(false)}>
          <PopupContent onClick={e => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>{popupTitle}</PopupTitle>
            </PopupHeader>
            <form onSubmit={e => e.preventDefault()}>
              <FormGroup>
                <Label>კატეგორია</Label>
                <SelectInput
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  style={{ fontFamily: 'inherit' }}
                >
                  <option value={0}>აირჩიეთ კატეგორია</option>
                  {buildCategoryOptions(categories)}
                </SelectInput>
              </FormGroup>
              <FormGroup>
                <Label>კოდი</Label>
                <Input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="შეიყვანეთ კოდი"
                />
              </FormGroup>
              <FormGroup>
                <Label>დასახელება</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="შეიყვანეთ დასახელება"
                />
              </FormGroup>
              <FormGroup>
                <Label>ფასი</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </FormGroup>
              <FormGroup>
                <Label>ქვეყანა</Label>
                <CountrySelectContainer ref={countryDropdownRef}>
                  <CustomSelect>
                    <SelectHeader
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setIsCountryDropdownOpen(!isCountryDropdownOpen);
                        }
                      }}
                    >
                      {formData.countryId
                        ? countries.find((c: Country) => c.id === Number(formData.countryId))?.name
                        : 'აირჩიეთ ქვეყანა'}
                    </SelectHeader>

                    {isCountryDropdownOpen && (
                      <DropdownMenu>
                        <DropdownItem
                          onClick={() => {
                            setFormData(prev => ({ ...prev, countryId: undefined }));
                          }}
                        >
                          აირჩიეთ ქვეყანა
                        </DropdownItem>

                        {countries.map(country => (
                          <DropdownItem
                            key={country.id}
                            selected={Number(formData.countryId) === country.id}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, countryId: country.id }));
                              setIsCountryDropdownOpen(false);
                            }}
                          >
                            {country.name}
                          </DropdownItem>
                        ))}

                        <AddCountryContainer>
                          <AddCountryInput
                            type="text"
                            placeholder="ახალი ქვეყნის სახელი"
                            value={newCountryName}
                            onChange={(e) => setNewCountryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCountry()}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <AddCountryButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddCountry();
                            }}
                            disabled={isAddingCountry || !newCountryName.trim()}
                          >
                            {isAddingCountry ? '...' : 'დამატება'}
                          </AddCountryButton>
                        </AddCountryContainer>
                      </DropdownMenu>
                    )}
                  </CustomSelect>
                </CountrySelectContainer>
              </FormGroup>
              <FormGroup>
                <Label>დაწყების თარიღი</Label>
                <DatePickerInput
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      startDate: e.target.value
                    });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label>დასრულების თარიღი</Label>
                <DatePickerInput
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      endDate: e.target.value
                    });
                  }}
                />
              </FormGroup>
              <ButtonGroup>
                <Button onClick={() => setIsAddPopupOpen(false)}>გაუქმება</Button>
                <Button variant="primary" onClick={handleSubmit}>{submitButtonText}</Button>
              </ButtonGroup>
            </form>
          </PopupContent>
        </PopupOverlay>
      )}

      {/* Update the diagram popup to use diagram-specific data and pagination */}
      {isDiagramPopupOpen && (
        <PopupOverlay onClick={() => setIsDiagramPopupOpen(false)}>
          <DiagramPopupContent onClick={e => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>პროდუქტების დიაგრამა</PopupTitle>
            </PopupHeader>

            <DiagramControls>
              <SelectorGroup>
                <SelectorLabel>წელი</SelectorLabel>
                <DiagramSelect
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </DiagramSelect>
              </SelectorGroup>

              <SelectorGroup>
                <SelectorLabel>თვე</SelectorLabel>
                <DiagramSelect
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </DiagramSelect>
              </SelectorGroup>
            </DiagramControls>

            <DiagramContainer>
              {renderDiagramCalendar()}
            </DiagramContainer>

            {/* Use diagram-specific pagination */}
            <PaginationContainer>
              <PaginationInfo>
                {diagramProducts.length > 0 ? (
                  <>
                    <span className="highlight">{(diagramPage - 1) * diagramPageSize + 1}-{Math.min(diagramPage * diagramPageSize, diagramTotalItems)}</span>
                    <span>გამოჩენილია </span>
                    <span className="total">{diagramTotalItems}</span>
                    <span> ჩანაწერიდან</span>
                  </>
                ) : (
                  <span className="total">0 ჩანაწერი</span>
                )}
              </PaginationInfo>
              <PaginationControls>
                <Button
                  onClick={() => handleDiagramPageChange(1)}
                  disabled={diagramPage === 1 || diagramLoading}
                >
                  &laquo;
                </Button>
                <Button
                  onClick={() => handleDiagramPageChange(diagramPage - 1)}
                  disabled={diagramPage === 1 || diagramLoading}
                >
                  &lsaquo;
                </Button>
                {getDiagramPageNumbers().map((page, index) => (
                  <PageButton
                    key={index}
                    active={page === diagramPage}
                    onClick={() => typeof page === 'number' ? handleDiagramPageChange(page) : null}
                    disabled={typeof page !== 'number' || diagramLoading}
                  >
                    {page}
                  </PageButton>
                ))}
                <Button
                  onClick={() => handleDiagramPageChange(diagramPage + 1)}
                  disabled={diagramPage === diagramTotalPages || diagramLoading}
                >
                  &rsaquo;
                </Button>
                <Button
                  onClick={() => handleDiagramPageChange(diagramTotalPages)}
                  disabled={diagramPage === diagramTotalPages || diagramLoading}
                >
                  &raquo;
                </Button>
                <PageSizeSelector>
                  <span>გვერდზე:</span>
                  <select
                    value={diagramPageSize}
                    onChange={handleDiagramPageSizeChange}
                    disabled={diagramLoading}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="30">30</option>
                  </select>
                </PageSizeSelector>
              </PaginationControls>
            </PaginationContainer>

            <ButtonGroup>
              <Button onClick={() => setIsDiagramPopupOpen(false)}>დახურვა</Button>
            </ButtonGroup>
          </DiagramPopupContent>
        </PopupOverlay>
      )}

      <Table>
        <thead>
          <tr>
            <Th style={{ width: '40px' }}>
              <Checkbox
                checked={products.length > 0 && products.every(product => selectedIds.has(product.id))}
                onChange={(e) => {
                  if (e.target.checked) {
                    const newIds = new Set(selectedIds);
                    products.forEach(p => newIds.add(p.id));
                    setSelectedIds(newIds);
                  } else {
                    const newIds = new Set(selectedIds);
                    products.forEach(p => newIds.delete(p.id));
                    setSelectedIds(newIds);
                  }
                }}
              />
            </Th>
            <SortableHeader
              sortable
              isSorted={currentSort.key === 'code'}
              onClick={() => handleSort('code')}
            >
              კოდი {renderSortIndicator('code')}
            </SortableHeader>
            <SortableHeader
              sortable
              isSorted={currentSort.key === 'name'}
              onClick={() => handleSort('name')}
            >
              დასახელება {renderSortIndicator('name')}
            </SortableHeader>
            <SortableHeader
              sortable
              isSorted={currentSort.key === 'price'}
              onClick={() => handleSort('price')}
            >
              ფასი {renderSortIndicator('price')}
            </SortableHeader>
            <SortableHeader
              sortable
              isSorted={currentSort.key === 'country'}
              onClick={() => handleSort('country')}
            >
              ქვეყანა {renderSortIndicator('country')}
            </SortableHeader>
            <SortableHeader
              sortable
              isSorted={currentSort.key === 'period'}
              onClick={() => handleSort('period')}
            >
              პერიოდი {renderSortIndicator('period')}
            </SortableHeader>
            <Th>კატეგორია</Th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <EmptyMessage>მონაცემები არ მოიძებნა</EmptyMessage>
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <Tr
                key={product.id}
                onDoubleClick={() => handleProductDoubleClick(product)}
              >
                <Td style={{ width: '40px' }}>
                  <Checkbox
                    checked={selectedIds.has(product.id)}
                    onChange={(e) => {
                      const newIds = new Set(selectedIds);
                      if (e.target.checked) {
                        newIds.add(product.id);
                      } else {
                        newIds.delete(product.id);
                      }
                      setSelectedIds(newIds);
                    }}
                  />
                </Td>
                <SortableTd isSorted={currentSort.key === 'code'}>{product.code}</SortableTd>
                <SortableTd isSorted={currentSort.key === 'name'}>{product.name}</SortableTd>
                <SortableTd isSorted={currentSort.key === 'price'}>{formatPrice(product.price)}</SortableTd>
                <SortableTd isSorted={currentSort.key === 'country'}>{product.countryName || '-'}</SortableTd>
                <SortableTd isSorted={currentSort.key === 'period'}>
                  {product.startDate || product.endDate
                    ? `${formatDate(product.startDate)} - ${formatDate(product.endDate)}`
                    : '-'}
                </SortableTd>
                <CategoryTd>
                  {formatCategoryPath(buildCategoryPath(categories, product.categoryId))}
                </CategoryTd>
              </Tr>
            ))
          )}
        </tbody>
      </Table>
      <PaginationContainer>
        <PaginationInfo>
          {products.length > 0 ? (
            <>
              <span className="highlight">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)}</span>
              <span>გამოჩენილია </span>
              <span className="total">{totalItems}</span>
              <span> ჩანაწერიდან</span>
            </>
          ) : (
            <span className="total">0 ჩანაწერი</span>
          )}
        </PaginationInfo>
        <PaginationControls>
          <Button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </Button>
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </Button>
          {getPageNumbers().map((page, index) => (
            <PageButton
              key={index}
              active={page === currentPage}
              onClick={() => typeof page === 'number' ? onPageChange(page) : null}
              disabled={typeof page !== 'number'}
            >
              {page}
            </PageButton>
          ))}
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </Button>
          <Button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </Button>
          <PageSizeSelector>
            <span>გვერდზე:</span>
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="30">30</option>
            </select>
          </PageSizeSelector>
        </PaginationControls>
      </PaginationContainer>
      
      {/* Delete confirmation dialog */}
      <Dialog
        isOpen={deleteDialogState.isOpen}
        title="პროდუქტების წაშლა"
        message={`ნამდვილად გსურთ ${deleteDialogState.idsToDelete.length} პროდუქტის წაშლა?`}
        type="confirm"
        confirmText="წაშლა"
        cancelText="გაუქმება"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </TableContainer>
  );
};

export default ProductTable; 