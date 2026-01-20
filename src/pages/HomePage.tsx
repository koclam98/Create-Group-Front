import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../app/App.css';
import '../styles/common.css';
import './HomePage.css';
import ImageSlider, { type SlideData } from '../features/cast-slider/ImageSlider';
import { meetingService, type Meeting } from '../services/meetingService';

const DEFAULT_SLIDES: SlideData[] = [
    {
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        title: '함께하는 즐거움',
        description: '다양한 사람들과 만나보세요',
    },
    {
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        title: '새로운 경험',
        description: '매일 새로운 모임이 기다립니다',
    },
];

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/250?text=No+Image';

export default function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { meetingId?: string } | null;

    const [latestMeeting, setLatestMeeting] = useState<Meeting | null>(null);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const data = await meetingService.getAll();
                if (data.length === 0) return;

                // 요청된 meetingId가 있으면 우선 표시
                if (state?.meetingId) {
                    const targetMeeting = data.find((m) => m.id === state.meetingId);
                    if (targetMeeting) {
                        setLatestMeeting(targetMeeting);
                        return;
                    }
                }

                // 수정일(updatedAt) 최신순 정렬 후 표시
                const sortedByDate = [...data].sort(
                    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
                );
                setLatestMeeting(sortedByDate[0]);
            } catch (error) {
                console.error('Failed to fetch meetings:', error);
            }
        };
        fetchMeetings();
    }, [state?.meetingId]);

    const slides: SlideData[] = latestMeeting?.participants?.length
        ? latestMeeting.participants.map((p) => ({
              image: p.profile?.imageUrl || PLACEHOLDER_IMAGE,
              title: p.name || '이름 없음',
              description: p.season || '',
          }))
        : DEFAULT_SLIDES;

    const handleClose = () => navigate('/list');

    return (
        <main className="main-content home-main">
            <h1>{latestMeeting ? latestMeeting.title : '환영합니다!'}</h1>

            <div className="home-slider-container">
                <ImageSlider slides={slides} interval={1000} />
            </div>

            <button className="close-button" onClick={handleClose}>
                X
            </button>

            <button
                className="grid-view-button"
                onClick={() => {
                    if (latestMeeting) {
                        window.open('/grid/' + latestMeeting.id, '_blank', 'noopener,noreferrer');
                    }
                }}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    zIndex: 1000,
                }}
            >
                전체 참석자 현황 보기
            </button>
        </main>
    );
}
