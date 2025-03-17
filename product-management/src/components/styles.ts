import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const MenuBar = styled.div`
  width: 280px;
  background: #1e2a3a;
  color: white;
  padding: 1.5rem 1rem;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

export const MenuItemContainer = styled.div`
  margin-bottom: 0.5rem;
`;

export const MenuItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  &:hover {
    background: rgba(52, 152, 219, 0.2);
    border-color: rgba(52, 152, 219, 0.3);
  }
`;

export const MenuItemName = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.2s ease;
  
  ${MenuItemHeader}:hover & {
    color: white;
  }
`;

export const MenuItemActions = styled.div`
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${MenuItemHeader}:hover & {
    opacity: 1;
  }
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 1rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

export const MenuItemContent = styled.div<{ isOpen: boolean }>`
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 1.25rem;
  opacity: ${props => props.isOpen ? '1' : '0'};
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(52, 152, 219, 0.3);
  }
`;

export const DropdownIcon = styled.span<{ isOpen: boolean }>`
  display: inline-block;
  transform: ${props => props.isOpen ? 'rotate(90deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
  margin-right: 0.75rem;
  font-size: 0.7rem;
  color: rgba(52, 152, 219, 0.8);
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PopupOverlay = styled.div`
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

export const PopupContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

export const PopupTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: #2c3e50;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Header = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 8px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  text-align: center;
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

export const ProductCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
`; 