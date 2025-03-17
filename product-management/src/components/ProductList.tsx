import React, { useState } from 'react';
import {
  Container,
  Header,
  Title,
  ProductGrid,
  ProductCard,
  Button,
  Input,
} from './styles';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Product 1',
      price: 99.99,
      description: 'This is a sample product description.',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 149.99,
      description: 'Another sample product description.',
    },
  ]);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.description) {
      setProducts([
        ...products,
        {
          id: products.length + 1,
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
        },
      ]);
      setNewProduct({ name: '', price: 0, description: '' });
    }
  };

  return (
    <Container>
      <Header>
        <Title>Product Management</Title>
      </Header>

      <div style={{ marginBottom: '2rem' }}>
        <Input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
        />
        <Input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <Button onClick={handleAddProduct}>Add Product</Button>
      </div>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <p>{product.description}</p>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  );
};

export default ProductList; 