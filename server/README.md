# Dress Code Store - Backend Server

Backend API для Telegram Mini App магазина Dress Code Store.

## Возможности

- 🛒 Управление заказами
- 💳 Интеграция с ЮMoney (YooKassa)
- 📊 Статистика заказов
- 🔔 Webhook для уведомлений о платежах
- 💾 Хранение данных в JSON файлах

## Установка

```bash
# Установить зависимости
npm install

# Скопировать .env.example в .env и заполнить данные
cp .env.example .env

# Запустить в режиме разработки
npm run dev

# Собрать для продакшена
npm run build

# Запустить продакшен версию
npm start
```

## Настройка

Отредактируйте файл `.env`:

```env
PORT=3001
YOOMONEY_SHOP_ID=your_shop_id
YOOMONEY_SECRET_KEY=your_secret_key
TELEGRAM_BOT_TOKEN=your_bot_token
ADMIN_TELEGRAM_IDS=123456789,987654321
```

## API Endpoints

### Orders

- `POST /api/orders/create` - Создать заказ
- `GET /api/orders/:orderId` - Получить заказ
- `GET /api/orders/user/:userId` - Заказы пользователя
- `GET /api/orders` - Все заказы (админ)
- `PATCH /api/orders/:orderId/status` - Обновить статус
- `GET /api/orders/stats/summary` - Статистика

### Payment

- `POST /api/payment/create` - Создать платеж
- `GET /api/payment/status/:paymentId` - Статус платежа
- `POST /api/payment/webhook` - Webhook от YooMoney
- `POST /api/payment/cancel/:paymentId` - Отменить платеж

## Структура проекта

```
server/
├── src/
│   ├── routes/          # API роуты
│   ├── services/        # Бизнес-логика
│   ├── types/           # TypeScript типы
│   └── index.ts         # Точка входа
├── data/                # JSON база данных
└── dist/                # Скомпилированные файлы
```
