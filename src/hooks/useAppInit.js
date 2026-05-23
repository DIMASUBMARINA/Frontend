import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCourses, setTeachers, setCategories, setEnrollments, clearEnrollments } from '../store/dataSlice.js'
import * as api from '../api.js'

export function useAppInit() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  
  useEffect(() => {
    api.getCourses().then(data    => dispatch(setCourses(data)))
    api.getTeachers().then(data   => dispatch(setTeachers(data)))
    api.getCategories().then(data => dispatch(setCategories(data)))
  }, [dispatch])

  useEffect(() => {
    if (user?.id) {
      api.getEnrollments(user.id).then(data => dispatch(setEnrollments(data)))
    } else {
      dispatch(clearEnrollments())
    }
  }, [user, dispatch])
}
