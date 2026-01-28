// src/pages/ParticipantGridPage.tsx
import { useParams } from 'react-router-dom';
import PagedProfileGrid from '../components/ui/PagedProfileGrid'; // 변경됨
import { useMeeting } from '../hooks/useMeeting';
// import { useGroupedParticipants } from '../hooks/useGroupedParticipants'; // 제거 (불필요)
import '../styles/common.css';
// import '../components/ui/GroupedProfileSlider.css'; // 제거 (새 컴포넌트 내부에서 CSS import 함)

export default function ParticipantGridPage() {
    const { id } = useParams<{ id: string }>();

    const { meeting, loading, error } = useMeeting(id);
    // const groupedData = useGroupedParticipants(meeting?.participants); // 제거

    if (loading)
        return (
            <div className="loading-container">
                <p>로딩 중...</p>
            </div>
        );
    if (error || !meeting)
        return (
            <div className="loading-container">
                <p className="error-text">{error || '모임을 찾을 수 없습니다.'}</p>
            </div>
        );

    return (
        <main className="main-content">
            <h1 className="section-header">{meeting.title}</h1>

            <div className="home-slider-container">
                {/* 기존 GroupedProfileSlider 대신 PagedProfileGrid 사용 */}
                {/* meeting.participants를 바로 넘겨줍니다. 없을 경우 빈 배열 전달 */}
                <PagedProfileGrid participants={meeting.participants || []} />
            </div>
        </main>
    );
}
