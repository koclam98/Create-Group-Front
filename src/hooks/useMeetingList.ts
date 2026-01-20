import { useState, useEffect } from 'react';
import { meetingService, type Meeting } from '../services/meetingService';

interface UseMeetingListResult {
    meetings: Meeting[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

/**
 * 전체 모임 목록을 조회하는 커스텀 훅
 * @returns 모임 목록, 로딩 상태, 에러 메시지, 새로고침 함수
 */
export function useMeetingList(): UseMeetingListResult {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * 서버에서 모임 목록을 가져오는 비동기 함수
     */
    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const data = await meetingService.getAll();
            setMeetings(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch meetings:', err);
            setError('Failed to load meetings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    return { meetings, loading, error, refresh: fetchMeetings };
}
