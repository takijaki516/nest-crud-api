declare module 'express' {
  interface Request {
    user: UserInfo;
  }
}

export interface UserInfo {
  email: string;
  id: string;
  role: 'ADMIN' | 'USER';
}
