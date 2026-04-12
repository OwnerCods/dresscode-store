// src/global.d.ts
import { TelegramUser } from './types';

declare global {
  interface TelegramWebApp {
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
      setText: (text: string) => MainButton;
      show: () => MainButton;
      hide: () => MainButton;
      enable: () => MainButton;
      disable: () => MainButton;
    };
    themeParams: {
      bg_color: string;
      text_color: string;
      hint_color: string;
      link_color: string;
      button_color: string;
      button_text_color: string;
    };
  }

  interface Telegram {
    WebApp: TelegramWebApp;
  }

  interface Window {
    Telegram?: Telegram;
  }
}

export {}; // Это важно для модуля