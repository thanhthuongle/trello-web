import axios from 'axios'

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/boards/${boardId}`)
  return response.data
}
