import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Order } from '../types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface OrderStats {
  total: number;
  paid: number;
  pending: number;
  totalRevenue: number;
}

const AdminPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/orders`),
        axios.get(`${API_URL}/orders/stats/summary`)
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await axios.patch(`${API_URL}/orders/${orderId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Проверяем, можно ли удалить заказ
    if (order.status !== 'pending' && order.status !== 'cancelled') {
      setError('Можно удалять только неоплаченные или отмененные заказы');
      return;
    }

    if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/orders/${orderId}`);

      if (response.data.success) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
        // Обновляем статистику
        loadData();
      }
    } catch (err: any) {
      console.error('Delete order error:', err);
      setError(err.response?.data?.error || 'Ошибка удаления заказа');
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

  const filteredOrders = orders.filter(order => {
    if (tabValue === 0) return true; // Все
    if (tabValue === 1) return order.status === 'pending'; // Ожидают
    if (tabValue === 2) return order.status === 'paid' || order.status === 'processing'; // В работе
    if (tabValue === 3) return order.status === 'delivered'; // Завершенные
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Панель администратора
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadData}
        >
          Обновить
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Статистика */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ShoppingBagIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Всего заказов
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.paid}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Оплачено
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PendingIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ожидают
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.totalRevenue.toLocaleString('ru-RU')} ₽
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Выручка
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Фильтры */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label={`Все (${orders.length})`} />
          <Tab label={`Ожидают (${orders.filter(o => o.status === 'pending').length})`} />
          <Tab label={`В работе (${orders.filter(o => o.status === 'paid' || o.status === 'processing').length})`} />
          <Tab label={`Завершенные (${orders.filter(o => o.status === 'delivered').length})`} />
        </Tabs>
      </Paper>

      {/* Таблица заказов */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID заказа</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell>Товары</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    Заказов нет
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {order.id.slice(0, 8)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    {order.userName || `ID: ${order.userId}`}
                  </TableCell>
                  <TableCell>
                    {order.items.length} шт.
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {order.finalTotal.toLocaleString('ru-RU')} ₽
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <Select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      >
                        <MenuItem value="pending">Ожидает оплаты</MenuItem>
                        <MenuItem value="paid">Оплачен</MenuItem>
                        <MenuItem value="processing">В обработке</MenuItem>
                        <MenuItem value="shipped">Отправлен</MenuItem>
                        <MenuItem value="delivered">Доставлен</MenuItem>
                        <MenuItem value="cancelled">Отменен</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedOrder(order)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {(order.status === 'pending' || order.status === 'cancelled') && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteOrder(order.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог деталей заказа */}
      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Заказ #{selectedOrder.id.slice(0, 8)}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Дата создания
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Статус
                  </Typography>
                  <Chip
                    label={getStatusLabel(selectedOrder.status)}
                    color={getStatusColor(selectedOrder.status)}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Пользователь
                  </Typography>
                  <Typography variant="body1">
                    {selectedOrder.userName || `ID: ${selectedOrder.userId}`}
                  </Typography>
                </Grid>

                {selectedOrder.phone && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Телефон
                    </Typography>
                    <Typography variant="body1">{selectedOrder.phone}</Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Товары
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Название</TableCell>
                          <TableCell align="right">Цена</TableCell>
                          <TableCell align="right">Кол-во</TableCell>
                          <TableCell align="right">Сумма</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">
                              {item.price.toLocaleString('ru-RU')} ₽
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <strong>Доставка:</strong>
                          </TableCell>
                          <TableCell align="right">
                            {selectedOrder.deliveryPrice.toLocaleString('ru-RU')} ₽
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <strong>Итого:</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>{selectedOrder.finalTotal.toLocaleString('ru-RU')} ₽</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {selectedOrder.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Примечания
                    </Typography>
                    <Typography variant="body1">{selectedOrder.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'cancelled') && (
                <Button
                  onClick={() => {
                    handleDeleteOrder(selectedOrder.id);
                  }}
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Удалить
                </Button>
              )}
              <Button onClick={() => setSelectedOrder(null)}>Закрыть</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
