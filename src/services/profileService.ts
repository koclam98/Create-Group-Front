import api from '../lib/api';
import type { Profile } from './participantService';

export const profileService = {
    // 프로필 생성
    create: async (data: { imageUrl?: string; participantId: string }) => {
        const response = await api.post<Profile>('/profiles', data);
        return response.data;
    },

    // 참여자의 프로필 조회
    getByParticipantId: async (participantId: string) => {
        const response = await api.get<Profile>(`/profiles/participant/${participantId}`);
        return response.data;
    },

    // 프로필 수정
    update: async (participantId: string, data: { imageUrl?: string }) => {
        const response = await api.patch<Profile>(`/profiles/participant/${participantId}`, data);
        return response.data;
    },

    // 프로필 삭제
    delete: async (participantId: string) => {
        const response = await api.delete(`/profiles/participant/${participantId}`);
        return response.data;
    },
};
