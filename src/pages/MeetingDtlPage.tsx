import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../app/App.css';
import { type Meeting } from '../services/participantService';
import { meetingService } from '../services/meetingService';

export default function MeetingDtlPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formdata, setFormData] = useState({
        title: '',
        desc: '',
        createAt: '',
        updateAt: '',
    });

    useEffect(() => {
        const fetchMeeting = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await meetingService.getById(id);
                setMeeting(data);
                setFormData({
                    title: data.title,
                    desc: data.desc,
                    createAt: data.createdAt,
                    updateAt: data.updatedAt,
                });
            } catch (err) {
                console.error('Failed to fetch Meeting: ', err);
                setError('모임 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMeeting();
    }, [id]);

    if (loading) {
        return (
            <main className="main-content" style={{ justifyContent: 'center', paddingTop: '4rem' }}>
                <p>로딩 중...</p>
            </main>
        );
    }
    if (error || !meeting) {
        return (
            <main className="main-content" style={{ justifyContent: 'center', paddingTop: '4rem' }}>
                <p style={{ color: 'red' }}>{error || '모임을 찾울 수 없습니다.'}</p>
                <button onClick={() => navigate('/list')} style={{ marginTop: '1rem' }}>
                    목록으로 돌아가기
                </button>
            </main>
        );
    }

    const inputStyle = {
        flex: 1,
        padding: '0.5rem',
        fontSize: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#ffffff', // Editable look
        color: '#333',
    };

    const labelStyle = {
        width: '100px',
        textAlign: 'right' as const,
        fontWeight: 'bold',
    };

    const formtDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <main className="main-content">
            <h1 style={{ marginBottom: '2rem' }}>모임 상세</h1>

            <div
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>모임명</label>
                    <input type="text" name="title" value={formdata.title} style={inputStyle} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>모임 설명</label>
                    <input type="text" name="title" value={formdata.desc} style={inputStyle} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>모임 생성일</label>
                    <input type="text" name="title" value={formtDate(formdata.createAt)} style={inputStyle} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>모임 수정일</label>
                    <input type="text" name="title" value={formtDate(formdata.updateAt)} style={inputStyle} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button style={{ flex: 1 }}>수정하기</button>
                    <button style={{ flex: 1 }} onClick={() => navigate('/list')}>
                        목록으로
                    </button>
                </div>
            </div>
        </main>
    );
}
