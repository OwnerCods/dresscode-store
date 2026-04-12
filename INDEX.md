# 📚 Документация проекта

Добро пожаловать в Dress Code Store - полнофункциональный интернет-магазин для Telegram Mini App!

## 🚀 Быстрый старт

Если вы впервые запускаете проект, начните с этих файлов по порядку:

1. **[FIRST_RUN.md](./FIRST_RUN.md)** ⭐ - Пошаговая инструкция первого запуска
2. **[QUICKSTART.md](./QUICKSTART.md)** - Краткое руководство по запуску
3. **[README.md](./README.md)** - Основная документация проекта

## 📖 Основная документация

### Общие файлы
- **[README.md](./README.md)** - Полное описание проекта, возможности, структура
- **[SUMMARY.md](./SUMMARY.md)** - Итоговая сводка: что сделано, технологии, архитектура

### Настройка и запуск
- **[FIRST_RUN.md](./FIRST_RUN.md)** ⭐ - Детальная инструкция для первого запуска
- **[QUICKSTART.md](./QUICKSTART.md)** - Быстрый старт за 5 минут
- **[YOOMONEY_SETUP.md](./YOOMONEY_SETUP.md)** - Настройка платежной системы ЮMoney

### Разработка
- **[API_EXAMPLES.md](./API_EXAMPLES.md)** - Примеры API запросов с curl
- **[server/README.md](./server/README.md)** - Документация Backend API
- **[tg/README.md](./tg/README.md)** - Документация Frontend

### Деплой
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Чеклист для деплоя на продакшен

## 🎯 Что выбрать?

### Я хочу просто запустить проект локально
→ Читайте **[FIRST_RUN.md](./FIRST_RUN.md)**

### Мне нужно быстро понять, как это работает
→ Читайте **[QUICKSTART.md](./QUICKSTART.md)** и **[SUMMARY.md](./SUMMARY.md)**

### Я хочу настроить платежи
→ Читайте **[YOOMONEY_SETUP.md](./YOOMONEY_SETUP.md)**

### Мне нужно протестировать API
→ Читайте **[API_EXAMPLES.md](./API_EXAMPLES.md)**

### Я готов к деплою на продакшен
→ Читайте **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

## 📁 Структура проекта

```
telegaMiniAppDresscode/
│
├── 📄 Документация
│   ├── README.md                    # Основная документация
│   ├── FIRST_RUN.md                 # ⭐ Первый запуск
│   ├── QUICKSTART.md                # Быстрый старт
│   ├── SUMMARY.md                   # Итоговая сводка
│   ├── YOOMONEY_SETUP.md            # Настройка платежей
│   ├── API_EXAMPLES.md              # Примеры API
│   ├── DEPLOYMENT_CHECKLIST.md      # Чеклист деплоя
│   └── INDEX.md                     # Этот файл
│
├── 🖥️ Backend (server/)
│   ├── src/
│   │   ├── routes/                  # API endpoints
│   │   ├── services/                # Бизнес-логика
│   │   ├── types/                   # TypeScript типы
│   │   └── index.ts                 # Точка входа
│   ├── data/                        # JSON база данных
│   ├── .env                         # Конфигурация
│   ├── package.json
│   └── README.md
│
└── 🎨 Frontend (tg/)
    ├── src/
    │   ├── components/              # React компоненты
    │   ├── services/                # API сервисы
    │   ├── types/                   # TypeScript типы
    │   ├── utils/                   # Утилиты
    │   └── App.tsx                  # Главный компонент
    ├── .env.local                   # Конфигурация
    ├── package.json
    └── README.md
```

## ✨ Основные возможности

### Для пользователей:
- 🛍️ Каталог товаров с категориями
- 🛒 Корзина с управлением количеством
- 💳 Оплата через ЮMoney (YooKassa)
- 📦 История заказов
- 🚚 Бесплатная доставка от 3000₽

### Для администраторов:
- 📊 Панель с статистикой
- 📋 Управление заказами
- 🔄 Изменение статусов
- 💰 Отслеживание выручки

## 🛠️ Технологии

**Backend:**
- Node.js + Express
- TypeScript
- YooMoney (YooKassa) API
- JSON Database

**Frontend:**
- React 18 + TypeScript
- Vite
- Material-UI (MUI)
- Telegram WebApp API

## 📞 Поддержка

Если возникли вопросы:

1. Проверьте соответствующий раздел документации
2. Посмотрите примеры в **[API_EXAMPLES.md](./API_EXAMPLES.md)**
3. Проверьте раздел "Частые проблемы" в **[FIRST_RUN.md](./FIRST_RUN.md)**

## 🎓 Полезные ссылки

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [YooKassa API](https://yookassa.ru/developers/api)
- [React](https://react.dev/)
- [Material-UI](https://mui.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 📝 Лицензия

MIT

---

**Начните с [FIRST_RUN.md](./FIRST_RUN.md) для пошаговой инструкции! 🚀**
