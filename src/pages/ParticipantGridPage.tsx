import { useParams } from 'react-router-dom';
import GroupedProfileSlider from '../components/ui/GroupedProfileSlider';
import { useMeeting } from '../hooks/useMeeting';
import { useGroupedParticipants } from '../hooks/useGroupedParticipants';
import '../styles/common.css';
import '../components/ui/GroupedProfileSlider.css';

/**
 * 전체 참석자 현황을 그리드 형태로 보여주는 페이지
 * 기수별 그룹화된 참석자 목록을 슬라이더로 제공
 */
export default function ParticipantGridPage() {
    const { id } = useParams<{ id: string }>();

    // 커스텀 훅을 사용하여 데이터 및 로딩 상태 관리
    const { meeting, loading, error } = useMeeting(id);
    const groupedData = useGroupedParticipants(meeting?.participants);

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
            <h1 className="section-header">{meeting.title} - 기수별 명단</h1>

            <div className="home-slider-container">
                <GroupedProfileSlider groups={groupedData} />
            </div>
        </main>
    );
}
