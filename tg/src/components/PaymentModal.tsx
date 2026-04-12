import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import ErrorIcon from '@mui/icons-material/Error';
import { paymentService } from '../services/paymentService';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  userId?: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}

const steps = ['Подтверждение', 'Оплата', 'Завершение'];

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  amount,
  orderId,
  userId,
  items
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handleCreatePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentService.createPayment({
        amount,
        orderId,
        userId,
        description: `Заказ #${orderId}`,
        items
      });
      
      if (response.success) {
        setPaymentId(response.paymentId);
        setPaymentUrl(response.confirmationUrl);
        setActiveStep(1);
      } else {
        setError('Ошибка создания платежа');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    if (paymentUrl) {
      paymentService.openPaymentForm(paymentUrl);
      setActiveStep(2);
      
      // Запускаем проверку статуса
      checkPaymentStatus();
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentId) return;
    
    const interval = setInterval(async () => {
      try {
        const status = await paymentService.checkPaymentStatus(paymentId);
        
        if (status.paid) {
          clearInterval(interval);
          // Платеж успешен
          onClose(); // Закрываем модалку
          
          // Можно показать уведомление
          const tg = (window as any).Telegram?.WebApp;
          if (tg) {
            tg.showAlert('✅ Оплата прошла успешно!');
          }
        }
      } catch (err) {
        console.error('Status check error:', err);
      }
    }, 5000); // Проверяем каждые 5 секунд
    
    // Останавливаем через 5 минут
    setTimeout(() => clearInterval(interval), 300000);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Детали заказа
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              {items.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography fontWeight="bold">
                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Итого:</Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {amount.toLocaleString('ru-RU')} ₽
                </Typography>
              </Box>
            </Paper>
            <Typography variant="body2" color="text.secondary">
              После подтверждения вы будете перенаправлены на страницу оплаты ЮКассы
            </Typography>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CreditCardIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Готово к оплате
            </Typography>
            <Typography variant="body1" paragraph>
              Сумма к оплате: <strong>{amount.toLocaleString('ru-RU')} ₽</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Нажмите кнопку ниже для перехода к безопасной оплате через ЮКассу
            </Typography>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ожидание подтверждения оплаты
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Не закрывайте это окно. После успешной оплаты заказ будет автоматически подтверждён.
            </Typography>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />
          <Typography variant="h6">Оплата заказа</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 2 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {renderStepContent(index)}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        {activeStep === 0 && (
          <>
            <Button onClick={onClose}>Отмена</Button>
            <Button
              variant="contained"
              onClick={handleCreatePayment}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Перейти к оплате'}
            </Button>
          </>
        )}
        
        {activeStep === 1 && (
          <>
            <Button onClick={() => setActiveStep(0)}>Назад</Button>
            <Button
              variant="contained"
              onClick={handleProceedToPayment}
              disabled={!paymentUrl}
            >
              Перейти к оплате
            </Button>
          </>
        )}
        
        {activeStep === 2 && (
          <Button onClick={onClose} variant="outlined">
            Закрыть
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;