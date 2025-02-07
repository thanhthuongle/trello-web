import Board from './pages/Boards/_id'
import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'

function App() {

  return (
    <Routes>
      {/* Redirect Route*/}
      <Route path='/' element={
        // ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của Browser
        // Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có. I
        <Navigate to={'/boards/6717ab6cdb1d84f6070c06a8'} replace={true} />
      } />

      {/* Board Details*/}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />}/>
      <Route path='/register' element={<Auth />}/>
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 Not Found Page*/}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App
