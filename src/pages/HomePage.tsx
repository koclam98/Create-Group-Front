import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../app/App.css';
import ImageSlider, { type SlideData } from '../features/cast-slider/ImageSlider';
import { getParticipants } from '../utils/storage';

function HomePage() {
    const [slides, setSlides] = useState<SlideData[]>([]);

    useEffect(() => {
        const participants = getParticipants();
        const mappedSlides: SlideData[] = participants.map((p) => ({
            image: p.profileImage || 'https://via.placeholder.com/500?text=No+Image', // Enhanced placeholder
            title: `${p.season} ${p.name}`,
            description: p.phone, // Using phone as description since we don't have other text
        }));
        setSlides(mappedSlides);
    }, []);

    return (
        <div className="app">
            <main className="main-content">
                <h1>솔로 지옥 4기</h1>
                <ImageSlider slides={slides} interval={2000} />
                <div style={{ marginTop: '2rem' }}>
                    <Link to="/list">
                        <button>목록 보기</button>
                    </Link>
                </div>
            </main>
            <footer className="footer">
                <p>Copyright © 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default HomePage;
