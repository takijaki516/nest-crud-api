declare module 'express' {
  interface Request {
    user: { email: string; id: string };
  }
}

export {};
