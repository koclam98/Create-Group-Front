import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ParticipantService, type Participant } from '../services/participantService';
import '../app/App.css';

export default function DtlPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchParticipant = async () => {
            console.log('Fetching participant for ID:', id);
            if (!id) {
                console.warn('No ID provided');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await ParticipantService.getById(id);
                console.log('Fetched participant:', data);
                setParticipant(data);
            } catch (err) {
                console.error('Failed to fetch participant:', err);
                setError('참여자 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchParticipant();
    }, [id]);

    if (loading) {
        return (
            <main className="main-content" style={{ justifyContent: 'center', paddingTop: '4rem' }}>
                <p>로딩 중...</p>
            </main>
        );
    }

    if (error || !participant) {
        return (
            <main className="main-content" style={{ justifyContent: 'center', paddingTop: '4rem' }}>
                <p style={{ color: 'red' }}>{error || '참여자를 찾을 수 없습니다.'}</p>
                <button onClick={() => navigate('/list')} style={{ marginTop: '1rem' }}>
                    목록으로 돌아가기
                </button>
            </main>
        );
    }

    return (
        <main className="main-content">
            <div
                style={{
                    width: '100%',
                    maxWidth: '600px',
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>참여자 상세 정보</h1>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    {participant.profile?.imageUrl ? (
                        <img
                            src={participant.profile.imageUrl}
                            alt={participant.name}
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '4px solid #f0f0f0',
                                marginBottom: '1rem',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                backgroundColor: '#eee',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#888',
                                fontSize: '1.2rem',
                                marginBottom: '1rem',
                            }}
                        >
                            No Image
                        </div>
                    )}
                    <h2 style={{ margin: 0, color: '#333' }}>{participant.name}</h2>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>{participant.season}기</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                        <span style={{ width: '100px', fontWeight: 'bold', color: '#555' }}>연락처</span>
                        <span style={{ color: '#333' }}>{participant.phone}</span>
                    </div>
                    <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                        <span style={{ width: '100px', fontWeight: 'bold', color: '#555' }}>등록일</span>
                        <span style={{ color: '#333' }}>{new Date(participant.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* 필요한 경우 추가 정보 표시 */}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/list')}
                        style={{
                            padding: '0.8rem 2rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        목록으로
                    </button>
                    {/* 수정/삭제 버튼 추가 가능 위치 */}
                </div>
            </div>
        </main>
    );
}
