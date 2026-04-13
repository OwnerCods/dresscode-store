# Dress Code Store - Контекст проекта

## Описание
Telegram Mini App для интернет-магазина одежды с интеграцией платежей YooKassa.

## Архитектура

### Frontend (Telegram Mini App)
- **Технологии**: React + TypeScript + Vite + Material-UI
- **Расположение кода**: `/tg`
- **Хостинг**: Firebase Hosting
- **URL**: https://dresscodenata.web.app
- **Деплой**: `cd tg && npm run build && firebase deploy --only hosting`

### Backend (API Server)
- **Технологии**: Node.js + Express + TypeScript
- **Расположение кода**: `/server`
- **Хостинг**: Render.com (бесплатный план)
- **URL**: https://dresscode-store.onrender.com
- **Деплой**: Автоматический при push в `main` ветку GitHub
- **Особенности**: 
  - Сервер "засыпает" после 15 минут неактивности
  - Первый запрос после сна может занять 50+ секунд

### База данных
- **Тип**: MongoDB Atlas (бесплатный план M0, 512MB)
- **Кластер**: cluster777.mgmg6fv.mongodb.net
- **База данных**: dresscode
- **Коллекции**: orders
- **Подключение**: через переменную окружения `MONGODB_URI`

### Git Repository
- **GitHub**: https://github.com/OwnerCods/dresscode-store.git
- **Основная ветка**: main
- **CI/CD**: 
  - Push в main → автоматический деплой на Render.com (backend)
  - Frontend деплоится вручную через Firebase CLI

## Переменные окружения

### Backend (.env на Render.com)
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://dresscode:DataBase777@cluster777.mgmg6fv.mongodb.net/dresscode?retryWrites=true&w=majority
ADMIN_TELEGRAM_IDS=5845575815,123456789
YOOMONEY_SHOP_ID=your_shop_id_here
YOOMONEY_SECRET_KEY=your_secret_key_here
FRONTEND_URL=https://dresscodenata.web.app
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### Frontend (.env в /tg)
```env
VITE_API_URL=https://dresscode-store.onrender.com/api
VITE_YOOKASSA_SHOP_ID=1232615
```

## Структура проекта

```
dresscode-store/
├── tg/                          # Frontend (Telegram Mini App)
│   ├── src/
│   │   ├── components/          # React компоненты
│   │   ├── types/               # TypeScript типы
│   │   ├── App.tsx              # Главный компонент
│   │   └── main.tsx             # Точка входа
│   ├── dist/                    # Собранные файлы для деплоя
│   ├── index.html               # HTML с Telegram WebApp скриптом
│   └── package.json
│
├── server/                      # Backend API
│   ├── src/
│   │   ├── routes/              # API эндпоинты
│   │   │   ├── orders.ts        # Управление заказами
│   │   │   ├── payment.ts       # Интеграция с YooKassa
│   │   │   └── user.ts          # Проверка админов
│   │   ├── services/
│   │   │   └── database.ts      # MongoDB клиент
│   │   ├── types/               # TypeScript типы
│   │   └── index.ts             # Точка входа сервера
│   ├── dist/                    # Скомпилированный JS
│   └── package.json
│
└── PROJECT_CONTEXT.md           # Этот файл
```

## Основные функции

### Пользовательские
- Просмотр каталога товаров
- Добавление товаров в корзину
- Оформление заказа с контактными данными
- Оплата через YooKassa
- Просмотр истории заказов

### Административные
- Просмотр всех заказов
- Статистика продаж
- Управление статусами заказов
- Доступ только для пользователей из `ADMIN_TELEGRAM_IDS`

## Важные особенности

### Telegram WebApp Integration
- Скрипт подключается в `index.html`: `https://telegram.org/js/telegram-web-app.js`
- Получение данных пользователя через `window.Telegram.WebApp.initDataUnsafe`
- Умное предупреждение при закрытии (только если корзина не пустая)

### Проверка админа
- Backend: `/api/user/check-admin/:userId`
- Проверяет ID пользователя против списка в `ADMIN_TELEGRAM_IDS`
- Frontend показывает кнопку "Админ" только для админов

### Хранение данных
- **Раньше**: Файловая система (данные терялись при рестарте Render)
- **Сейчас**: MongoDB Atlas (постоянное хранилище)
- Индексы созданы для: userId, status, createdAt

## Workflow разработки

### Обновление Frontend
```bash
cd tg
npm run build
firebase deploy --only hosting
git add .
git commit -m "Update frontend"
git push origin main
```

### Обновление Backend
```bash
cd server
npm run build
git add .
git commit -m "Update backend"
git push origin main
# Render.com автоматически задеплоит
```

### Добавление новых товаров
Редактировать `tg/src/App.tsx` → массив `initialProducts`

### Проверка логов
- **Render.com**: Dashboard → dresscode-store → Logs
- **Firebase**: Console → Hosting → Usage

## Полезные команды

```bash
# Проверка здоровья сервера
curl https://dresscode-store.onrender.com/health

# Проверка конфигурации админов
curl https://dresscode-store.onrender.com/api/user/admin-config

# Проверка админа
curl https://dresscode-store.onrender.com/api/user/check-admin/5845575815

# Локальная разработка frontend
cd tg && npm run dev

# Локальная разработка backend
cd server && npm run dev
```

## Контакты и доступы

- **GitHub**: OwnerCods
- **Telegram Admin ID**: 5845575815
- **Firebase Project**: dresscodenata
- **Render Service**: dresscode-store
- **MongoDB Cluster**: cluster777

## История изменений

### 2026-04-13
- ✅ Исправлена проблема с видимостью кнопки админа (добавлен Telegram WebApp скрипт)
- ✅ Миграция с файлового хранилища на MongoDB Atlas
- ✅ Добавлено умное предупреждение при закрытии (только если корзина не пустая)
- ✅ Добавлены новые товары в каталог (Футболка Urban, Брюки Limited)
- ✅ Убраны DEBUG панели из UI

## Известные проблемы

- Render бесплатный план засыпает после 15 минут → первый запрос медленный
- Решение: использовать платный план ($7/мес) или пинговать сервер каждые 10 минут

## TODO / Будущие улучшения

- [ ] Добавить управление товарами через админ-панель
- [ ] Реализовать загрузку изображений товаров
- [ ] Добавить категории товаров с фильтрацией
- [ ] Интегрировать уведомления в Telegram при новых заказах
- [ ] Добавить аналитику и отчеты для админа
