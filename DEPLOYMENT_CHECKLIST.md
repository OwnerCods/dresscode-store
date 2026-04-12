# Чеклист развертывания

## ✅ Что уже сделано

### Backend
- [x] Express сервер с TypeScript
- [x] API для управления заказами
- [x] Интеграция с YooMoney (YooKassa)
- [x] JSON база данных
- [x] Webhook для уведомлений о платежах
- [x] Статистика заказов

### Frontend
- [x] React + TypeScript + Vite
- [x] Material-UI компоненты
- [x] Каталог товаров
- [x] Корзина с управлением
- [x] История заказов пользователя
- [x] Админ-панель
- [x] Интеграция с Telegram WebApp API
- [x] Модальное окно оплаты

## 📋 Что нужно сделать перед запуском

### 1. Настройка YooMoney
- [ ] Зарегистрироваться на https://yookassa.ru/
- [ ] Создать магазин
- [ ] Получить shopId и secretKey
- [ ] Добавить ключи в `server/.env`
- [ ] Настроить webhook (после деплоя)

### 2. Настройка Telegram бота
- [ ] Создать бота через @BotFather
- [ ] Получить токен бота
- [ ] Создать Mini App через @BotFather
- [ ] Указать URL приложения

### 3. Настройка переменных окружения

#### server/.env
```env
PORT=3001
YOOMONEY_SHOP_ID=ваш_shop_id
YOOMONEY_SECRET_KEY=ваш_secret_key
FRONTEND_URL=https://t.me/your_bot
ADMIN_TELEGRAM_IDS=ваш_telegram_id
```

#### tg/.env.local
```env
VITE_API_URL=http://localhost:3001/api
VITE_ADMIN_IDS=ваш_telegram_id
```

### 4. Установка зависимостей
```bash
cd server && npm install
cd ../tg && npm install
```

### 5. Запуск в режиме разработки
```bash
# Терминал 1
cd server && npm run dev

# Терминал 2
cd tg && npm run dev
```

## 🚀 Деплой на продакшен

### Backend (рекомендуется)
- [ ] VPS (DigitalOcean, AWS, etc.)
- [ ] PM2 для управления процессом
- [ ] Nginx как reverse proxy
- [ ] SSL сертификат (Let's Encrypt)

### Frontend (рекомендуется)
- [ ] Vercel / Netlify / GitHub Pages
- [ ] Или статика на том же VPS

### Пример деплоя на VPS

```bash
# Backend
cd server
npm run build
pm2 start dist/index.js --name dresscode-api

# Frontend
cd tg
npm run build
# Скопировать dist/ в /var/www/html
```

## 🔧 Настройка после деплоя

### 1. Webhook YooMoney
```
URL: https://your-domain.com/api/payment/webhook
Метод: POST
События: payment.succeeded, payment.canceled
```

### 2. Telegram Mini App
```
URL: https://your-frontend-domain.com
```

### 3. CORS
Обновите CORS в `server/src/index.ts`:
```typescript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## 🧪 Тестирование

### Локальное тестирование
- [ ] Запустить backend и frontend
- [ ] Открыть http://localhost:3000
- [ ] Проверить каталог
- [ ] Добавить товары в корзину
- [ ] Проверить оформление заказа

### Тестирование в Telegram
- [ ] Использовать ngrok для публичного URL
- [ ] Настроить Mini App с ngrok URL
- [ ] Открыть бота в Telegram
- [ ] Протестировать весь флоу

### Тестовые платежи
- [ ] Использовать тестовые ключи YooKassa
- [ ] Тестовая карта: 5555 5555 5555 4477
- [ ] Проверить webhook уведомления

## 📊 Мониторинг

После запуска следите за:
- [ ] Логами сервера
- [ ] Статусами заказов
- [ ] Webhook уведомлениями от YooKassa
- [ ] Ошибками в консоли браузера

## 🆘 Поддержка

При возникновении проблем:
1. Проверьте логи сервера
2. Проверьте консоль браузера
3. Убедитесь, что все переменные окружения заполнены
4. Проверьте, что backend доступен по API_URL

## 📝 Дополнительные улучшения (опционально)

- [ ] Добавить базу данных (PostgreSQL/MongoDB)
- [ ] Добавить аутентификацию для админ-панели
- [ ] Добавить email уведомления
- [ ] Добавить Telegram уведомления через бота
- [ ] Добавить аналитику (Google Analytics)
- [ ] Добавить логирование (Winston)
- [ ] Добавить rate limiting
- [ ] Добавить кэширование (Redis)
