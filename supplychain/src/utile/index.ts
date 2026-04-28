import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// 1. 定义统一的响应结构 (后端返回的样子)
export interface ResponseData<T = any> {
  code: number
  data: T
  msg: string
}

// 2. 定义我们自己的请求实例接口
// 这个接口不继承 AxiosInstance，而是重新定义所有调用方式，确保返回类型都是 Promise<ResponseData<T>>
interface CustomRequestInstance {
  // 支持直接调用: request({ url, method... })
  <T = any>(config: AxiosRequestConfig): Promise<ResponseData<T>>
  
  // 支持命名方法: request.get(url, config...)
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ResponseData<T>>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData<T>>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData<T>>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ResponseData<T>>
  
  // 兼容 Axios 原生属性（如拦截器），但不暴露复杂的原生类型以免冲突
  interceptors: {
    request: typeof axios.interceptors.request
    response: typeof axios.interceptors.response
  }
}

// 3. 创建实例并强制断言为我们的自定义接口
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}) as any as CustomRequestInstance

// 4. 请求拦截器
// 注意：拦截器的 config 类型通常需要用 InternalAxiosRequestConfig
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    console.error('请求错误:', error)
    ElMessage.error('网络请求失败')
    return Promise.reject(error)
  }
)

// 5. 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as ResponseData
    
    // 统一判断成功状态码 (假设 200 为成功，请根据后端实际调整)
    if (res.code !== 1) {
      ElMessage.error(res.msg || '请求失败')
      
      // 处理特定错误码，如登录过期
      if (res.code === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      
      // 抛出错误，进入 catch 块
      return Promise.reject(new Error(res.msg || '请求失败'))
    }

    return res as any
  },
  (error: AxiosError) => {
    let message = '网络异常'
    
    if (error.response) {
      switch (error.response.status) {
        case 400: message = '请求参数错误'; break
        case 401: 
          message = '未授权，请重新登录'
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403: message = '拒绝访问'; break
        case 404: message = '请求资源不存在'; break
        case 500: message = '服务器内部错误'; break
        case 502: message = '网关错误'; break
        case 503: message = '服务不可用'; break
        case 504: message = '网关超时'; break
        default: message = `连接错误${error.response.status}`
      }
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时'
    } else if (error.code === 'ERR_NETWORK') {
      message = '网络连接失败'
    }
    
    ElMessage.error(message)
    console.error('响应错误:', error)
    
    return Promise.reject(error)
  }
)

// 6. 导出 http 工具对象 (可选，方便喜欢 http.get 写法的人)
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ResponseData<T>> {
    return request.get<T>(url, config)
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData<T>> {
    return request.post<T>(url, data, config)
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData<T>> {
    return request.put<T>(url, data, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ResponseData<T>> {
    return request.delete<T>(url, config)
  },
  upload<T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<ResponseData<T>> {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 7. 默认导出 request 实例
export default request