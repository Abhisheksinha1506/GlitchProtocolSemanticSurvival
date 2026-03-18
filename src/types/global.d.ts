declare global {
  interface Window {
    puter: {
      ai: {
        chat: {
          completions: {
            create: (options: any) => Promise<any>;
          };
        };
      };
      kv: {
        set: (key: string, value: any) => Promise<void>;
        get: (key: string) => Promise<any>;
      };
    };
  }
}

export {};
