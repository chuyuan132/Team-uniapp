export interface IUserLoginRequest {
  phone: string;
  password: string;
}

export interface IUserLoginResponse {
  id: number;
  username: string;
  avatar: string;
  profile: string;
  userRole: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IUserRegisterRequest {
  username: string;
  phone: string;
  password: string;
}

export interface IGetUserListRequest {
  phone?: string;
  tagList?: string[];
  username?: string;
  pageSize: number;
  pageNo: number;
}

export interface IGetUserListItem {
  id: number;
  username: string;
  avatar: string;
  profile: string;
  userRole: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
}
