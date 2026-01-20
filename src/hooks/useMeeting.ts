import { useState, useEffect } from 'react';
import { meetingService, type Meeting } from '../services/meetingService';

interface UseMeetingResult {
    meeting: Meeting | null;
    loading: boolean;
    error: string | null;
}

/**
 * 특정 모임의 상세 정보를 조회하는 커스텀 훅
 * @param id - 조회할 모임의 ID
 * @returns 모임 데이터, 로딩 상태, 에러 메시지
 */
export function useMeeting(id: string | undefined): UseMeetingResult {
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeeting = async () => {
            if (!id) {
                setError('Meeting ID is missing');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await meetingService.getById(id);
                setMeeting(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch meeting:', err);
                setError('Failed to load meeting data');
            } finally {
                setLoading(false);
            }
        };

        fetchMeeting();
    }, [id]);

    return { meeting, loading, error };
}
