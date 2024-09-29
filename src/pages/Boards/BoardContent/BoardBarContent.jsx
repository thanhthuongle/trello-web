import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

const BoardContent = ({ board }) => {
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  const sensors = useSensors( mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng 1 thời điểm chỉ có 1 phần tử được kéo (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnwhenDraggingCard, setOldColumnwhenDraggingCard] = useState(null)

  useEffect( () => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards.map(card => card?._id).includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      // console.log('overCardIndex: ', overCardIndex)

      let newCardIndex
      const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.card?.length + 1

      // console.log('isBelowOverItem: ', isBelowOverItem)
      // console.log('modifier: ', modifier)
      // console.log('newCardIndex: ', newCardIndex)

      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumns = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumns = nextColumns.find(column => column._id === overColumn._id)

      if (nextActiveColumns) {
        nextActiveColumns.cards = nextActiveColumns.cards.filter(card => card._id !== activeDraggingCardId)
        nextActiveColumns.cardOrderIds = nextActiveColumns.cards.map(card => card._id)
      }
      if (nextOverColumns) {
        nextOverColumns.cards = nextOverColumns.cards.filter(card => card._id !== activeDraggingCardId)
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumns._id
        }
        nextOverColumns.cards = nextOverColumns.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        nextOverColumns.cardOrderIds = nextOverColumns.cards.map(card => card._id)
      }

      return nextColumns
    }
    )
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnwhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  const handleDragOver = (event) => {
    // Kh lam gi khi keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Xu ly khi keo card
    // console.log('handleDragOverCard', event)
    const { active, over } = event
    // console.log('active: ', active)
    // console.log('over: ', over)

    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // console.log('activeColumn: ', activeColumn)
    // console.log('overColumn: ', overColumn)

    if (!activeColumn || !overColumn) return

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event

    if (!active || !over) return

    // Xử lý kéo thả card: todo: vẫn còn bug khi kéo thả lần đầu thì stae chưa có data được sort mà mới chỉ có data dạng thô khi fe nhận đc
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {

      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // console.log('activeColumn: ', activeColumn)
      // console.log('overColumn: ', overColumn)

      if (!activeColumn || !overColumn) return

      // console.log('oldColumnwhenDraggingCard: ', oldColumnwhenDraggingCard)
      // console.log('overColumn: ', overColumn)

      if (oldColumnwhenDraggingCard._id !== overColumn._id) {
        // console.log('hành đông kéo thả card giữa 2 column khác nhau')
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // console.log('hành đông kéo thả card trong 1 column')
        const oldCardIndex = oldColumnwhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)


        const dndOrderedCards = arrayMove(oldColumnwhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          return nextColumns
        })
      }
    }

    // Xử lý kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex( c => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex( c => c._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // 2 dòng dưới phục vụ cho việc call api trong tương lai
        // const dndOrderedColumnsIds = dndOrderedColumns.map( c => c._id)
        // console.log('dndOrderedColumns: ', dndOrderedColumns)

        setOrderedColumns(dndOrderedColumns)
      }
    }


    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnwhenDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: 0.5 } }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box px={2} sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>

        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}/>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
