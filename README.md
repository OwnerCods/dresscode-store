# Dress Code Store - Telegram Mini App

Полнофункциональный интернет-магазин в виде Telegram Mini App с интеграцией оплаты через ЮMoney (YooKassa).

## 🚀 Возможности

### Для пользователей:
- 🛍️ Каталог товаров с категориями
- 🛒 Корзина с управлением количеством
- 💳 Оплата через ЮMoney (YooKassa)
- 📦 История заказов
- 🚚 Бесплатная доставка при заказе от 3000₽

### Для администраторов:
- 📊 Панель администратора с статистикой
- 📋 Управление заказами
- 🔄 Изменение статусов заказов
- 💰 Отслеживание выручки

## 📁 Структура проекта

```
telegaMiniAppDresscode/
├── tg/                    # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── services/      # API сервисы
│   │   ├── types/         # TypeScript типы
│   │   └── App.tsx        # Главный компонент
│   └── package.json
│
└── server/                # Backend (Node.js + Express + TypeScript)
    ├── src/
    │   ├── routes/        # API endpoints
    │   ├── services/      # Бизнес-логика
    │   └── types/         # TypeScript типы
    ├── data/              # JSON база данных
    └── package.json
```

## 🛠️ Установка и настройка

### 1. Клонирование и установка зависимостей

```bash
# Установка зависимостей для фронтенда
cd tg
npm install

# Установка зависимостей для бэкенда
cd ../server
npm install
```

### 2. Настройка переменных окружения

#### Backend (server/.env)

```env
PORT=3001
NODE_ENV=development

# YooMoney (YooKassa) Configuration
YOOMONEY_SHOP_ID=your_shop_id_here
YOOMONEY_SECRET_KEY=your_secret_key_here

# Frontend URL
FRONTEND_URL=https://t.me/your_bot_name

# Admin Telegram IDs (comma-separated)
ADMIN_TELEGRAM_IDS=123456789,987654321

DATA_DIR=./data
```

#### Frontend (tg/.env.local)

```env
VITE_API_URL=http://localhost:3001/api
VITE_ADMIN_IDS=123456789
```

### 3. Получение ключей ЮMoney (YooKassa)

1. Зарегистрируйтесь на [YooKassa](https://yookassa.ru/)
2. Создайте магазин
3. Получите `shopId` и `secretKey` в личном кабинете
4. Добавьте их в `server/.env`

### 4. Создание Telegram бота

1. Найдите [@BotFather](https://t.me/BotFather) в Telegram
2. Создайте нового бота командой `/newbot`
3. Получите токен бота
4. Настройте Mini App:
   ```
   /newapp
   /setmenubutton - добавить кнопку в меню
   ```

## 🚀 Запуск

### Режим разработки

```bash
# Терминал 1 - Backend
cd server
npm run dev

# Терминал 2 - Frontend
cd tg
npm run dev
```

Backend будет доступен на `http://localhost:3001`
Frontend будет доступен на `http://localhost:3000`

### Продакшен

```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd tg
npm run build
# Разместите содержимое dist/ на хостинге
```

## 📡 API Endpoints

### Orders
- `POST /api/orders/create` - Создать заказ
- `GET /api/orders/:orderId` - Получить заказ по ID
- `GET /api/orders/user/:userId` - Заказы пользователя
- `GET /api/orders` - Все заказы (админ)
- `PATCH /api/orders/:orderId/status` - Обновить статус
- `GET /api/orders/stats/summary` - Статистика

### Payment
- `POST /api/payment/create` - Создать платеж
- `GET /api/payment/status/:paymentId` - Статус платежа
- `POST /api/payment/webhook` - Webhook от YooMoney
- `POST /api/payment/cancel/:paymentId` - Отменить платеж

## 🔐 Настройка администраторов

Добавьте Telegram ID администраторов в переменные окружения:

**Backend** (`server/.env`):
```env
ADMIN_TELEGRAM_IDS=123456789,987654321
```

**Frontend** (`tg/.env.local`):
```env
VITE_ADMIN_IDS=123456789
```

Чтобы узнать свой Telegram ID, используйте бота [@userinfobot](https://t.me/userinfobot)

## 🎨 Кастомизация

### Добавление товаров

Отредактируйте `tg/src/App.tsx`:

```typescript
const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Название товара',
    description: 'Описание',
    price: 1990,
    image: '/path/to/image.jpg',
    category: 'Категория'
  },
  // ...
];
```

### Изменение темы

Отредактируйте `tg/src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#0088cc' },
    secondary: { main: '#34b7f1' },
  },
  shape: { borderRadius: 12 },
});
```

## 🔔 Webhook для YooMoney

Настройте webhook в личном кабинете YooKassa:

```
URL: https://your-domain.com/api/payment/webhook
HTTP метод: POST
```

## 📱 Тестирование

### Локальное тестирование в Telegram

1. Используйте [ngrok](https://ngrok.com/) для создания публичного URL:
   ```bash
   ngrok http 3000
   ```

2. Обновите URL Mini App в настройках бота через @BotFather

### Тестовые платежи

YooKassa предоставляет тестовый режим. Используйте тестовые карты:
- Успешная оплата: `5555 5555 5555 4477`
- Отклоненная оплата: `5555 5555 5555 5599`

## 🐛 Решение проблем

### Ошибка CORS
Убедитесь, что в `server/src/index.ts` настроен CORS:
```typescript
app.use(cors());
```

### Ошибка подключения к API
Проверьте, что:
1. Backend запущен на порту 3001
2. В `tg/.env.local` правильный `VITE_API_URL`
3. Нет блокировки файрволом

### Платежи не работают
1. Проверьте правильность `YOOMONEY_SHOP_ID` и `YOOMONEY_SECRET_KEY`
2. Убедитесь, что магазин активирован в YooKassa
3. Проверьте логи сервера на наличие ошибок

## 📄 Лицензия

MIT

## 🤝 Поддержка

Если возникли вопросы или проблемы, создайте issue в репозитории.

---

Сделано с ❤️ для Telegram Mini Apps
