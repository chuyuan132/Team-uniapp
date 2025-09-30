export interface IUserLoginRequest {
  phone: string;
  password: string;
}

export interface IUserLoginResponse {
  id: number;
  username: string;
  avatar: string;
  profile: string;
  user_role: string;
  tag_list: string[];
  created_at: string;
  updated_at: string;
}

export interface IUserRegisterRequest {
  username: string;
  phone: string;
  password: string;
}

export interface IGetUserListRequest {
  phone?: string;
  tag_list?: string[];
  username?: string;
  page_size: number;
  page_no: number;
}

export interface IGetUserListItem {
  id: number;
  username: string;
  avatar: string;
  profile: string;
  user_role: string;
  tag_list: string[];
  created_at: string;
  updated_at: string;
}
