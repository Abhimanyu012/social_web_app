import React, { useState } from 'react'
import { Camera, Send, X, Image, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { postAPI } from '../services/api'
import LoadingSpinner from './LoadingSpinner'
import toast from 'react-hot-toast'

const CreatePost = ({ onPostCreated, onClose }) => {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim() && !image.trim()) {
      toast.error('Please provide either content or an image')
      return
    }

    setLoading(true)
    try {
      const result = await postAPI.createPost(content.trim(), image.trim())
      if (result.post) {
        toast.success('Post created successfully!')
        onPostCreated(result.post)
        setContent('')
        setImage('')
        setImagePreview('')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const imageUrl = e.target.value
    setImage(imageUrl)
    setImagePreview(imageUrl)
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  const clearImage = () => {
    setImage('')
    setImagePreview('')
  }

  const getUserInitials = (userName) => {
    if (!userName) return 'U'
    return userName.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="card social-card">
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div className="profile-avatar me-3">
              {getUserInitials(user?.userName)}
            </div>
            <div>
              <h6 className="mb-0 fw-bold">{user?.userName}</h6>
              <small className="text-muted">Creating a post</small>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
            disabled={loading}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control border-0"
              rows="3"
              placeholder="What's on your mind?"
              value={content}
              onChange={handleContentChange}
              style={{ 
                resize: 'none', 
                fontSize: '16px',
                backgroundColor: '#f8f9fa'
              }}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <Image size={16} />
              </span>
              <input
                type="url"
                className="form-control"
                placeholder="Image URL (optional)"
                value={image}
                onChange={handleImageChange}
                disabled={loading}
              />
            </div>
            <small className="text-muted">
              Add an image URL to include a photo in your post
            </small>
          </div>

          {imagePreview && (
            <div className="mb-3">
              <div className="position-relative">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="img-fluid post-image"
                  style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                  onError={() => {
                    setImagePreview('')
                    toast.error('Failed to load image')
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                  onClick={clearImage}
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                disabled={loading}
              >
                <Camera size={16} className="me-1" />
                Photo
              </button>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || (!content.trim() && !image.trim())}
            >
              {loading ? (
                <div className="d-flex align-items-center">
                  <Loader2 size={16} className="me-2 animate-spin" />
                  Posting...
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <Send size={16} className="me-2" />
                  Post
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
