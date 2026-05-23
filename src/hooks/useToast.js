import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { showToast } from '../store/toastSlice.js'

export function useToast() {
  const dispatch = useDispatch()
  return useCallback(
    (message, type = 'success', duration = 4000) =>
      dispatch(showToast(message, type, duration)),
    [dispatch],
  )
}
