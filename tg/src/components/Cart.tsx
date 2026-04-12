import React from 'react';
import type { CartItem } from '../types';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Paper,
  Chip,
  Stack,
  Alert,
  Collapse,
  CardMedia,
  Fade
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DiscountIcon from '@mui/icons-material/Discount';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmptyCartIcon from '@mui/icons-material/ShoppingCartOutlined';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
  onBackToCatalog?: () => void;
  totalPrice: number;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onBackToCatalog,
  totalPrice
}) => {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryPrice = totalPrice > 3000 ? 0 : 299;
  const finalPrice = totalPrice + deliveryPrice;
  const hasFreeDelivery = totalPrice > 3000;

  if (items.length === 0) {
    return (
      <Fade in={true}>
        <Box sx={{ 
          textAlign: 'center', 
          py: 10,
          px: 2
        }}>
          <EmptyCartIcon sx={{ 
            fontSize: 80, 
            color: 'text.disabled',
            mb: 2,
            opacity: 0.5
          }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Корзина пуста
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 300, mx: 'auto' }}>
            Добавьте товары из каталога, чтобы сделать заказ
          </Typography>
          {onBackToCatalog && (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={onBackToCatalog}
              sx={{ borderRadius: 2 }}
            >
              Вернуться в каталог
            </Button>
          )}
        </Box>
      </Fade>
    );
  }

  return (
    <Box sx={{ pb: 2 }}>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        {onBackToCatalog && (
          <IconButton onClick={onBackToCatalog} size="small">
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Корзина
        </Typography>
        <Chip 
          label={`${totalItems} ${totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}`}
          color="primary" 
          size="small"
        />
      </Box>

      {/* Список товаров */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <List disablePadding>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem 
                alignItems="flex-start"
                sx={{ 
                  py: 2,
                  px: 2.5,
                  bgcolor: index % 2 === 0 ? 'transparent' : 'action.hover'
                }}
              >
                {/* Изображение товара */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{ 
                      width: 70, 
                      height: 70, 
                      borderRadius: 1.5,
                      objectFit: 'cover'
                    }}
                  />
                  <Chip
                    label={item.quantity}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      minWidth: 24,
                      height: 24,
                      fontWeight: 700,
                      bgcolor: 'primary.main',
                      color: 'white'
                    }}
                  />
                </Box>

                {/* Информация о товаре */}
                <Box sx={{ flex: 1, ml: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {item.category}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.price.toLocaleString('ru-RU')} ₽ × {item.quantity}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                    </Typography>
                  </Stack>

                  {/* Управление количеством */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      sx={{ 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        width: 30,
                        height: 30
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    
                    <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
                      {item.quantity}
                    </Typography>
                    
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      sx={{ 
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        width: 30,
                        height: 30
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>

                {/* Кнопка удаления */}
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => onRemove(item.id)}
                    sx={{ 
                      color: 'error.main',
                      '&:hover': { bgcolor: 'error.lighter' }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              {index < items.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Баннер бесплатной доставки */}
      <Collapse in={!hasFreeDelivery && totalPrice > 0}>
        <Alert 
          severity="info" 
          icon={<DiscountIcon />}
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            bgcolor: 'info.lighter',
            border: '1px solid',
            borderColor: 'info.light'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Добавьте товаров на {(3000 - totalPrice).toLocaleString('ru-RU')} ₽ и получите бесплатную доставку!
          </Typography>
        </Alert>
      </Collapse>

      {/* Итоговая стоимость */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          mb: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Итого
        </Typography>
        
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" color="text.secondary">
              Товары ({totalItems})
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {totalPrice.toLocaleString('ru-RU')} ₽
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon fontSize="small" />
              <Typography variant="body1" color="text.secondary">
                Доставка
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {hasFreeDelivery ? (
                <>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textDecoration: 'line-through',
                      color: 'text.disabled'
                    }}
                  >
                    299 ₽
                  </Typography>
                  <Typography variant="body1" color="success.main" sx={{ fontWeight: 600 }}>
                    Бесплатно
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  299 ₽
                </Typography>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">К оплате</Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
              {finalPrice.toLocaleString('ru-RU')} ₽
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Информация о безопасности */}
      <Alert 
        icon={<SecurityIcon />}
        severity="success"
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          bgcolor: 'success.lighter',
          border: '1px solid',
          borderColor: 'success.light'
        }}
      >
        <Typography variant="body2">
          Ваши данные защищены. Оплата проходит через безопасные платежные системы.
        </Typography>
      </Alert>

      {/* Кнопка оформления заказа */}
      <Box sx={{ position: 'sticky', bottom: 20, zIndex: 1 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<ShoppingCartCheckoutIcon />}
          onClick={onCheckout}
          sx={{ 
            py: 1.8,
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.2s'
          }}
        >
          Перейти к оформлению
        </Button>
        
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            mt: 1, 
            display: 'block', 
            textAlign: 'center',
            opacity: 0.7
          }}
        >
          Нажатие кнопки не списывает средства
        </Typography>
      </Box>
    </Box>
  );
};

export default Cart;