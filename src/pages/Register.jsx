import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useToast } from '../hooks/useToast.js'
import * as api from '../api.js'

export default function Register() {
  const navigate = useNavigate()
  const toast    = useToast()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.register({ ...formData, role: 'student' })
      navigate('/login', { replace: true })
    } catch (err) {
      toast(err.message, 'error')
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

        <button className="button button-primary" type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  )
}
