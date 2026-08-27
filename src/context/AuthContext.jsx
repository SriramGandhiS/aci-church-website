import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)
const SESSION_KEY = 'aci_auth_session_v1'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authCallback, setAuthCallback] = useState(null)

  // 1. Initial Load: Restore user session from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.email) {
          setUser(parsed)
        }
      }
    } catch (e) {
      console.warn('Failed to restore session:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  // 2. Request OTP
  const requestOtp = async (email) => {
    try {
      const res = await api.requestEmailOtp(email)
      return res
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // 3. Verify OTP & Authenticate
  const verifyOtp = async (email, otp, name) => {
    setLoading(true)
    try {
      const res = await api.verifyEmailOtp(email, otp, name)
      if (res && res.success && res.user) {
        const loggedUser = {
          ...res.user,
          isAdmin: res.isAdmin || res.user.role === 'ADMIN'
        }
        setUser(loggedUser)
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser))
        localStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser))

        setIsAuthModalOpen(false)
        if (authCallback) {
          authCallback(loggedUser)
          setAuthCallback(null)
        }
        return { success: true, user: loggedUser }
      } else {
        return { success: false, error: res?.message || 'Invalid verification code.' }
      }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // 4. Direct Google Login fallback
  const loginWithGoogle = async (googlePayload) => {
    setLoading(true)
    try {
      const res = await api.authGoogle(googlePayload)
      if (res && res.success && res.user) {
        const loggedUser = {
          ...res.user,
          isAdmin: res.isAdmin || res.user.role === 'ADMIN'
        }
        setUser(loggedUser)
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser))
        localStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser))

        setIsAuthModalOpen(false)
        if (authCallback) {
          authCallback(loggedUser)
          setAuthCallback(null)
        }
        return { success: true, user: loggedUser }
      } else {
        return { success: false, error: res?.message || 'Authentication failed.' }
      }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // 3. Logout
  const logout = () => {
    setUser(null)
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(SESSION_KEY)
  }

  // 4. Trigger Auth Modal with optional callback
  const requireAuth = (callback) => {
    if (user) {
      if (callback) callback(user)
      return true
    }
    setAuthCallback(() => callback)
    setIsAuthModalOpen(true)
    return false
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
    setAuthCallback(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: !!user?.isAdmin,
        requestOtp,
        verifyOtp,
        loginWithGoogle,
        logout,
        requireAuth,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
