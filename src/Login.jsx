
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth } from './firebase'
import './App.css'
function Login() {
  const navigate = useNavigate()

  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    
    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        )
      }

      navigate('/')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError('Incorrect email or password.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password must contain at least 6 characters.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>CivicAgent</h1>

        <h2>
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>

        <p>
          {isRegister
            ? 'Create your account to report civic issues.'
            : 'Login to continue to CivicAgent.'}
        </p>

        <form onSubmit={handleSubmit}>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />

          {isRegister && (
            <>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
            </>
          )}

          {error && (
            <p className="login-error">{error}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : isRegister
                ? 'Create Account'
                : 'Login'}
          </button>

        </form>

        <p className="login-switch">
          {isRegister
            ? 'Already have an account?'
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
          >
            {isRegister ? 'Login' : 'Create Account'}
          </button>
        </p>

        <button
          className="back-home"
          type="button"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>

      </div>
    </div>
  )
}

export default Login
