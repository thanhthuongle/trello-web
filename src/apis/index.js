import axios from 'axios'
import { API_URL } from '~/utils/constants'

/** Board */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_URL}/boards/${boardId}`)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  // const response = await axios.put(`${import.meta.env.VITE_API_URL}/boards/${boardId}`, updateData)
  const response = await axios.put(`${API_URL}/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_URL}/boards/supports/moving_card`, updateData)
  return response.data
}

/** Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_URL}/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_URL}/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_URL}/columns/${columnId}`)
  return response.data
}

/** Card */
export const createNewCardAPI = async (newCardnData) => {
  const response = await axios.post(`${API_URL}/cards`, newCardnData)
  return response.data
}
