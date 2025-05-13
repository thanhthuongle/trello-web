import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { notificationsReducer } from './notifications/notificationsSlice'

/**
  * Cấu hình redux-persist
  * https://www.npmjs.com/package/redux-persist
  * Bài viết hướng dẫn này dễ hiểu hơn:
  * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
*/
import { combineReducers } from 'redux' // Lưu ý chúng ta có sẵn redux trong node_module bởi vì khi cài redux/toolkit là đã có sẵn luôn
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
// Cấu hình persist
const rootPersistConfig = {
  key: 'root', // key của cái persist do chúng ta chỉ định, mặc định là root
  storage: storage, // Biến storage ở trên - lưu vào localstorage
  whitelist: ['user'] // Định nghĩa cái slide dữ liệu ĐƯỢC PHÉP duy trì qua mõi lần f5 trình duyệt
  // blacklist: ['user'] // Định nghã các slide KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
}

// Combine các reducers trong dự án ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer
})

// Thực hiện persist Reducer
const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  // Fix warning error was implement redux-persist
  // https://stackoverflow.com/a/63244831/8324172
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
