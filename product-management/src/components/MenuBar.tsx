import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api.service';
import styled from 'styled-components';
import { Category } from '../types/api.types';

// Create additional styled components here for the updated design
const MenuBarContainer = styled.div`
  width: 250px;
  background: #1e2a3a;
  color: white;
  padding: 1rem 0.75rem;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }
`;

// Improved button styles
const MainButton = styled.button`
  width: 100%;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.7rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &:hover {
    background-color: #2980b9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }
`;

const AddButton = styled(MainButton)`
  background-color: #27ae60;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #219653;
  }
`;

// Better menu item styling with active state support
const MenuItemContainer = styled.div`
  margin-bottom: 0.5rem;
  border-radius: 6px;
  overflow: hidden;
`;

const MenuItemHeader = styled.div<{ isActive?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.6rem;
  background: ${props => props.isActive 
    ? 'rgba(52, 152, 219, 0.2)' 
    : 'rgba(255, 255, 255, 0.03)'};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 2px solid ${props => props.isActive 
    ? '#3498db' 
    : 'transparent'};
  
  &:hover {
    background: ${props => props.isActive 
      ? 'rgba(52, 152, 219, 0.25)' 
      : 'rgba(255, 255, 255, 0.07)'};
  }
`;

const MenuItemName = styled.span<{ isActive?: boolean }>`
  font-size: 0.8rem;
  font-weight: ${props => props.isActive ? '500' : '400'};
  color: ${props => props.isActive ? 'white' : 'rgba(255, 255, 255, 0.85)'};
  transition: color 0.2s ease;
  position: relative;
  cursor: pointer;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  
  ${MenuItemHeader}:hover & {
    color: white;
  }
`;

// Better menu item actions visibility
const MenuItemActions = styled.div`
  display: flex;
  gap: 0.3rem;
  opacity: 0.4;
  transition: all 0.2s ease;
  
  ${MenuItemHeader}:hover & {
    opacity: 1;
  }
`;

// Better looking buttons for menu actions
const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.15s ease;
  padding: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
  }
`;

// Improved dropdown styles for child items
const MenuItemContent = styled.div<{ isOpen: boolean }>`
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 0.9rem;
  opacity: ${props => props.isOpen ? '1' : '0'};
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

// Modernized dropdown icon
const DropdownIcon = styled.span<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(90deg)' : 'rotate(0)'};
  font-size: 0.65rem;
`;

// Improved popup styling
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

const PopupContent = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const PopupTitle = styled.h2`
  margin-bottom: 1.25rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.primary ? '#3498db' : '#f1f2f6'};
  color: ${props => props.primary ? 'white' : '#4a4a4a'};
  border: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: ${props => props.primary ? '#2980b9' : '#e2e2e2'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface MenuPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  title: string;
}

const MenuPopup: React.FC<MenuPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialName = '',
  title,
}) => {
  const [name, setName] = useState(initialName);
  
  // Update name when initialName changes
  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  if (!isOpen) return null;

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <PopupTitle>{title}</PopupTitle>
        <FormGroup>
          <Label>სახელი</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="შეიყვანეთ მენიუს სახელი"
            autoFocus
          />
        </FormGroup>
        <ButtonGroup>
          <Button onClick={onClose}>გაუქმება</Button>
          <Button primary onClick={() => onSubmit(name)}>შენახვა</Button>
        </ButtonGroup>
      </PopupContent>
    </PopupOverlay>
  );
};

// State for tracking the active category
interface MenuBarProps {
  onNavigateToMain?: () => void;
  onCategorySelected?: (categoryId: number) => void;
  activeCategory?: number | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ 
  onNavigateToMain, 
  onCategorySelected,
  activeCategory = null 
}) => {
  const [menuItems, setMenuItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [localActiveCategory, setLocalActiveCategory] = useState<number | null>(activeCategory);

  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    type: 'add' | 'edit' | 'addChild';
    parentId?: number;
    itemId?: number;
    title: string;
    initialName?: string;
  }>({
    isOpen: false,
    type: 'add',
    title: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setLocalActiveCategory(activeCategory);
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await ApiService.getCategories();
      console.log('Fetched categories:', categories);
      
      if (!Array.isArray(categories)) {
        throw new Error('Categories data is not an array');
      }
      
      if (categories.length === 0) {
        console.log('No categories found');
      }
      
      // Apply expanded states to the new categories
      const updatedCategories = applyExpandedStates(categories);
      setMenuItems(updatedCategories);
    } catch (err) {
      console.error('Error in fetchCategories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const applyExpandedStates = (categories: Category[]): Category[] => {
    return categories.map(category => ({
      ...category,
      isOpen: expandedIds.has(category.id),
      children: applyExpandedStates(category.children)
    }));
  };

  const handleMainPageClick = () => {
    setLocalActiveCategory(null);
    if (onNavigateToMain) {
      onNavigateToMain();
    }
  };

  const handleAddMenuItem = () => {
    setPopupState({
      isOpen: true,
      type: 'add',
      title: 'მენიუს დამატება',
    });
  };

  const handleEditMenuItem = (itemId: number, name: string) => {
    setPopupState({
      isOpen: true,
      type: 'edit',
      itemId,
      title: 'მენიუს რედაქტირება',
      initialName: name
    });
  };

  const handleAddChild = (parentId: number) => {
    setPopupState({
      isOpen: true,
      type: 'addChild',
      parentId,
      title: 'ქვე-მენიუს დამატება',
    });
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    try {
      await ApiService.deleteCategory(itemId);
      
      // Find the parent of the deleted item before deletion
      const findParent = (items: Category[], targetId: number): Category | null => {
        for (const item of items) {
          if (item.children.some(child => child.id === targetId)) return item;
          const found = findParent(item.children, targetId);
          if (found) return found;
        }
        return null;
      };

      const parent = findParent(menuItems, itemId);
      
      // Remove the ID from expanded set if it was expanded
      setExpandedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        // If parent exists and still has other children, keep it expanded
        if (parent && parent.children.length > 1) {
          newSet.add(parent.id);
        }
        return newSet;
      });
      
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  const toggleMenuItem = (itemId: number) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });

    setMenuItems(prev => toggleMenuItemOpen(prev, itemId));
  };

  const toggleMenuItemOpen = (items: Category[], itemId: number): Category[] => {
    return items.map((item) => {
      if (item.id === itemId) {
        return { ...item, isOpen: !item.isOpen };
      }
      if (item.children.length > 0) {
        return {
          ...item,
          children: toggleMenuItemOpen(item.children, itemId),
        };
      }
      return item;
    });
  };

  const findMenuItem = (items: Category[], id: number): Category | null => {
    for (const item of items) {
      if (item.id === id) return item;
      const found = findMenuItem(item.children, id);
      if (found) return found;
    }
    return null;
  };

  const removeMenuItem = (items: Category[], id: number): Category[] => {
    return items.filter((item) => {
      if (item.id === id) return false;
      item.children = removeMenuItem(item.children, id);
      return true;
    });
  };

  const handlePopupSubmit = async (name: string) => {
    if (!name.trim()) return;

    try {
      switch (popupState.type) {
        case 'add':
          await ApiService.createCategory(name, null);
          await fetchCategories();
          break;
        case 'addChild':
          if (popupState.parentId) {
            await ApiService.createCategory(name, popupState.parentId);
            
            // Always expand parent when adding a child
            setExpandedIds(prev => {
              const newSet = new Set(prev);
              newSet.add(popupState.parentId!);
              return newSet;
            });
            
            await fetchCategories();
          }
          break;
        case 'edit':
          if (popupState.itemId) {
            await ApiService.updateCategory(popupState.itemId, name);
            await fetchCategories();
          }
          break;
      }

      setPopupState({ isOpen: false, type: 'add', title: '' });
    } catch (error) {
      console.error('Error handling popup submit:', error);
      alert(error instanceof Error ? error.message : 'Failed to perform the operation');
    }
  };

  // Update the category selection handler
  const handleCategoryClick = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation();
    setLocalActiveCategory(itemId);
    if (onCategorySelected) {
      onCategorySelected(itemId);
    }
  };

  // Update renderMenuItem to include active state
  const renderMenuItem = (item: Category) => (
    <MenuItemContainer key={item.id}>
      <MenuItemHeader 
        onClick={() => toggleMenuItem(item.id)}
        isActive={localActiveCategory === item.id}
      >
        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          {item.children.length > 0 && (
            <DropdownIcon isOpen={Boolean(item.isOpen)}>▶</DropdownIcon>
          )}
          <MenuItemName 
            onClick={(e) => handleCategoryClick(e, item.id)}
            isActive={localActiveCategory === item.id}
            title={item.name}
          >
            {item.name}
          </MenuItemName>
        </div>
        <MenuItemActions>
          <MenuButton 
            onClick={(e) => {
              e.stopPropagation();
              handleAddChild(item.id);
            }}
            title="დამატება"
          >
            <span style={{ fontSize: '0.8rem' }}>+</span>
          </MenuButton>
          <MenuButton 
            onClick={(e) => {
              e.stopPropagation();
              handleEditMenuItem(item.id, item.name);
            }}
            title="რედაქტირება"
          >
            <span style={{ fontSize: '0.75rem' }}>✎</span>
          </MenuButton>
          <MenuButton 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteMenuItem(item.id);
            }}
            title="წაშლა"
          >
            <span style={{ fontSize: '0.75rem' }}>×</span>
          </MenuButton>
        </MenuItemActions>
      </MenuItemHeader>
      {item.children.length > 0 && (
        <MenuItemContent isOpen={Boolean(item.isOpen)}>
          {item.children.map(renderMenuItem)}
        </MenuItemContent>
      )}
    </MenuItemContainer>
  );

  if (loading) {
    return (
      <MenuBarContainer>
        <div>ჩატვირთვა...</div>
      </MenuBarContainer>
    );
  }

  if (error) {
    return (
      <MenuBarContainer>
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
        <Button primary onClick={fetchCategories}>ხელახლა ცდა</Button>
      </MenuBarContainer>
    );
  }

  return (
    <MenuBarContainer>
      {/* Main Page Button */}
      <MainButton onClick={handleMainPageClick}>
        <i style={{ fontSize: '1.2rem' }}>🏠</i> მთავარი გვერდი
      </MainButton>
      
      {/* Add Menu Item Button */}
      <AddButton onClick={handleAddMenuItem}>
        <i style={{ fontSize: '1.2rem' }}>+</i> მენიუს დამატება
      </AddButton>
      
      {menuItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'rgba(255, 255, 255, 0.6)' }}>
          მენიუს ელემენტები არ მოიძებნა
        </div>
      ) : (
        menuItems.map(renderMenuItem)
      )}
      
      <MenuPopup
        isOpen={popupState.isOpen}
        onClose={() => setPopupState({ isOpen: false, type: 'add', title: '' })}
        onSubmit={handlePopupSubmit}
        title={popupState.title}
        initialName={popupState.initialName}
      />
    </MenuBarContainer>
  );
};

export default MenuBar; 