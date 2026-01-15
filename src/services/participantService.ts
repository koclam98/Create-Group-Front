import api from '../lib/api';

export interface Participant {
    id: string;
    name: string;
    season: string;
    phone: string;
    profile?: Profile;
    meetings?: Meeting[];
    createdAt: string;
    updatedAt: string;
}

export interface Profile {
    id: string;
    imageUrl?: string;
    participantId: string;
}

export interface Meeting {
    id: string;
    title: string;
    desc: string;
    date: string;
    location: string;
    hostId: string;
}

export const ParticipantService = {
    // 모든 참여자 조회
    getAll: async () => {
        const response = await api.get<Participant[]>('/participants');
        return response.data;
    },
    // 특정 참여자 조회
    getById: async (id: string) => {
        const response = await api.get<Participant>(`/participants/${id}`);
        return response.data;
    },
    // 참여자 생성
    create: async (data: { name: string; season: string; phone: string }) => {
        const response = await api.post<Participant>('/participants', data);
        return response.data;
    },
    // 참여자 수정
    update: async (id: string, data: Partial<{ name: string; season: string; phone: string }>) => {
        const response = await api.patch<Participant>(`/participants/${id}`, data);
        return response.data;
    },
    // 참여자 삭제
    delete: async (id: string) => {
        const response = await api.delete(`/participants/${id}`);
        return response.data;
    },
};
