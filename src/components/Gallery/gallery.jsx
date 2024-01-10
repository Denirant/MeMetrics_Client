import React, { useState, useEffect } from 'react';
import './index.css'

const Carousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const id = setInterval(async () => {
      await setCurrentImageIndex(prevIndex =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);
    setIntervalId(id);

    return () => {
      clearInterval(id);
    };
  }, [images]);

  const handleIndicatorClick = async(newIndex) => {
    await setCurrentImageIndex(newIndex);
    await clearInterval(intervalId);
    const id = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);
    await setIntervalId(id);
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        <img
          className="carousel-image"
          src={images[currentImageIndex]}
          alt={`${currentImageIndex + 1}`}
        />
        <div className="indicators">
          {images.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleIndicatorClick(index)}
            >
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;