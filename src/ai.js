import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { app } from './firebase'

const ai = getAI(app, {
  backend: new GoogleAIBackend()
})

const model = getGenerativeModel(ai, {
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: 'application/json'
  }
})

export async function analyzeComplaint(description, location = '') {
  try {
    const prompt = `
You are CivicAgent, an intelligent civic complaint assistant.

Analyze this civic issue.

Description: ${description}
Location: ${location || 'Not provided'}

Return a JSON object with:
department, category, issue, formalComplaint,
priority, priorityReason, suggestedAction.

Choose department:
Roads Department,
Water Supply Department,
Sanitation Department,
Electrical Department,
Drainage Department,
Public Safety Department,
Other Department.

Priority:
Critical = immediate danger.
High = major hazard.
Medium = moderate inconvenience.
Low = minor issue.

Do not invent facts.
`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    if (!responseText) {
      throw new Error('Gemini returned an empty response')
    }

    return JSON.parse(responseText)

  } catch (error) {
    console.error('CivicAgent AI error:', error)
    throw error
  }
}