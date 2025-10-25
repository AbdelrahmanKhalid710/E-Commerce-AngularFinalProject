export interface AdminLoginForm {
  adminUsername: string;
  adminPassword: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
}