import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = 40, text = 'Loading...' }) => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <Loader2 size={size} className="text-primary animate-spin mb-3" />
        <p className="text-muted mb-0">{text}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
