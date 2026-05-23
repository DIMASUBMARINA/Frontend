import { createSlice } from '@reduxjs/toolkit'

function readStoredUser() {
  try {
    const raw = localStorage.getItem('academy_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: readStoredUser(),
  },
  reducers: {
    setUser(state, { payload }) {
      state.user = payload
      localStorage.setItem('academy_user', JSON.stringify(payload))
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem('academy_user')
      localStorage.removeItem('academy_token')
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer
