import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import dataReducer from './dataSlice.js'
import toastReducer from './toastSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    toast: toastReducer,
  },
})
