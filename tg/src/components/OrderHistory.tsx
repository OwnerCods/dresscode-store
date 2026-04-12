import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import type { Order } from '../types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface OrderHistoryProps {
  userId: number;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/orders/user/${userId}`);

      if (response.data.success) {
        setOrders(response.data.orders.sort((a: Order, b: Order) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors: Record<Order['status'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
      pending: 'warning',
      paid: 'success',
      processing: 'primary',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels: Record<Order['status'], string> = {
      pending: 'Ожидает оплаты',
      paid: 'Оплачен',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          У вас пока нет заказов
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Оформите первый заказ в каталоге
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        История заказов
      </Typography>

      <List sx={{ p: 0 }}>
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <Paper
              elevation={0}
              sx={{
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  p: 2.5
                }}
              >
                {/* Заголовок заказа */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Заказ от {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                      #{order.id.slice(0, 8)}
                    </Typography>
                  </Box>
                  <Chip
                    label={getStatusLabel(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </Box>

                {/* Краткая информация */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Товаров
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} шт.
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Сумма
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {order.finalTotal.toLocaleString('ru-RU')} ₽
                    </Typography>
                  </Grid>
                </Grid>

                {/* Кнопка раскрытия */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    {expandedOrder === order.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                {/* Детали заказа */}
                <Collapse in={expandedOrder === order.id}>
                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Состав заказа:
                  </Typography>

                  {order.items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                        p: 1.5,
                        bgcolor: 'action.hover',
                        borderRadius: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 8,
                            objectFit: 'cover'
                          }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.price.toLocaleString('ru-RU')} ₽ × {item.quantity}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Товары
                    </Typography>
                    <Typography variant="body2">
                      {order.total.toLocaleString('ru-RU')} ₽
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Доставка
                    </Typography>
                    <Typography variant="body2">
                      {order.deliveryPrice === 0 ? 'Бесплатно' : `${order.deliveryPrice.toLocaleString('ru-RU')} ₽`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Итого
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {order.finalTotal.toLocaleString('ru-RU')} ₽
                    </Typography>
                  </Box>

                  {order.notes && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Примечания:
                      </Typography>
                      <Typography variant="body2">{order.notes}</Typography>
                    </Box>
                  )}
                </Collapse>
              </ListItem>
            </Paper>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default OrderHistory;
