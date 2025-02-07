// Board details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardBarContent'
import { useEffect } from 'react'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
// import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const Board = () => {
  const dispath = useDispatch()
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()

  useEffect(() => {
    // Sử dụng react-router-dom để lấy id của board sau, tạm thời fix cứng  boardId
    // const boardId = '6717ab6cdb1d84f6070c06a8'

    // Call API
    dispath(fetchBoardDetailsAPI(boardId))
  }, [dispath, boardId])

  // Gọi API và xử lý sau khi kéo thả xong xuôi
  const moveColumns = (dndOrderedColumns) => {
    //update chuẩn dữ liệu cho state board
    const dndOrderedColumnsIds = dndOrderedColumns.map( c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispath(updateCurrentActiveBoard(newBoard))
    // setBoard(newBoard)

    //gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardsInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispath(updateCurrentActiveBoard(newBoard))
    // setBoard(newBoard)

    // goi api
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /**
  * Khi di chuyển card sang Column khác:
  * B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
  * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
  * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
  *=> Làm một API support riêng.
  */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    //update chuẩn dữ liệu cho state board
    const dndOrderedColumnsIds = dndOrderedColumns.map( c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispath(updateCurrentActiveBoard(newBoard))
    // setBoard(newBoard)

    //gọi API
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption='Loading Board...' />
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}

        moveColumns={moveColumns}
        moveCardsInTheSameColumn={moveCardsInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
