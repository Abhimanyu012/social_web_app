import React, { useState, useEffect } from 'react'
import { RefreshCw, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { postAPI } from '../services/api'
import Header from './Header'
import CreatePost from './CreatePost'
import PostCard from './PostCard'
import LoadingSpinner from './LoadingSpinner'
import toast from 'react-hot-toast'

const SocialFeed = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)

  const loadPosts = async () => {
    try {
      const data = await postAPI.getFeed()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
    setShowCreatePost(false)
  }

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ))
  }

  const refreshPosts = async () => {
    setRefreshing(true)
    await loadPosts()
  }

  const getUserInitials = (userName) => {
    if (!userName) return 'U'
    return userName.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div>
        <Header />
        <LoadingSpinner text="Loading your feed..." />
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light">
      <Header />
      
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Create Post Section */}
            <div className="card social-card mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="profile-avatar me-3">
                    {getUserInitials(user?.userName)}
                  </div>
                  <button
                    className="btn btn-outline-secondary flex-grow-1 text-start"
                    onClick={() => setShowCreatePost(true)}
                  >
                    What's on your mind, {user?.userName}?
                  </button>
                  <button
                    className="btn btn-outline-primary ms-2"
                    onClick={() => setShowCreatePost(true)}
                    title="Create Post"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Create Post Form */}
            {showCreatePost && (
              <CreatePost
                onPostCreated={handlePostCreated}
                onClose={() => setShowCreatePost(false)}
              />
            )}

            {/* Refresh Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0 fw-bold">Latest Posts</h3>
              <button
                className="btn btn-outline-primary"
                onClick={refreshPosts}
                disabled={refreshing}
              >
                <RefreshCw size={16} className={`me-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* Posts Feed */}
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <div className="profile-avatar mx-auto large mb-3" style={{ 
                    width: '120px', 
                    height: '120px', 
                    fontSize: '36px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)'
                  }}>
                    📝
                  </div>
                </div>
                <h4 className="fw-bold text-muted">No posts yet</h4>
                <p className="text-muted mb-4">
                  Be the first to share something with the community!
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreatePost(true)}
                >
                  <Plus size={16} className="me-2" />
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onPostUpdate={handlePostUpdated}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialFeed
