import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ParticipantService, type Participant } from '../services/participantService';
import { profileService } from '../services/profileService';
import '../app/App.css';
import '../styles/common.css';
import defaultProfile from '../assets/default-profile.png';
import AlertModal from '../components/ui/AlertModal';

const DEFAULT_PROFILE_IMAGE = defaultProfile;

export default function DtlPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        position: '',
        season: '',
        phone: '',
    });
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const positionInputRef = useRef<HTMLInputElement>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [onModalClose, setOnModalClose] = useState<(() => void) | undefined>(undefined);

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
                    position: data.position,
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

    useEffect(() => {
        if (!loading && nameInputRef.current) {
            const timeoutId = setTimeout(() => {
                const input = nameInputRef.current;
                if (input) {
                    // blur/focus 사이클로 입력 활성화
                    input.blur();
                    setTimeout(() => {
                        input.focus();
                        input.select();
                        // 클릭 이벤트로 강제 활성화
                        input.click();
                    }, 50);
                }
            }, 200);
            return () => clearTimeout(timeoutId);
        }
    }, [loading]);

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

    const openModal = (title: string, message: string, onClose?: () => void) => {
        setModalTitle(title);
        setModalMessage(message);
        setOnModalClose(() => onClose); // 함수형 업데이트 방지
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        if (onModalClose) {
            onModalClose();
        }
    };

    const handleUpdate = async () => {
        if (!id || !participant) return;

        if (!formData.name.trim()) {
            openModal('알림', '이름을 입력해주세요.');
            return;
        }
        if (!formData.position.trim()) {
            openModal('알림', '직합을 입력해주세요.');
            return;
        }
        if (!formData.season.trim()) {
            openModal('알림', '기수를 입력해주세요.');
            return;
        }
        if (!formData.phone.trim()) {
            openModal('알림', '연락처를 입력해주세요.');
            return;
        }
        try {
            await ParticipantService.update(id, formData);

            // 프로필 이미지 처리: 새로 업로드한 이미지가 있으면 사용, 없으면 기존 이미지 유지 또는 기본 이미지 사용
            const imageToUse = profileImage || preview || DEFAULT_PROFILE_IMAGE;
            if (participant.profile) {
                await profileService.update(id, { imageUrl: imageToUse });
            } else {
                await profileService.create({ imageUrl: imageToUse, participantId: id });
            }

            openModal('알림', '수정되었습니다.', () => {
                navigate('/list');
            });
            const updated = await ParticipantService.getById(id);
            setParticipant(updated);
        } catch (err) {
            console.error('Failed to update participant:', err);
            openModal('오류', '수정 실패');
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
                        ref={nameInputRef}
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input-editable"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label-short">직함 :</label>
                    <input
                        ref={positionInputRef}
                        type="text"
                        name="position"
                        value={formData.position}
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
                        placeholder="010-0000-0000"
                        maxLength={13}
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

            <AlertModal isOpen={isModalOpen} title={modalTitle} message={modalMessage} onClose={handleModalClose} />
        </main>
    );
}
