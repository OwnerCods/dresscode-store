import { useState, useEffect } from 'react';
import type { Product, CartItem, TelegramUser } from './types/index';
import axios from 'axios';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  ThemeProvider,
  createTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import AdminPanel from './components/AdminPanel';
import PaymentModal from './components/PaymentModal';
import tshirtImg from './assets/images/tshirt.jpg';
import tshirtImg1 from './assets/images/tshirt1.jpg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const theme = createTheme({
  palette: {
    primary: { main: '#0088cc' },
    secondary: { main: '#34b7f1' },
  },
  shape: { borderRadius: 12 },
});

// Объявление глобального типа для Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        expand: () => void;
        enableClosingConfirmation: () => void;
        initDataUnsafe?: {
          user?: TelegramUser;
        };
        initData?: string;
        sendData: (data: string) => void;
        close: () => void;
        ready: () => void;
        showAlert: (message: string, callback?: () => void) => void;
        MainButton: {
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
        };
      };
    };
  }
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Джинсы Premium',
    description: 'Хлопок 100%, премиум качество',
    price: 1990,
    image: tshirtImg1,
    category: 'Одежда'
  },
  {
    id: 2,
    name: 'Кепка Dress Code',
    description: 'Стильная кепка с логотипом',
    price: 890,
    image: tshirtImg,
    category: 'Аксессуары'
  },
  {
    id: 3,
    name: 'Худи с принтом',
    description: 'Теплый худи, идеален для прохладной погоды',
    price: 750,
    image: tshirtImg1,
    category: 'Сувениры'
  },
  {
    id: 4,
    name: 'Стикерпак Gold',
    description: 'Набор эксклюзивных стикеров',
    price: 299,
    image: tshirtImg,
    category: 'Цифровое'
  },
  {
    id: 5,
    name: 'Рюкзак Urban',
    description: 'Вместительный городской рюкзак',
    price: 3490,
    image: tshirtImg1,
    category: 'Аксессуары'
  },
  {
    id: 6,
    name: 'Куртка Limited',
    description: 'Теплая куртка, ограниченная серия',
    price: 4590,
    image: tshirtImg,
    category: 'Одежда'
  }
];

