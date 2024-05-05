declare module 'express' {
  interface Request {
    user: { email: string; id: string; role: 'ADMIN' | 'USER' };
  }
}

export {};
