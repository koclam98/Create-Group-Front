import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ParticipantService, type Participant } from '../services/participantService';
import { profileService } from '../services/profileService';
import '../app/App.css';
import '../styles/common.css';

const DEFAULT_PROFILE_IMAGE = './default-profile.png';

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
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [preview, setPreview] = useState<string | undefined>(undefined);

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
                if (data.profile?.imageUrl) {
                    setPreview(data.profile.imageUrl);
                }
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

    const handleUpdate = async () => {
        if (!id || !participant) return;
        try {
            await ParticipantService.update(id, formData);

            // 프로필 이미지 처리: 새로 업로드한 이미지가 있으면 사용, 없으면 기존 이미지 유지 또는 기본 이미지 사용
            const imageToUse = profileImage || preview || DEFAULT_PROFILE_IMAGE;
            if (participant.profile) {
                await profileService.update(id, { imageUrl: imageToUse });
            } else {
                await profileService.create({ imageUrl: imageToUse, participantId: id });
            }

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
            <main className="main-content loading-container">
                <p>로딩 중...</p>
            </main>
        );
    }

    if (error || !participant) {
        return (
            <main className="main-content loading-container">
                <p className="error-text">{error || '참여자를 찾을 수 없습니다.'}</p>
                <button onClick={() => navigate('/list')} className="mt-1">
                    목록으로 돌아가기
                </button>
            </main>
        );
    }

    return (
        <main className="main-content">
            <h1 className="section-header">참여자 상세</h1>

            <div className="form-container">
                <div className="form-group-column">
                    <label className="form-label-centered">프로필 이미지</label>
                    <div className="profile-image-container">
                        {preview ? (
                            <img src={preview} alt={participant.name} className="profile-image" />
                        ) : (
                            <div className="profile-image-placeholder">No Image</div>
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
                    <label className="form-label-short">이름 :</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input-editable"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label-short">기수 :</label>
                    <input
                        type="text"
                        name="season"
                        value={formData.season}
                        onChange={handleInputChange}
                        className="form-input-editable"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label-short">연락처 :</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input-editable"
                    />
                </div>

                <div className="button-group">
                    <button onClick={handleUpdate} className="button-flex-1">
                        수정하기
                    </button>
                    <button onClick={() => navigate('/list')} className="button-flex-1">
                        목록으로
                    </button>
                </div>
            </div>
        </main>
    );
}
