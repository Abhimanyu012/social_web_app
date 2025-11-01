import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  signup: async (userName, email, password) => {
    const response = await api.post('/auth/signup', { userName, email, password })
    return response.data
  },
}

export const postAPI = {
  createPost: async (content, image) => {
    const response = await api.post('/posts', { content, image })
    return response.data
  },
  
  getFeed: async () => {
    const response = await api.get('/posts/feed')
    return response.data
  },
  
  likePost: async (postId) => {
    const response = await api.put(`/posts/${postId}/like`)
    return response.data
  },
  
  commentOnPost: async (postId, text) => {
    const response = await api.post(`/posts/${postId}/comment`, { text })
    return response.data
  },
}

export default api
