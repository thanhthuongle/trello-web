import axios from 'axios'

/** Board */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/boards/${boardId}`)
  return response.data
}

/** Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/columns`, newColumnData)
  return response.data
}

/** Card */
export const createNewCardAPI = async (newCardnData) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/cards`, newCardnData)
  return response.data
}
