"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface Screenshot {
  id: number
  url: string
}

interface ScreenshotsProps {
  screenshots: Screenshot[]
}

export function Screenshots({ screenshots }: ScreenshotsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  const goToNextImage = useCallback(() => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex((prevIndex) => {
      // Since we're checking selectedImageIndex !== null above, and this callback
      // is only called after that check, TypeScript should know prevIndex is a number
      // But we'll add an explicit check to satisfy the linter
      return prevIndex !== null 
        ? (prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1)
        : 0
    })
  }, [selectedImageIndex, screenshots.length])

  const goToPrevImage = useCallback(() => {
    if (selectedImageIndex === null) return
    setSelectedImageIndex((prevIndex) => {
      // Same explicit null check for the linter
      return prevIndex !== null
        ? (prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1)
        : 0
    })
  }, [selectedImageIndex, screenshots.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return
      
      switch (e.key) {
        case "ArrowRight":
          goToNextImage()
          break
        case "ArrowLeft":
          goToPrevImage()
          break
        case "Escape":
          closeLightbox()
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLightboxOpen, goToNextImage, goToPrevImage])

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {screenshots.map((screenshot, index) => (
          <div
            key={screenshot.id}
            className="cursor-pointer relative group overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={`https:${screenshot.url.replace("t_thumb", "t_cover_big")}`}
              alt="Game screenshot"
              width={300}
              height={169}
              className="rounded-lg shadow-md group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-quokka-darker/0 group-hover:bg-quokka-darker/40 transition-all duration-300 flex items-center justify-center">
              <span className="text-quokka-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-quokka-purple/80 px-3 py-1 rounded-full text-sm">
                View
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {isLightboxOpen && selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-quokka-darker bg-opacity-95 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 text-quokka-light hover:text-quokka-purple transition-colors z-50"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>
          
          {/* Navigation arrows */}
          <button 
            className="absolute left-4 md:left-8 text-quokka-light hover:text-quokka-purple transition-colors z-50 bg-quokka-darker/50 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              goToPrevImage()
            }}
          >
            <ChevronLeft size={32} />
          </button>
          
          <button 
            className="absolute right-4 md:right-8 text-quokka-light hover:text-quokka-purple transition-colors z-50 bg-quokka-darker/50 p-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              goToNextImage()
            }}
          >
            <ChevronRight size={32} />
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-quokka-darker/70 px-4 py-2 rounded-full text-quokka-light">
            {selectedImageIndex + 1} / {screenshots.length}
          </div>
          
          {/* Main image */}
          <div 
            className="max-w-5xl max-h-[80vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`https:${screenshots[selectedImageIndex].url.replace("t_thumb", "t_1080p")}`}
              alt="Full size screenshot"
              width={1920}
              height={1080}
              className="rounded-lg shadow-xl max-h-[80vh] object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}