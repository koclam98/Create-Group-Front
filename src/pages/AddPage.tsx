import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParticipantService } from '../services/participantService';
import { profileService } from '../services/profileService';
import '../app/App.css';
import '../styles/common.css';

const DEFAULT_SEASON = '16기';

export default function AddPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [season, setSeason] = useState(DEFAULT_SEASON);
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
            const participant = await ParticipantService.create({
                name,
                season,
                phone,
            });

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
            <h1 className="section-header">참여자 등록</h1>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group-column">
                    <label className="form-label-centered">프로필 이미지</label>
                    <div className="profile-image-container">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="profile-image"
                            />
                        ) : (
                            <div className="profile-image-placeholder">
                                No Image
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="profile-image-upload"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="name" className="form-label-short">
                        이름 :
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        placeholder="이름을 입력하세요"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="season" className="form-label-short">
                        기수 :
                    </label>
                    <input
                        id="season"
                        type="text"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="form-input"
                        placeholder="예: 16"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone" className="form-label-short">
                        연락처 :
                    </label>
                    <input
                        id="phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                        placeholder="010-0000-0000"
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="button-flex-1">
                        등록하기
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/list')}
                        className="button-flex-1"
                    >
                        취소
                    </button>
                </div>
            </form>
        </main>
    );
}
