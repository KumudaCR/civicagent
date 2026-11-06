import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom'

import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'

import { auth, db } from './firebase'
import ReportIssue from './pages/ReportIssue'
import Login from './Login'
import './App.css'

function Home() {
  const [searchId, setSearchId] = useState('')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleTrack() {
    const enteredId = searchId.trim().toUpperCase()

    if (!enteredId) {
      setMessage('Please enter your Complaint ID.')
      setResult(null)
      return
    }

    const user = auth.currentUser

    if (!user) {
      setMessage('Please login to track your complaint.')
      setResult(null)
      return
    }

    try {
      setLoading(true)
      setResult(null)
      setMessage('Searching Firestore...')

      // Get complaints belonging to the logged-in user
      const q = query(
        collection(db, 'complaints'),
        where('userId', '==', user.uid)
      )

      const snapshot = await getDocs(q)

      // Match the actual Firestore field: complaintId
      const foundDoc = snapshot.docs.find((doc) => {
        const data = doc.data()

        const storedId = String(data.complaintId || '')
          .trim()
          .toUpperCase()

        return storedId === enteredId
      })

      if (foundDoc) {
        const data = foundDoc.data()

        setResult({
          ...data,
          id: data.complaintId
        })

        setMessage('Complaint found successfully!')
        console.log('Complaint found:', data)
      } else {
        setMessage(
          'Complaint ID not found. Please check your Complaint ID.'
        )

        console.log('Entered Complaint ID:', enteredId)

        console.log(
          'Available Complaint IDs:',
          snapshot.docs.map(doc => doc.data().complaintId)
        )
      }

    } catch (error) {
      console.error('Tracking error:', error)

      if (error.code === 'permission-denied') {
        setMessage(
          'Permission denied. Check your Firestore Security Rules.'
        )
      } else {
        setMessage(
          'Error connecting to Firestore: ' + error.message
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">
          Civic<span>Agent</span>
        </h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/report">Report Issue</Link>
          <a href="#track">Track Complaint</a>
          <a href="#about">About</a>
        </div>

        <Link to="/login" className="login-btn">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="tagline">
            SMART CITY • SMARTER SOLUTIONS
          </p>

          <h1>
            Making Our Cities
            <span> Better Together.</span>
          </h1>

          <p className="hero-description">
            Report civic problems, track complaints, and help
            build a cleaner, safer and smarter city.
          </p>

          <div className="hero-buttons">
            <Link to="/report" className="primary-btn">
              Report an Issue
            </Link>

            <a href="#track" className="secondary-btn">
              Track Complaint
            </a>
          </div>
        </div>

        <div className="hero-card">
          <div className="city-icon">🏙️</div>
          <h3>Your City. Your Voice.</h3>
          <p>
            Every complaint matters. Together, we can make
            a difference.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="about">
        <h2>How CivicAgent Works</h2>

        <div className="feature-container">
          <div className="feature-card">
            <div className="feature-icon">📢</div>
            <h3>Report Issues</h3>
            <p>
              Report potholes, garbage, water leaks and other
              civic problems.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Analysis</h3>
            <p>
              AI helps identify, categorize and prioritize complaints.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Track Progress</h3>
            <p>
              Follow your complaint and stay updated on its status.
            </p>
          </div>
        </div>
      </section>

      {/* Track Complaint Section */}
      <section className="track-section" id="track">
        <h2>Track Your Complaint</h2>

        <p>
          Enter your complaint ID to check its current status.
        </p>

        <div className="track-form">
          <input
            type="text"
            placeholder="Enter Complaint ID"
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value)
              setMessage('')
              setResult(null)
            }}
          />

          <button
            onClick={handleTrack}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>

        {message && <p>{message}</p>}

        {/* Complaint Result */}
        {result && (
          <div className="track-result">
            <h3>Complaint Details</h3>

            <p>
              <strong>ID:</strong> {result.complaintId}
            </p>

            <p>
              <strong>Category:</strong> {result.category}
            </p>

            <p>
              <strong>Description:</strong> {result.description}
            </p>

            <p>
              <strong>Location:</strong> {result.location}
            </p>

            <p>
              <strong>Status:</strong> {result.status}
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer>
        <h3>CivicAgent</h3>
        <p>
          Building smarter cities through citizen participation.
        </p>
        <p>
          © 2026 CivicAgent. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App