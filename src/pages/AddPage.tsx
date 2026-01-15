import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParticipantService } from '../services/participantService';
import { profileService } from '../services/profileService';
import '../app/App.css'; // Reuse basic styles

export default function AddPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [season, setSeason] = useState('16기'); // Default value
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [preview, setPreview] = useState<string | undefined>(undefined);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImage(base64String);
                setPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !season || !phone) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        try {
            // 1. 참여자 생성
            const participant = await ParticipantService.create({
                name,
                season,
                phone,
            });

            // 2. 프로필 이미지가 있다면 프로필 생성
            if (profileImage) {
                await profileService.create({
                    imageUrl: profileImage,
                    participantId: participant.id,
                });
            }

            alert('등록되었습니다!');
            navigate('/list');
        } catch (error) {
            console.error('Failed to create participant:', error);
            alert('등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <main className="main-content">
            <h1 style={{ marginBottom: '2rem' }}>참여자 등록</h1>

            <form
                onSubmit={handleSubmit}
                style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
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
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ marginLeft: '2rem' }}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label htmlFor="name" style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                        이름 :
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            fontSize: '1rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                        placeholder="이름을 입력하세요"
                    />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label htmlFor="season" style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                        기수 :
                    </label>
                    <input
                        id="season"
                        type="text"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            fontSize: '1rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                        placeholder="예: 16"
                    />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label htmlFor="phone" style={{ width: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                        연락처 :
                    </label>
                    <input
                        id="phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            fontSize: '1rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                        placeholder="010-0000-0000"
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" style={{ flex: 1 }}>
                        등록하기
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/list')}
                        style={{
                            flex: 1,
                        }}
                    >
                        취소
                    </button>
                </div>
            </form>
        </main>
    );
}
