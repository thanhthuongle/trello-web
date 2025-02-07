import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 reqquest: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

/**
*Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request & Response)
*https://axios-http.com/docs/interceptors
*/
// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use( (config) => {
  // Do something before request is sent
  // chặn spam click
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use( (response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger

  // chặn spam click
  interceptorLoadingElements(false)

  // Do something with response data
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger

  // chặn spam click
  interceptorLoadingElements(false)

  // Do something with response error
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình. Ngoại trừ mã 410 GONE phục vụ việc tự động refresh lại token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})


export default authorizedAxiosInstance