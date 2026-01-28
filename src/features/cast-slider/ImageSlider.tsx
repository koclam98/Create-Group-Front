import { useState, useEffect } from 'react';
import './ImageSlider.css';

export interface SlideData {
    image: string;
    title: string;
    position: string;
    description: string;
}

interface ImageSliderProps {
    slides: SlideData[];
    interval?: number;
}

const ImageSlider = ({ slides, interval = 2000 }: ImageSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, interval);

        return () => clearInterval(timer);
    }, [slides.length, interval]);

    return (
        <div className="slider-container">
            <div className="slider-wrapper">
                {slides.map((slide, index) => (
                    <div key={index} className={`slide ${index === currentIndex ? 'active' : ''}`}>
                        <img src={slide.image} alt={slide.title} />
                        <div className="slide-text-overlay">
                            <h2 className="slide-title">{slide.title}</h2>
                            <h3 className="slide-position">{slide.position}</h3>
                            <p className="slide-description">{slide.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="slider-indicators">
                {slides.map((_, index) => (
                    <span key={index} className={`indicator ${index === currentIndex ? 'active' : ''}`} />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
