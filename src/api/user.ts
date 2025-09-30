import { GET, POST } from '@/service/service';
/**
 * 用户登录
 * @param params
 */
export function userLogin(params: userApi.IUserLoginRequest) {
  return POST('/user/login', params);
}

/**
 * 用户注册
 * @param params
 * @returns
 */
export function userRegister(params: userApi.IUserRegisterRequest) {
  return POST('/user/register', params);
}

/**
 * 获取用户列表
 * @returns
 */
export function getUserList(params: userApi.IGetUserListRequest) {
  return GET('/user/list', params);
}
