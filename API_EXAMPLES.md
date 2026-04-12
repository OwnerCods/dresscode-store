# API Examples

Примеры использования API для тестирования и интеграции.

## Base URL
```
http://localhost:3001/api
```

## 1. Создание заказа

### Request
```bash
curl -X POST http://localhost:3001/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123456789,
    "userName": "Иван Иванов",
    "items": [
      {
        "id": 1,
        "name": "Джинсы Premium",
        "price": 1990,
        "quantity": 2,
        "image": "/images/jeans.jpg",
        "category": "Одежда"
      }
    ],
    "total": 3980,
    "deliveryPrice": 0,
    "phone": "+7 999 123-45-67",
    "email": "user@example.com",
    "notes": "Доставка после 18:00"
  }'
```

### Response
```json
{
  "success": true,
  "order": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": 123456789,
    "userName": "Иван Иванов",
    "items": [...],
    "total": 3980,
    "deliveryPrice": 0,
    "finalTotal": 3980,
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2026-04-13T00:00:00.000Z",
    "updatedAt": "2026-04-13T00:00:00.000Z"
  }
}
```

## 2. Создание платежа

### Request
```bash
curl -X POST http://localhost:3001/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 3980,
    "orderId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": 123456789,
    "description": "Заказ #550e8400",
    "items": [
      {
        "name": "Джинсы Premium",
        "quantity": 2,
        "price": 1990
      }
    ]
  }'
```

### Response
```json
{
  "success": true,
  "paymentId": "2d8f5e7a-1234-5678-9abc-def012345678",
  "confirmationUrl": "https://yoomoney.ru/checkout/payments/v2/contract?orderId=..."
}
```

## 3. Проверка статуса платежа

### Request
```bash
curl http://localhost:3001/api/payment/status/2d8f5e7a-1234-5678-9abc-def012345678
```

### Response
```json
{
  "success": true,
  "paid": true,
  "status": "succeeded",
  "amount": "3980.00",
  "metadata": {
    "order_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123456789"
  }
}
```

## 4. Получить заказы пользователя

### Request
```bash
curl http://localhost:3001/api/orders/user/123456789
```

### Response
```json
{
  "success": true,
  "orders": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": 123456789,
      "userName": "Иван Иванов",
      "items": [...],
      "total": 3980,
      "deliveryPrice": 0,
      "finalTotal": 3980,
      "status": "paid",
      "paymentStatus": "succeeded",
      "createdAt": "2026-04-13T00:00:00.000Z",
      "updatedAt": "2026-04-13T00:00:00.000Z"
    }
  ]
}
```

## 5. Получить все заказы (Админ)

### Request
```bash
curl http://localhost:3001/api/orders
```

### Response
```json
{
  "success": true,
  "orders": [...]
}
```

## 6. Обновить статус заказа

### Request
```bash
curl -X PATCH http://localhost:3001/api/orders/550e8400-e29b-41d4-a716-446655440000/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'
```

### Response
```json
{
  "success": true,
  "order": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "shipped",
    ...
  }
}
```

## 7. Получить статистику (Админ)

### Request
```bash
curl http://localhost:3001/api/orders/stats/summary
```

### Response
```json
{
  "success": true,
  "stats": {
    "total": 42,
    "paid": 35,
    "pending": 7,
    "totalRevenue": 156780
  }
}
```

## 8. Webhook от YooMoney

YooMoney отправляет POST запрос на `/api/payment/webhook` при изменении статуса платежа:

### Request Body (от YooMoney)
```json
{
  "type": "notification",
  "event": "payment.succeeded",
  "object": {
    "id": "2d8f5e7a-1234-5678-9abc-def012345678",
    "status": "succeeded",
    "amount": {
      "value": "3980.00",
      "currency": "RUB"
    },
    "metadata": {
      "order_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "123456789"
    },
    "created_at": "2026-04-13T00:00:00.000Z",
    "paid": true
  }
}
```

## Статусы заказов

- `pending` - Ожидает оплаты
- `paid` - Оплачен
- `processing` - В обработке
- `shipped` - Отправлен
- `delivered` - Доставлен
- `cancelled` - Отменен

## Статусы платежей

- `pending` - Ожидает оплаты
- `succeeded` - Успешно оплачен
- `failed` - Ошибка оплаты

## Коды ошибок

- `400` - Неверные данные запроса
- `404` - Заказ/платеж не найден
- `500` - Внутренняя ошибка сервера

## Тестирование с Postman

Импортируйте коллекцию:

```json
{
  "info": {
    "name": "Dress Code Store API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Order",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "{{baseUrl}}/orders/create",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"userId\": 123456789,\n  \"userName\": \"Test User\",\n  \"items\": [...],\n  \"total\": 3980,\n  \"deliveryPrice\": 0\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001/api"
    }
  ]
}
```
