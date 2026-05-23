import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '../store/toastSlice.js'

export default function ToastContainer() {
  const toasts   = useSelector((state) => state.toast.items)
  const dispatch = useDispatch()

  if (!toasts.length) return null

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-message">{t.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => dispatch(removeToast(t.id))}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
