import React from 'react';
import type { Product } from '../types'; // Тип-импорт
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardMedia
        component="img"
        height="500"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {product.name}
          </Typography>
          <Chip 
            label={product.category} 
            size="small" 
            color="secondary" 
            variant="outlined"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
          {product.price.toLocaleString('ru-RU')} ₽
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onAddToCart(product)}
          sx={{ borderRadius: 8 }}
        >
          В корзину
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;