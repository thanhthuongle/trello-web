import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { toast } from 'react-toastify'
// import { API_URL } from '~/utils/constants'

/** Board */
// Đã move sang redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${import.meta.env.VITE_API_URL}/boards/${boardId}`)
//   return response.data
// }

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${import.meta.env.VITE_API_URL}/boards/${boardId}`, updateData)
  // const response = await authorizedAxiosInstance.put(`${API_URL}/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${import.meta.env.VITE_API_URL}/boards/supports/moving_card`, updateData)
  return response.data
}

/** Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${import.meta.env.VITE_API_URL}/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${import.meta.env.VITE_API_URL}/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${import.meta.env.VITE_API_URL}/columns/${columnId}`)
  return response.data
}

/** Card */
export const createNewCardAPI = async (newCardnData) => {
  const response = await authorizedAxiosInstance.post(`${import.meta.env.VITE_API_URL}/cards`, newCardnData)
  return response.data
}

/** Users */
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${import.meta.env.VITE_API_URL}/users/register`, data)
  toast.success ('Account created successfully! Please check and verify your account before logging in!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${import.meta.env.VITE_API_URL}/users/verify`, data)
  toast.success ('Account verified successfully! Now you can login to enjoy our services! Have a goodday!', { theme: 'colored' })
  return response.data
}
