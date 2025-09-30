declare namespace userApi {
  interface IUserLoginRequest {
    phone: string;
    password: string;
  }

  interface IUserLoginResponse {
    id: number;
    username: string;
    avatar: string;
    profile: string;
    user_role: string;
    tag_list: string[];
    created_at: string;
    updated_at: string;
  }

  interface IUserRegisterRequest {
    username: string;
    phone: string;
    password: string;
  }

  interface IGetUserListRequest {
    phone?: string;
    tag_list?: string[];
    username?: string;
    page_size: number;
    page_no: number;
  }

  interface IGetUserListItem {
    id: number;
    username: string;
    avatar: string;
    profile: string;
    user_role: string;
    tag_list: string[];
    created_at: string;
    updated_at: string;
  }
}
