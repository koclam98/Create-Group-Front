import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const data = await meetingService.getAll();
                // 최신 순으로 정렬 (생성일 기준 내림차순 가정, 혹은 배열의 마지막 요소가 최신이라면 reverse 필요)
                // 여기서는 API가 최신순 혹은 생성순으로 준다고 가정하고, 가장 마지막에 생성된 것을 보여주거나 첫번째 것을 보여줍니다.
                // 보통 배열의 끝에 추가되므로 reverse() 하여 첫번째를 가져오거나,
                // DB에서 정렬되어 오지 않는다면 클라이언트에서 정렬.
                // 일단 간단히 배열의 맨 마지막 요소를 최신으로 간주하겠습니다. (목록 조회시 보통 생성순)
                if (data.length > 0) {
                    // id가 string이므로 정확한 날짜 비교가 어렵다면 createdAt을 써야 하는데 Meeting 타입에 createdAt이 있음.
                    // 안전하게 createdAt 내림차순 정렬
                    const sorted = [...data].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    setLatestMeeting(sorted[0]);
                }
            } catch (error) {
                console.error('Failed to fetch meetings:', error);
            }
        };
        fetchMeetings();
    }, []);

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
        <main className="main-content" style={{ justifyContent: 'center', position: 'relative' }}>
            <h1>{latestMeeting ? latestMeeting.title : '환영합니다!'}</h1>
            {/* <p>
                {latestMeeting ? latestMeeting.desc || '모임 설명이 없습니다.' : '모임 만들기 서비스를 이용해보세요.'}
            </p> */}

            <div style={{ marginTop: '2rem', marginBottom: '2rem', width: '100%', maxWidth: '800px' }}>
                {/* slides가 비어있어도 ImageSlider가 에러나지 않도록 체크, 하지만 defaultSlides가 있어서 괜찮음 */}
                <ImageSlider slides={slides} interval={3000} />
            </div>

            <button
                onClick={() => navigate('/list')}
                style={{
                    position: 'absolute',
                    bottom: '2rem',
                    right: '2rem',
                    padding: '0.8rem 1.5rem',
                    backgroundColor: 'var(--c-accent)',
                    color: 'var(--c-bg)',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                }}
            >
                돌아가기
            </button>
        </main>
    );
}
