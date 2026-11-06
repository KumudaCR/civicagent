import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAI, GoogleAIBackend } from 'firebase/ai'

const firebaseConfig = {
  apiKey: "AIzaSyC3lNSWPttjMCTiCGQ115G3LnqxN31b7fo",
  authDomain: "civicagent-befd7.firebaseapp.com",
  projectId: "civicagent-befd7",
  storageBucket: "civicagent-befd7.firebasestorage.app",
  messagingSenderId: "950156041955",
  appId: "1:950156041955:web:93ece094136c4538a02fd6"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Initialize Firebase AI Logic
export const ai = getAI(app, {
  backend: new GoogleAIBackend()
})