import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../app/App.css';
import '../styles/common.css';
import { useParticipantForm } from '../hooks/useParticipantForm';
import AlertModal from '../components/ui/AlertModal';

const defaultProfile = './default-profile.png';

export default function AddPage() {
    const navigate = useNavigate();
    const {
        name,
        setName,
        position,
        setPosition,
        season,
        setSeason,
        phone,
        handlePhoneChange,
        preview,
        handleImageChange,
        submitForm,
    } = useParticipantForm();
    const nameInputRef = useRef<HTMLInputElement>(null);
    const positionInputRef = useRef<HTMLInputElement>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [onModalClose, setOnModalClose] = useState<(() => void) | undefined>(undefined);

    useEffect(() => {
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
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitForm();
            openModal('알림', '등록되었습니다!', () => {
                navigate('/list');
            });
        } catch (error: any) {
            openModal('오류', error.message || '등록에 실패했습니다.');
        }
    };

    return (
        <main className="main-content">
            <h1 className="section-header">참여자 등록</h1>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group-column">
                    <label className="form-label-centered">프로필 이미지</label>
                    <div className="profile-image-container">
                        <img src={preview || defaultProfile} alt="Profile" className="profile-image" />
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
                        ref={nameInputRef}
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                        placeholder="이름을 입력하세요"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="position" className="form-label-short">
                        직함 :
                    </label>
                    <input
                        ref={positionInputRef}
                        id="name"
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="form-input"
                        placeholder="직함을 입력하세요"
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
                        onChange={handlePhoneChange}
                        className="form-input"
                        placeholder="010-0000-0000"
                        maxLength={13}
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="button-flex-1">
                        등록하기
                    </button>
                    <button type="button" onClick={() => navigate('/list')} className="button-flex-1">
                        취소
                    </button>
                </div>
            </form>

            <AlertModal isOpen={isModalOpen} title={modalTitle} message={modalMessage} onClose={handleModalClose} />
        </main>
    );
}
