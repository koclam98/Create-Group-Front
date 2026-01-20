import { useMemo } from 'react';
import type { Participant } from '../services/participantService';

export interface GroupedData {
    season: string;
    participants: Participant[];
}

/**
 * 사용자 목록을 기수별로 그룹화하는 커스텀 훅
 * @param participants - 전체 참여자 목록
 * @returns 기수별로 그룹화되고 정렬된 데이터
 */
export function useGroupedParticipants(participants: Participant[] | undefined): GroupedData[] {
    return useMemo(() => {
        if (!participants || participants.length === 0) return [];

        // 1. 기수별 그룹화
        const groups: { [key: string]: Participant[] } = {};
        participants.forEach((p) => {
            const season = p.season || '기타';
            if (!groups[season]) {
                groups[season] = [];
            }
            groups[season].push(p);
        });

        // 2. 기수 정렬 및 배열 변환
        return Object.keys(groups)
            .sort((a, b) => {
                const isDigitA = /^\d/.test(a);
                const isDigitB = /^\d/.test(b);

                // 둘 다 숫자로 시작하면 숫자 기준 정렬
                if (isDigitA && isDigitB) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                }

                // 숫자가 우선 순위
                if (isDigitA && !isDigitB) return 1;
                if (!isDigitA && isDigitB) return -1;

                return a.localeCompare(b);
            })
            .map((season) => ({
                season,
                participants: groups[season],
            }));
    }, [participants]);
}
