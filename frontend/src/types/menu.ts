export type Menu = {
  id: string;
  username: string;
  tg_id: number;
  balance: number;
  count_boxes: number;
}

export type menuState = {
  list: Menu[];
  loading: boolean;
  error: string | null;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id?: number;
          };
        };
      };
    };
  }
}