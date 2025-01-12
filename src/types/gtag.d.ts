interface Window {
  gtag: (
    command: 'event' | 'config' | 'js' | 'set',
    targetId: string,
    config?: {
      send_to?: string;
      value?: number;
      currency?: string;
      [key: string]: any;
    }
  ) => void;
}