import axios from 'axios'

/** Board */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/boards/${boardId}`)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${import.meta.env.VITE_API_URL}/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${import.meta.env.VITE_API_URL}/boards/supports/moving_card`, updateData)
  return response.data
}

/** Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${import.meta.env.VITE_API_URL}/columns/${columnId}`, updateData)
  return response.data
}

/** Card */
export const createNewCardAPI = async (newCardnData) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/cards`, newCardnData)
  return response.data
}
