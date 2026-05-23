import { createSlice } from '@reduxjs/toolkit'

let _id = 0

const toastSlice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    addToast(state, action) {
      state.items.push(action.payload)
    },
    removeToast(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
  },
})

export const { addToast, removeToast } = toastSlice.actions
export default toastSlice.reducer

export function showToast(message, type = 'success', duration = 4000) {
  return (dispatch) => {
    const id = ++_id
    dispatch(addToast({ id, message, type }))
    setTimeout(() => dispatch(removeToast(id)), duration)
    return id
  }
}
