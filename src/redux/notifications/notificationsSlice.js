import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'

// Initialize the value of a Slice in redux
const initialState = {
  currentNotifications: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers• https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationsAPI',
  async () => {
    const response = await authorizedAxiosInstance.get(`${import.meta.env.VITE_API_URL}/invitations`)
    // Note: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)
export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizedAxiosInstance.put(`${import.meta.env.VITE_API_URL}/invitations/board/${invitationId}`, { status })
    return response.data
  }
)

// Initialize a slice in the redux store
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  // Reducers: Where data is processed synchronously
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      // unshift is to add elements to the beginning of the array, the opposite of push
      state.currentNotifications.unshift(incomingInvitation)
    }
  },
  // ExtraReducers: Asynchronous data processing

  extraReducers: (builder) => {
    builder.addCase (fetchInvitationsAPI. fulfilled, (state, action) => {
      let incomingInvitations = action.payload
      // This snippet reverses the received invitations array, simply to display the newest one at the top.
      state.currentNotifications = Array.isArray(incomingInvitations)? incomingInvitations.reverse():[]
    })
    builder.addCase (updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload
      // Update boardInvitation data (inside it will have new Status after update)
      const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitation._id)
      getInvitation.boardInvitation = incomingInvitation.boardInvitation
    })
  }
})

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationsSlice.actions

export const selectCurrentNotifications = state => {
  return state.notifications.currentNotifications
}

export const notificationsReducer = notificationsSlice.reducer
