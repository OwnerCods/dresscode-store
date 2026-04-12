// src/telegram.d.ts
import { TelegramUser } from './types';

interface TelegramWebApp {
  expand: () => void;
  enableClosingConfirmation: () => void;
  initDataUnsafe?: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: string;
    hash?: string;
  };
  initData?: string;
  sendData: (data: string) => void;
  close: () => void;
  ready: () => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  showPopup: (params: any, callback: (buttonId: string) => void) => void;
  showScanQrPopup: (params: any, callback: (text: string) => void) => void;
  closeScanQrPopup: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  platform: string;
  version: string;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
}

interface Telegram {
  WebApp: TelegramWebApp;
}

export {};

declare global {
  interface Window {
    Telegram?: Telegram;
  }
}