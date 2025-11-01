import React, { useState } from 'react'
import { Heart, MessageCircle, Send, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { postAPI } from '../services/api'
import toast from 'react-hot-toast'

const PostCard = ({ post, onPostUpdate }) => {
  const { user } = useAuth()
  const [liking, setLiking] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commenting, setCommenting] = useState(false)

  const getUserInitials = (userName) => {
    if (!userName) return 'U'
    return userName.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
    }
  }

  const isLiked = post.likedUsers && post.likedUsers.includes(user.userName)
  const likesCount = post.likesCount || 0
  const commentsCount = post.commentsCount || 0

  const handleLike = async () => {
    if (liking) return

    setLiking(true)
    try {
      const result = await postAPI.likePost(post._id)
      if (result.post) {
        onPostUpdate(result.post)
        const action = isLiked ? 'unliked' : 'liked'
        toast.success(`You ${action} the post`)
      }
    } catch (error) {
      console.error('Error liking post:', error)
      toast.error('Failed to update like')
    } finally {
      setLiking(false)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    
    if (!commentText.trim() || commenting) return

    setCommenting(true)
    try {
      const result = await postAPI.commentOnPost(post._id, commentText.trim())
      if (result.post) {
        onPostUpdate(result.post)
        setCommentText('')
        toast.success('Comment added successfully!')
        if (!showComments) {
          setShowComments(true)
        }
      }
    } catch (error) {
      console.error('Error commenting on post:', error)
      toast.error('Failed to add comment')
    } finally {
      setCommenting(false)
    }
  }

  return (
    <div className="card social-card">
      <div className="card-body p-4">
        {/* Post Header */}
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <div className="profile-avatar me-3">
              {getUserInitials(post.user?.userName)}
            </div>
            <div>
              <h6 className="mb-0 fw-bold">{post.user?.userName || 'Unknown User'}</h6>
              <small className="text-muted">{formatDate(post.createdAt)}</small>
            </div>
          </div>
        </div>

        {/* Post Content */}
        {post.content && (
          <div className="mb-3">
            <p className="post-content mb-0" style={{ fontSize: '16px', lineHeight: '1.5' }}>
              {post.content}
            </p>
          </div>
        )}

        {/* Post Image */}
        {post.image && (
          <div className="mb-3">
            <img
              src={post.image}
              alt="Post content"
              className="post-image"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Engagement Stats */}
        {(likesCount > 0 || commentsCount > 0) && (
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="text-muted small">
              {likesCount > 0 && (
                <span className="me-3">
                  <Heart size={14} className="me-1" />
                  {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </span>
              )}
              {commentsCount > 0 && (
                <span>
                  <MessageCircle size={14} className="me-1" />
                  {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-top pt-2 mb-3">
          <div className="row g-0">
            <div className="col-6">
              <button
                className={`btn w-100 border-0 like-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleLike}
                disabled={liking}
                style={{ 
                  color: isLiked ? '#ef4444' : '#6b7280',
                  fontWeight: '500'
                }}
              >
                <Heart 
                  size={16} 
                  className={`me-2 ${liking ? 'animate-pulse' : ''}`}
                  fill={isLiked ? 'currentColor' : 'none'}
                />
                {isLiked ? 'Liked' : 'Like'}
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn w-100 border-0 comment-btn"
                onClick={() => setShowComments(!showComments)}
                style={{ color: '#6b7280', fontWeight: '500' }}
              >
                <MessageCircle size={16} className="me-2" />
                Comment
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div>
            {/* Add Comment Form */}
            <form onSubmit={handleComment} className="mb-3">
              <div className="d-flex gap-2">
                <div className="profile-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                  {getUserInitials(user.userName)}
                </div>
                <div className="flex-grow-1 position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={commenting}
                    style={{ borderRadius: '20px', paddingRight: '40px' }}
                  />
                  <button
                    type="submit"
                    className="btn position-absolute end-0 top-0 h-100 px-3"
                    disabled={commenting || !commentText.trim()}
                    style={{ 
                      backgroundColor: 'transparent', 
                      border: 'none',
                      color: '#667eea'
                    }}
                  >
                    {commenting ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="d-flex flex-column gap-3">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="d-flex align-items-start">
                    <div className="profile-avatar me-2" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      {getUserInitials(comment.user?.userName)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="bg-light rounded-3 p-3">
                        <h6 className="mb-1 fw-bold small">{comment.user?.userName || 'Unknown User'}</h6>
                        <p className="mb-0 small">{comment.text}</p>
                      </div>
                      <small className="text-muted ms-2">
                        {formatDate(comment.createdAt)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(!post.comments || post.comments.length === 0) && (
              <div className="text-center py-3">
                <div className="text-muted">
                  <MessageCircle size={32} className="mb-2" />
                  <p className="mb-0">No comments yet. Be the first to comment!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard
