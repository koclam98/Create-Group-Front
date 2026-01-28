import { useState } from 'react';
import { ParticipantService } from '../services/participantService';
import { profileService } from '../services/profileService';
import { formatPhoneNumber } from '../utils/format';

const DEFAULT_SEASON = '16기';
const DEFAULT_PROFILE_IMAGE = './default-profile.png';

/**
 * 사용자 등록 폼의 상태와 로직을 관리하는 커스텀 훅
 * @returns 폼 상태값들과 핸들러 함수들
 */
export function useParticipantForm() {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [season, setSeason] = useState(DEFAULT_SEASON);
    const [phone, setPhone] = useState('');
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    /**
     * 전화번호 입력 시 자동 포맷팅을 적용하는 핸들러
     */
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    /**
     * 이미지 파일 선택 시 미리보기를 생성하는 핸들러
     */
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

    /**
     * 폼 제출을 처리하는 비동기 함수
     * 필수값 검증 및 데이터 저장 수행
     */
    const submitForm = async () => {
        if (!name || !season || !phone) {
            throw new Error('모든 필수 항목을 입력해주세요.');
        }

        try {
            setLoading(true);
            const participant = await ParticipantService.create({
                name,
                position,
                season,
                phone,
            });

            // 프로필 이미지가 없으면 기본 이미지 사용
            const imageToUse = profileImage || DEFAULT_PROFILE_IMAGE;
            await profileService.create({
                imageUrl: imageToUse,
                participantId: participant.id,
            });

            // 성공 시 아무것도 반환하지 않음 (호출 측에서 처리)
        } catch (error) {
            console.error('Failed to create participant:', error);
            throw new Error('등록에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return {
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
        loading,
        submitForm,
    };
}
