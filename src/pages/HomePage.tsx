import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../app/App.css';
import '../styles/common.css';
import './HomePage.css';
import ImageSlider, { type SlideData } from '../features/cast-slider/ImageSlider';
import { useMeetingList } from '../hooks/useMeetingList';

const DEFAULT_SLIDES: SlideData[] = [
    {
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        title: '함께하는 즐거움',
        position: '사원',
        description: '다양한 사람들과 만나보세요',
    },
    {
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
        title: '새로운 경험',
        position: '사원',
        description: '매일 새로운 모임이 기다립니다',
    },
];

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/250?text=No+Image';

/**
 * 메인 홈 페이지 컴포넌트
 * 최신 모임 정보를 표시하고 그리드 보기로 이동하는 기능을 제공
 */
export default function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { meetingId?: string } | null;

    // 모임 목록 조회 훅 사용
    const { meetings, loading } = useMeetingList();

    // 최신 모임 또는 선택된 모임 정보 계산
    const latestMeeting = useMemo(() => {
        if (!meetings || meetings.length === 0) return null;

        // 요청된 meetingId가 있으면 우선 표시
        if (state?.meetingId) {
            const targetMeeting = meetings.find((m) => m.id === state.meetingId);
            if (targetMeeting) return targetMeeting;
        }

        // 수정일(updatedAt) 최신순 정렬 후 표시
        const sortedByDate = [...meetings].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        return sortedByDate[0];
    }, [meetings, state?.meetingId]);

    // 슬라이더에 표시할 데이터 변환
    const slides: SlideData[] = latestMeeting?.participants?.length
        ? latestMeeting.participants.map((p) => ({
              image: p.profile?.imageUrl || PLACEHOLDER_IMAGE,
              title: p.name || '이름 없음',
              position: p.position || '',
              description: p.season || '',
          }))
        : DEFAULT_SLIDES;

    /**
     * 닫기 버튼 핸들러 - 목록 페이지로 이동
     */
    const handleClose = () => navigate('/list');

    if (loading && !latestMeeting) return <div className="loading-container">Loading...</div>;

    return (
        <main className="main-content home-main">
            <h1>{latestMeeting ? latestMeeting.title : '환영합니다!'}</h1>
            <h3>{latestMeeting ? latestMeeting.desc : ''}</h3>

            <div className="home-slider-container">
                <ImageSlider slides={slides} interval={3000} />
            </div>

            <button className="close-button" onClick={handleClose}>
                X
            </button>

            <button
                className="grid-view-button"
                onClick={() => {
                    if (latestMeeting) {
                        window.open('#/grid/' + latestMeeting.id, '_blank', 'noopener,noreferrer');
                    }
                }}
                style={{
                    marginTop: '2rem',
                    marginBottom: '2rem',
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
