import type { IRequestResult } from '@/typing';
import { showToast } from 'vant';

const BASE_URL = 'http://localhost:8001';
const TIME_OUT = 5000;

interface IResult {
  code: number;
  data: any;
  message: string;
}

/**
 * 请求封装
 * @param options
 */
function request(options: UniApp.RequestOptions) {
  options.url = BASE_URL + options.url;
  return new Promise<IRequestResult>((resolve, reject) => {
    const header = {
      'content-type': 'application/json',
      ...options.header,
    };
    uni.request({
      timeout: TIME_OUT,
      ...options,
      header,
      success: (res) => {
        const data = res.data as IResult;
        if (data.code !== 200) {
          showToast(data.message);
          reject(data);
        } else {
          resolve(data);
        }
      },
      fail: (err) => {
        showToast('系统错误,请稍后重试');
        reject(err);
      },
    });
  });
}

/**
 * 统一GET请求封装
 * @param url
 * @param data
 * @constructor
 */
function GET(url: string, data: Record<string, any> = {}) {
  return request({
    url,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data,
  } as UniApp.RequestOptions);
}

/**
 * 统一POST请求封装
 * @param url
 * @param data
 * @constructor
 */
function POST(url: string, data: Record<string, any> = {}) {
  return request({
    url,
    method: 'POST',
    data,
  } as UniApp.RequestOptions);
}

export { request, GET, POST };
