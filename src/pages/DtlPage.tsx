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

    const [formData, setFormData] = useState({
        name: '',
        season: '',
        phone: '',
    });

    useEffect(() => {
        const fetchParticipant = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await ParticipantService.getById(id);
                setParticipant(data);
                setFormData({
                    name: data.name,
                    season: data.season,
                    phone: data.phone,
                });
            } catch (err) {
                console.error('Failed to fetch participant:', err);
                setError('참여자 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchParticipant();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        if (!id) return;
        try {
            await ParticipantService.update(id, formData);
            alert('수정되었습니다.');
            const updated = await ParticipantService.getById(id);
            setParticipant(updated);
            navigate('/list');
        } catch (err) {
            console.error('Failed to update participant:', err);
            alert('수정 실패');
        }
    };

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

    // Reuse styles from AddPage inline or consistent approach
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
        width: '80px',
        textAlign: 'right' as const,
        fontWeight: 'bold',
    };

    return (
        <main className="main-content">
            <h1 style={{ marginBottom: '2rem' }}>참여자 상세</h1>

            <div
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <div
                    className="form-group"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                    }}
                >
                    <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>프로필 이미지</label>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {participant.profile?.imageUrl ? (
                            <img
                                src={participant.profile.imageUrl}
                                alt={participant.name}
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: '1rem',
                                    border: '2px solid #ddd',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    backgroundColor: '#eee',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#888',
                                }}
                            >
                                No Image
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>이름 :</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={inputStyle}
                    />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>기수 :</label>
                    <input
                        type="text"
                        name="season"
                        value={formData.season}
                        onChange={handleInputChange}
                        style={inputStyle}
                    />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>연락처 :</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={inputStyle}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        onClick={handleUpdate}
                        style={{
                            flex: 1,
                        }}
                    >
                        수정하기
                    </button>
                    <button
                        onClick={() => navigate('/list')}
                        style={{
                            flex: 1,
                        }}
                    >
                        목록으로
                    </button>
                </div>
            </div>
        </main>
    );
}