function App() {
  const [products] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [currentView, setCurrentView] = useState<'catalog' | 'cart' | 'orders' | 'admin'>('catalog');
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // 1. Сначала объявляем вспомогательные функции
  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // 2. Потом функции для работы с корзиной
  const addToCart = (product: Product): void => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number): void => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // 3. Затем обработчики событий
  const handleCheckout = (): void => {
    setCheckoutDialogOpen(true);
  };

  const handleConfirmCheckout = async (): Promise<void> => {
    if (!user) return;

    setCheckoutError(null);

    try {
      const deliveryPrice = getTotalPrice() > 3000 ? 0 : 299;
      const finalTotal = getTotalPrice() + deliveryPrice;

      // Создаем заказ на сервере
      const response = await axios.post(`${API_URL}/orders/create`, {
        userId: user.id,
        userName: user.first_name + (user.last_name ? ` ${user.last_name}` : ''),
        items: cart,
        total: getTotalPrice(),
        deliveryPrice,
        phone,
        email,
        notes
      });

      if (response.data.success) {
        const order = response.data.order;
        setOrderData({
          amount: finalTotal,
          orderId: order.id,
          userId: user.id,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        });

        setCheckoutDialogOpen(false);
        setPaymentModalOpen(true);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setCheckoutError(error.response?.data?.error || 'Ошибка создания заказа');
    }
  };

  const handlePaymentComplete = (): void => {
    setPaymentModalOpen(false);
    setCart([]);
    setPhone('');
    setEmail('');
    setNotes('');
    setCurrentView('orders');

    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.showAlert('✅ Заказ успешно оформлен!');
    }
  };

  const handleBackToCatalog = (): void => {
    setCurrentView('catalog');
  };

  // 4. И только потом useEffect и остальной код
  useEffect(() => {
    const initTelegram = async () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.expand();
        tg.enableClosingConfirmation();
        tg.ready();

        if (tg.initDataUnsafe?.user) {
          const telegramUser = tg.initDataUnsafe.user;
          setUser(telegramUser);

          console.log('Current Telegram user ID:', telegramUser.id);

          // Проверяем, является ли пользователь админом через API
          try {
            const apiUrl = `${API_URL}/user/check-admin/${telegramUser.id}`;
            console.log('=== ADMIN CHECK DEBUG ===');
            console.log('User ID:', telegramUser.id);
            console.log('User ID type:', typeof telegramUser.id);
            console.log('API URL:', apiUrl);
            console.log('Full user object:', JSON.stringify(telegramUser));

            const response = await axios.get(apiUrl);
            console.log('Admin check response:', response.data);

            if (response.data.success) {
              console.log('Setting isAdmin to:', response.data.isAdmin);
              setIsAdmin(response.data.isAdmin);
              console.log('isAdmin state updated');
            }
          } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          }
        }

        console.log('Telegram Web App initialized');
      } else {
        console.log('Running outside Telegram - using mock data');
        const mockUser = {
          id: 123456789,
          first_name: 'Test',
          username: 'test_user'
        };
        setUser(mockUser);

        // Проверяем админа через API даже в режиме разработки
        try {
          const response = await axios.get(`${API_URL}/user/check-admin/${mockUser.id}`);
          if (response.data.success) {
            setIsAdmin(response.data.isAdmin);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      }
    };

    initTelegram();
  }, []);

  // Отслеживаем изменения isAdmin
  useEffect(() => {
    console.log('=== isAdmin STATE CHANGED ===', isAdmin);
  }, [isAdmin]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: 7 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <StorefrontIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dress Code Store
            </Typography>
            {/* Debug badge */}
            {isAdmin && (
              <Typography variant="caption" sx={{ mr: 2, bgcolor: 'success.main', px: 1, py: 0.5, borderRadius: 1 }}>
                ADMIN
              </Typography>
            )}
            <IconButton color="inherit" onClick={() => setCurrentView('cart')}>
              <Badge badgeContent={getTotalItems()} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
          {currentView === 'catalog' && (
            <Catalog
              products={products}
              onAddToCart={addToCart}
            />
          )}

          {currentView === 'cart' && (
            <Cart
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onCheckout={handleCheckout}
              onBackToCatalog={handleBackToCatalog}
              totalPrice={getTotalPrice()}
            />
          )}

          {currentView === 'orders' && user && (
            <OrderHistory userId={user.id} />
          )}

          {currentView === 'admin' && isAdmin && (
            <AdminPanel />
          )}
        </Container>

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            value={currentView}
            onChange={(_, newValue) => setCurrentView(newValue)}
            showLabels
          >
            <BottomNavigationAction
              label="Каталог"
              value="catalog"
              icon={<StorefrontIcon />}
            />
            <BottomNavigationAction
              label="Корзина"
              value="cart"
              icon={<ShoppingCartIcon />}
            />
            <BottomNavigationAction
              label="Заказы"
              value="orders"
              icon={<ReceiptIcon />}
            />
            {isAdmin && (
              <BottomNavigationAction
                label="Админ"
                value="admin"
                icon={<AdminPanelSettingsIcon />}
              />
            )}
          </BottomNavigation>
        </Paper>

        {/* Debug info */}
        {console.log('=== RENDER DEBUG ===', { isAdmin, currentView, user: user?.id })}

        {/* Диалог оформления заказа */}
        <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Оформление заказа</DialogTitle>
          <DialogContent>
            {checkoutError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {checkoutError}
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Заполните контактные данные для связи
            </Typography>

            <TextField
              fullWidth
              label="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email (необязательно)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Комментарий к заказу (необязательно)"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Укажите пожелания по доставке"
            />

            <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Итого к оплате:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {(getTotalPrice() + (getTotalPrice() > 3000 ? 0 : 299)).toLocaleString('ru-RU')} ₽
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckoutDialogOpen(false)}>Отмена</Button>
            <Button
              variant="contained"
              onClick={handleConfirmCheckout}
              disabled={!phone.trim()}
            >
              Перейти к оплате
            </Button>
          </DialogActions>
        </Dialog>

        {/* Модальное окно оплаты */}
        {orderData && (
          <PaymentModal
            open={paymentModalOpen}
            onClose={handlePaymentComplete}
            amount={orderData.amount}
            orderId={orderData.orderId}
            userId={orderData.userId}
            items={orderData.items}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;