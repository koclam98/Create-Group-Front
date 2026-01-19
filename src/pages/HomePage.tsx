import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../app/App.css';
import ImageSlider, { type SlideData } from '../features/cast-slider/ImageSlider';
import { meetingService, type Meeting } from '../services/meetingService';

export default function HomePage() {
    const [latestMeeting, setLatestMeeting] = useState<Meeting | null>(null);

    // 기본 슬라이드 데이터 (모임이 없을 경우)
    const defaultSlides: SlideData[] = [
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

    const location = useLocation();
    const state = location.state as { meetingId?: string } | null;

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const data = await meetingService.getAll();
                if (data.length > 0) {
                    // 1. 요청된 meetingId가 있으면 그것을 우선 표시
                    if (state?.meetingId) {
                        const target = data.find((m) => m.id === state.meetingId);
                        if (target) {
                            setLatestMeeting(target);
                            return;
                        }
                    }

                    // 2. 없으면 수정일(updatedAt) 최신순 정렬 후 표시
                    const sorted = [...data].sort(
                        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    );
                    setLatestMeeting(sorted[0]);
                }
            } catch (error) {
                console.error('Failed to fetch meetings:', error);
            }
        };
        fetchMeetings();
    }, [state?.meetingId]);

    // 슬라이드 데이터 생성
    // participants가 undefined/null일 수 있으므로 ?. 연산자 및 Array.isArray 확인
    const slides: SlideData[] =
        latestMeeting && Array.isArray(latestMeeting.participants) && latestMeeting.participants.length > 0
            ? latestMeeting.participants.map((p) => ({
                  image: p.profile?.imageUrl || 'https://via.placeholder.com/250?text=No+Image',
                  title: p.name || '이름 없음',
                  description: p.season ? `${p.season}` : '',
              }))
            : defaultSlides;

    const navigate = useNavigate();

    return (
        <main className="main-content" style={{ justifyContent: 'flex-start', position: 'relative' }}>
            <h1>{latestMeeting ? latestMeeting.title : '환영합니다!'}</h1>
            {/* <p>
                {latestMeeting ? latestMeeting.desc || '모임 설명이 없습니다.' : '모임 만들기 서비스를 이용해보세요.'}
            </p> */}

            <div style={{ width: '100%', maxWidth: '800px' }}>
                {/* slides가 비어있어도 ImageSlider가 에러나지 않도록 체크, 하지만 defaultSlides가 있어서 괜찮음 */}
                <ImageSlider slides={slides} interval={3000} />
            </div>

            <button
                onClick={() => navigate('/list')}
                style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1.4rem',
                    color: '#ccc',
                    cursor: 'pointer',
                    zIndex: 10,
                }}
            >
                X
            </button>
        </main>
    );
}
