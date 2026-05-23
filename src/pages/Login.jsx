import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/authSlice.js'
import * as api from '../api.js'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error,    setError]    = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await api.login({ email: formData.email, password: formData.password })
      localStorage.setItem('academy_token', data.token)
      dispatch(setUser(data.user))

      if (data.user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {  
        const from = location.state?.from
        navigate(from ?? '/my-courses', { replace: true })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-layout">
      <section className="card auth-copy">
        <h1>Log in to account</h1>
        <p>Sign in to your account.</p>
      </section>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            placeholder="student@academy.dev"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            placeholder="password123"
            required
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && <div className="message-banner">{error}</div>}

        <button className="button button-primary" type="submit">Log In</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  )
}
