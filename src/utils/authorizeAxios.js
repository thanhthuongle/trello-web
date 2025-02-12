import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
  * Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
  * Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
  * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, xcode sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
  * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-comComponent-files
*/
let axiosReduxStore
export const injectStore = _mainStore => { axiosReduxStore = _mainStore }

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

// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích tạo Promise này để khi nào gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó.
// https://www.thedutchlab.com/en/insights/using-axios-interceptors-for-refreshing-your-api-token
let refreshTokenPromise = null

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

  /** Quan trọng: Xử lý Refresh Token tự động */
  // Trường hợp 1: Nếu như nhận mã 401 từ BE, thì gọi api đăng xuất luôn
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
  // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    // Đảm bảo 1 thời điểm chỉ gọi lại api 1 lần trong if else
    originalRequests._retry = true

    // Kiểm tra nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời gán cho cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // Đồng thời accessToken đã nằm trong httpOnly cookie (Xử lý phía BE)
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu nhận bất kỳ lỗi nào từ api refresh token => logout
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // Dù API có Oke hay lỗi thì vẫn luôn gán refreshTokenPromise về giá trị null như ban đầu
          refreshTokenPromise = null
        })
    }

    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      return authorizedAxiosInstance(originalRequests)
    })
  }

  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần: Clean Code)
  // console.log error ra là sẽ thấy cấu trúc data đẫn tới message lỗi như dưới đây
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