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

  // 2. Login via verified Google Credential (JWT)
  const loginWithGoogleCredential = async (credential, payload) => {
    setLoading(true)
    try {
      const googlePayload = {
        credential,
        googleSub: payload.sub,
        email: payload.email,
        email_verified: payload.email_verified,
        name: payload.name || payload.email.split('@')[0],
        avatar: payload.picture || '',
      }

      const res = await api.authGoogle(googlePayload)
      if (res && res.success && res.user) {
        const loggedUser = {
          ...res.user,
          googleSub: payload.sub,
          isAdmin: res.isAdmin || res.user.role === 'ADMIN',
          avatar: payload.picture || res.user.avatar || '',
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
        return { success: false, error: res?.message || 'Google identity verification failed.' }
      }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // 3. Login with Email & Password
  const loginWithPassword = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.loginWithPassword(email.toLowerCase().trim(), password)
      if (res && res.success && res.user) {
        const loggedUser = {
          ...res.user,
          isAdmin: res.isAdmin || res.user.role === 'ADMIN',
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
        return { success: false, error: res?.message || 'Invalid email or password.' }
      }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // 4. Register with Email & Password
  const registerWithPassword = async (email, password, name) => {
    setLoading(true)
    try {
      const res = await api.registerWithPassword(email.toLowerCase().trim(), password, name)
      if (res && res.success && res.user) {
        const loggedUser = {
          ...res.user,
          isAdmin: res.isAdmin || res.user.role === 'ADMIN',
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
        return { success: false, error: res?.message || 'Registration failed.' }
      }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // 5. Logout
  const logout = () => {
    setUser(null)
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(SESSION_KEY)
  }

  // 6. Trigger Auth Modal with optional callback
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
        loginWithGoogleCredential,
        loginWithPassword,
        registerWithPassword,
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
