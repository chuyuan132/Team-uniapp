import { showNotify } from 'vant';

const BASE_URL = 'http://localhost:8001'
const TIME_OUT = 5000;

interface IResult {
    code: number;
    data: any;
    message: string;
}

/**
 * 异常错误处理
 * @param message
 */
function errorHandler(message: string) {
    showNotify({ type: 'danger', message });

}

/**
 * 请求封装
 * @param options
 */
function request(options: UniApp.RequestOptions) {
    options.url = BASE_URL + options.url;
    return new Promise((resolve, reject) => {
        const header = {
            'content-type': 'application/json',
            ...options.header
        }
        uni.request({
            timeout:TIME_OUT,
            ...options,
            header,
            success: (res) => {
                const data = res.data as IResult;
                if(data.code !== 200) {
                    errorHandler(data.message)
                    reject(data)
                } else {
                    resolve(data)
                }
            },
            fail: (err) => {
                errorHandler('系统错误,请稍后重试')
                reject(err);
            }
        })
    })
}

/**
 * 统一GET请求封装
 * @param url
 * @param data
 * @constructor
 */
function GET(url: string, data: Record<string, any>) {
    return request({
        url,
        method: 'GET',
        data
    } as UniApp.RequestOptions)
}

/**
 * 统一POST请求封装
 * @param url
 * @param data
 * @constructor
 */
function POST(url: string, data: Record<string, any>) {
    return request({
        url,
        method: 'POST',
        data
    } as UniApp.RequestOptions)
}

export {
    request,
    GET,
    POST
};