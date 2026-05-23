import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import * as api from '../api.js'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error,    setError]    = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.register({ ...formData, role: 'student' })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-layout">
      <section className="card auth-copy">
        <h1>Create an account</h1>
        <p>Sign up to start enrolling in courses.</p>
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

        <button className="button button-primary" type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  )
}
