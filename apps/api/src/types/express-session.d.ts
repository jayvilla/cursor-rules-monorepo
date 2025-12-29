// Type augmentation for Express Request to include session
declare global {
  namespace Express {
    interface Request {
      session: {
        userId?: string;
        orgId?: string;
        role?: string;
        destroy(callback?: (err?: Error) => void): void;
        regenerate(callback: (err?: Error) => void): void;
        save(callback?: (err?: Error) => void): void;
        reload(callback: (err?: Error) => void): void;
        resetMaxAge(): void;
        touch(): void;
        cookie: {
          originalMaxAge?: number;
          expires?: Date;
          secure?: boolean;
          httpOnly?: boolean;
          sameSite?: boolean | 'lax' | 'strict' | 'none';
          path?: string;
        };
      };
    }
  }
}

export {};

