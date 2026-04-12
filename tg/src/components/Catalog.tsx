import React from 'react';
import type { Product } from '../types'; // Тип-импорт
import { Grid, Typography, Box, Chip } from '@mui/material';
import ProductCard from './ProductCard';

interface CatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const Catalog: React.FC<CatalogProps> = ({ products, onAddToCart }) => {
  const categories = Array.from(new Set(products.map(p => p.category)));
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Каталог товаров ({products.length})
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label="Все"
          onClick={() => setSelectedCategory(null)}
          color={selectedCategory === null ? "primary" : "default"}
          variant={selectedCategory === null ? "filled" : "outlined"}
        />
        {categories.map(category => (
          <Chip
            key={category}
            label={category}
            onClick={() => setSelectedCategory(category)}
            color={selectedCategory === category ? "primary" : "default"}
            variant={selectedCategory === category ? "filled" : "outlined"}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard 
              product={product} 
              onAddToCart={onAddToCart}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Catalog;