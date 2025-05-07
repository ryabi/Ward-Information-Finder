export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  // rememberMe?: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  country: string;
  province: string;
  district: string;
  municipality: string;
  town: string;
  ward_no?: string;
  date_of_birth: string;
  username: string;
  password: string;
  re_password:string;
}