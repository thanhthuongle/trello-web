// Board details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardBarContent'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'
// import { mockData } from '~/apis/mock-data'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Sử dụng react-router-dom để lấy id của board sau, tạm thời fic cứng  boardId
    const boardId = '6717ab6cdb1d84f6070c06a8'

    // Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board)
    })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board
