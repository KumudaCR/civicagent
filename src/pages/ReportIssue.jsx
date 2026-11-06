import { useState } from 'react'
import { Camera, MapPin, Upload, Send } from 'lucide-react'
import { analyzeComplaint } from '../ai'
import { db, auth } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import '../App.css'

function ReportIssue() {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)
  const [location, setLocation] = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAIAnalysis() {
    if (!description.trim()) {
      alert('Please describe the issue first')
      return
    }

    try {
      setAiLoading(true)
      const result = await analyzeComplaint(description, location)
      setAiResult(result)
    } catch (error) {
      console.error(error)
      alert('AI analysis failed. Check Firebase AI Logic setup.')
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!auth.currentUser) {
      alert('Please login before submitting a complaint.')
      return
    }

    try {
      setLoading(true)

      const complaintId =
        'CA' + Date.now().toString().slice(-6)

      await addDoc(collection(db, 'complaints'), {
        complaintId,
        category,
        description,
        location,
        status: 'Submitted',
        userId: auth.currentUser.uid,
        aiAnalysis: aiResult || '',
        createdAt: serverTimestamp()
      })

      alert(
        `Complaint submitted successfully!\nYour Complaint ID is: ${complaintId}`
      )

      setDescription('')
      setCategory('')
      setImage(null)
      setLocation('')
      setAiResult(null)
    } catch (error) {
      console.error(error)
      alert('Complaint submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="report-page">
      <div className="report-heading">
        <h1>Report a Civic Issue</h1>
        <p>Help us make your city cleaner, safer and better.</p>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <label>Issue Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select an issue</option>
          <option value="Garbage">Garbage</option>
          <option value="Pothole">Road Pothole</option>
          <option value="Water">Water Leakage</option>
          <option value="Streetlight">Streetlight Problem</option>
          <option value="Drainage">Drainage Problem</option>
          <option value="Other">Other</option>
        </select>

        <label>Describe the Issue</label>
        <textarea
          placeholder="Explain the problem you noticed..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            setAiResult(null)
          }}
          required
          rows="5"
        />

        <button
          type="button"
          onClick={handleAIAnalysis}
          disabled={aiLoading}
        >
          {aiLoading ? 'Analyzing...' : '🤖 Analyze with AI'}
        </button>

        {aiResult && (
  <div className="ai-analysis">
    <h2>🤖 AI Complaint Analysis</h2>

    <div className="analysis-grid">

      <div className="analysis-card">
        <span className="analysis-label">Department</span>
        <h3>{aiResult.department}</h3>
      </div>

      <div className="analysis-card">
        <span className="analysis-label">Priority</span>
        <span className={`priority-badge ${aiResult.priority?.toLowerCase()}`}>
          {aiResult.priority}
        </span>
      </div>

      <div className="analysis-card">
        <span className="analysis-label">Category</span>
        <h3>{aiResult.category}</h3>
      </div>

      <div className="analysis-card">
        <span className="analysis-label">Issue</span>
        <p>{aiResult.issue}</p>
      </div>

      <div className="analysis-card">
        <span className="analysis-label">Priority Reason</span>
        <p>{aiResult.priorityReason}</p>
      </div>

      <div className="analysis-card action-card">
        <span className="analysis-label">Suggested Action</span>
        <p>{aiResult.suggestedAction}</p>
      </div>

    </div>
  </div>
)}

        <label>Upload an Image</label>
        <div className="upload-area">
          <Upload size={30} />
          <p>Choose a photo of the civic issue</p>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {image && <p>{image.name}</p>}
        </div>

        <label>Issue Location</label>
        <div className="location-input">
          <MapPin size={20} />
          <input
            type="text"
            placeholder="Enter area or address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-report"
          disabled={loading}
        >
          <Send size={18} />
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  )
}

export default ReportIssue