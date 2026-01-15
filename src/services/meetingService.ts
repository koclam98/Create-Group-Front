import api from '../lib/api';
import type { Participant } from './participantService';

export interface Meeting {
    id: string;
    title: string;
    desc: string;
    date: string;
    location: string;
    host: Participant;
    participants: Participant[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateMeetingDto {
    title: string;
    desc: string;
    date: string;
    location: string;
    hostId: string;
    participantIds: string[];
}

export const meetingService = {
    // 모든 모임 조회
    getAll: async () => {
        const response = await api.get<Meeting[]>('/meetings');
        return response.data;
    },

    // 특정 모임 조회
    getById: async (id: string) => {
        const response = await api.get<Meeting>(`/meetings/${id}`);
        return response.data;
    },

    // 특정 호스트의 모임 조회
    getByHost: async (hostId: string) => {
        const response = await api.get<Meeting[]>(`/meetings/host/${hostId}`);
        return response.data;
    },

    // 모임 생성
    create: async (data: CreateMeetingDto) => {
        const response = await api.post<Meeting>('/meetings', data);
        return response.data;
    },

    // 모임 수정
    update: async (id: string, data: Partial<{ title: string; desc: string; date: string; location: string }>) => {
        const response = await api.patch<Meeting>(`/meetings/${id}`, data);
        return response.data;
    },

    // 모임 삭제
    delete: async (id: string) => {
        const response = await api.delete(`/meetings/${id}`);
        return response.data;
    },
};
