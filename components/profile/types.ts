export interface UserData {
  name: string;
  email: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Session {
  id: string;
  token: string;
  createdAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export type UserErrors = Partial<Record<keyof UserData, string>>;
export type PasswordErrors = Partial<Record<keyof PasswordData, string>>;
export type ActiveTab = "profile" | "password" | "sessions";
