import api from '../lib/api';
import type { Meeting } from './meetingService';
export type { Meeting };

export interface Participant {
    id: string;
    name: string;
    position: string;
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

// 엑셀 import 결과 타입
export interface ImportResult {
    totalCount: number;
    successCount: number;
    skipCount: number;
    errors: string[];
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
    create: async (data: { name: string; position: string; season: string; phone: string }) => {
        const response = await api.post<Participant>('/participants', data);
        return response.data;
    },
    // 참여자 수정
    update: async (id: string, data: Partial<{ name: string; position: string; season: string; phone: string }>) => {
        const response = await api.patch<Participant>(`/participants/${id}`, data);
        return response.data;
    },
    // 참여자 삭제
    delete: async (id: string) => {
        const response = await api.delete(`/participants/${id}`);
        return response.data;
    },
    // 엑셀 파일로 참여자 일괄 등록
    importExcel: async (file: File): Promise<ImportResult> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<ImportResult>('/participants/import', formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
        return response.data;
    }
};


