export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'Admin' | 'User';
  createdAt?: Date;
  lastLogin?: Date;
}

export interface LoginResponse {
  token: string;
  role: 'Admin' | 'User';
  user: User;
}
