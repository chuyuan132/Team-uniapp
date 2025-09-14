import { GET, POST } from '@/service/service'
/**
 * 用户登录
 * @param params
 */
export function userLogin(params: userApi.IUserLoginRequest) {
    return GET('/user/login', params)
}