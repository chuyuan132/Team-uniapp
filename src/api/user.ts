import { POST } from '@/service/service';
import type {
  IGetUserListRequest,
  IUserLoginRequest,
  IUserRegisterRequest,
} from '@/typing';
/**
 * 用户登录
 * @param params
 */
export function userLogin(params: IUserLoginRequest) {
  return POST('/user/login', params);
}

/**
 * 用户注册
 * @param params
 * @returns
 */
export function userRegister(params: IUserRegisterRequest) {
  return POST('/user/register', params);
}

/**
 * 获取用户列表
 * @returns
 */
export function getUserList(params: IGetUserListRequest) {
  return POST('/user/list', params);
}
