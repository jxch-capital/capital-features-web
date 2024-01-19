// api.ts
import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: '/dev', // API 的 base_url
    timeout: 500000, // 请求超时时间
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json;charset=utf-8'}
})

// request 拦截器
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // 这里可以添加一些请求前的操作
        return config
    },
    (error: any) => {
        // 处理请求错误
        console.log(error)
        return Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => {
        // 处理响应错误
        console.log('err' + error)
        return Promise.reject(error)
    }
)

export default service


export const heatmapTableApi = (params: Object) => service.post(`/market_/heatmapTable`, JSON.stringify(params))
export const allStockPoolApi = (params: Object) => service.post(`/stock_pool_/all`, JSON.stringify(params))
export const kDashByPoolApi = (params: Object) => service.post(`/stock_pool_/k_dash_by_pool`, JSON.stringify(params))



