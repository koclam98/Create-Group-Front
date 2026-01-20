import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { meetingService, type Meeting } from '../services/meetingService';
import { type Participant } from '../services/participantService';
import GroupedProfileSlider from '../components/ui/GroupedProfileSlider';
import '../styles/common.css';
import '../components/ui/GroupedProfileSlider.css';

export default function ParticipantGridPage() {
    const { id } = useParams<{ id: string }>();
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
                const data = await meetingService.getById(id);
                setMeeting(data);
            } catch (err) {
                console.error('Failed to fetch meeting:', err);
                setError('Failed to load meeting data');
            } finally {
                setLoading(false);
            }
        };

        fetchMeeting();
    }, [id]);

    const getGroupedParticipants = (participants: Participant[] | undefined) => {
        if (!participants || participants.length === 0) return [];

        const groups: { [key: string]: Participant[] } = {};
        participants.forEach((p) => {
            const season = p.season || '기타';
            if (!groups[season]) {
                groups[season] = [];
            }
            groups[season].push(p);
        });

        return Object.keys(groups)
            .sort((a, b) => {
                const isDigitA = /^\d/.test(a);
                const isDigitB = /^\d/.test(b);

                if (isDigitA && isDigitB) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                }

                if (isDigitA && !isDigitB) return 1;
                if (!isDigitA && isDigitB) return -1;

                return a.localeCompare(b);
            })
            .map((season) => ({
                season,
                participants: groups[season],
            }));
    };

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

    const groupedData = getGroupedParticipants(meeting.participants);

    return (
        <main className="main-content">
            <h1 className="section-header">{meeting.title} - 기수별 명단</h1>

            <div className="home-slider-container">
                <GroupedProfileSlider groups={groupedData} />
            </div>
        </main>
    );
}
