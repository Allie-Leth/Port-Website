'use client'

import React, { useEffect, useState } from 'react'

interface TaglinesProps {
  taglines: string[]
  interval?: number
  className?: string
}

export const Taglines: React.FC<TaglinesProps> = ({
  taglines,
  interval = 3000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (taglines.length <= 1) return

    const timer = setInterval(() => {
      setOpacity(0)

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % taglines.length)
        setOpacity(1)
      }, 300)
    }, interval)

    return () => clearInterval(timer)
  }, [taglines.length, interval])

  if (taglines.length === 0) {
    return null
  }

  return (
    <div
      data-testid="taglines-container"
      className={`transition-opacity duration-300 ${className}`}
      style={{ opacity }}
    >
      {taglines[currentIndex]}
    </div>
  )
}
