# Быстрый старт

## Шаг 1: Установка зависимостей

```bash
# Backend
cd server
npm install

# Frontend
cd ../tg
npm install
```

## Шаг 2: Настройка

### Backend (server/.env)
Скопируйте `.env.example` в `.env` и заполните:

```env
PORT=3001
YOOMONEY_SHOP_ID=ваш_shop_id
YOOMONEY_SECRET_KEY=ваш_secret_key
ADMIN_TELEGRAM_IDS=ваш_telegram_id
```

### Frontend (tg/.env.local)
```env
VITE_API_URL=http://localhost:3001/api
VITE_ADMIN_IDS=ваш_telegram_id
```

## Шаг 3: Запуск

```bash
# Терминал 1 - Backend
cd server
npm run dev

# Терминал 2 - Frontend  
cd tg
npm run dev
```

## Шаг 4: Получение ключей YooKassa

1. Регистрация: https://yookassa.ru/
2. Создайте магазин
3. Получите shopId и secretKey
4. Добавьте в server/.env

## Шаг 5: Настройка Telegram бота

1. Найдите @BotFather
2. `/newbot` - создать бота
3. `/newapp` - создать Mini App
4. Укажите URL: `https://your-domain.com` (или ngrok для теста)

## Узнать свой Telegram ID

Напишите боту @userinfobot

## Тестирование локально

```bash
# Установите ngrok
ngrok http 3000

# Используйте полученный URL в настройках Mini App
```

## Готово! 🎉

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Админ-панель доступна пользователям из ADMIN_TELEGRAM_IDS
