import { useState, useEffect, useCallback } from "react";
import "../css/Carousel.css";
import img1 from "../img/gymImage-1.jpg";
import img2 from "../img/gymImage-2.jpg";
import img3 from "../img/gymImage-3.jpg";
import img4 from "../img/gymImage-4.jpg";

// 1. TypeScript Interfaces
export interface CarouselImage {
  id: string;
  src: string;
  description: string;
  caption?: string;
}

interface CarouselProps {
  images?: CarouselImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

// 2. Embedded Mock Image Dataset
export const mockCarouselImages: CarouselImage[] = [
  {
    id: "img-1",
    src: img4,
    description: "Your quest for a healthy lifestyle is about to start.",
    caption: "Welcome to GymQuest",
  },
  {
    id: "img-2",
    src: img2,
    description: "Work with trained professionals and routines made for you!",
    caption: "Conquer your strength and go beyond your limits",
  },
  {
    id: "img-3",
    src: img1,
    description: "Choose the routines that best align with your fitness goals.",
    caption: "Train at your own pace. Train your way",
  },
  {
    id: "img-4",
    src: img3,
    description: "Get quality feedback and see your fitness journey.",
    caption: "Team work makes the dream work out!",
  },
];

// 3. Carousel Component
export function Carousel({
  images = mockCarouselImages, // Falls back to mock data if no props passed
  autoPlay = false,
  autoPlayInterval = 3000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = useCallback((): void => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  }, [images.length]);

  const handlePrev = (): void => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleDotClick = (index: number): void => {
    setCurrentIndex(index);
  };

  // AutoPlay Management
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, handleNext, images.length]);

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext]);

  // Defensive Rendering Fallback
  if (!images || images.length === 0) {
    return (
      <div className="carousel-fallback">
        <p>No images available. Please provide a valid array.</p>
      </div>
    );
  }

  return (
    <div className="carousel-container" aria-label="Image Carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image) => (
          <div className="carousel-slide" key={image.id}>
            <img src={image.src} loading="lazy" />
            {image.caption && (
              <div className="carousel-caption-overlay">
                <h3>{image.caption}</h3>
                <p>{image.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Slide Navigation Controls */}
      <button
        className="carousel-btn prev"
        onClick={handlePrev}
        aria-label="Previous Slide"
      >
        &#10094;
      </button>
      <button
        className="carousel-btn next"
        onClick={handleNext}
        aria-label="Next Slide"
      >
        &#10095;
      </button>

      {/* Positional Indicators */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
