export /**
 * 모임 참석자 기수(season) 정렬을 위한 비교 함수
 * 정렬 규칙:
 * 1. 문자로 시작하는 기수(예: '가을', '고1회')가 숫자로 시작하는 기수(예: '1기')보다 먼저 옴
 * 2. 같은 타입(문자끼리, 숫자끼리) 내에서는 Natural Sort 적용
 *    - 문자열을 숫자와 비숫자로 토큰화하여 비교
 *    - "고1회" vs "고12회" -> "1"과 "12"를 숫자로 비교하여 "고1회"가 먼저 오도록 함
 */
const compareSeasons = (seasonA: string | undefined | null, seasonB: string | undefined | null): number => {
    const a = seasonA || '';
    const b = seasonB || '';

    // 빈 값은 뒤로 보냄 (선택 사항)
    if (!a && b) return 1;
    if (a && !b) return -1;
    if (!a && !b) return 0;

    const isNumA = /^\d/.test(a);
    const isNumB = /^\d/.test(b);

    // A는 문자 시작, B는 숫자 시작 -> A가 먼저 (-1)
    if (!isNumA && isNumB) return -1;
    // A는 숫자 시작, B는 문자 시작 -> B가 먼저 (1)
    if (isNumA && !isNumB) return 1;

    // 같은 타입끼리는 Natural Sort (문자와 숫자를 분리하여 비교)
    // 예: "고1회", "고12회" -> "1"과 "12"를 숫자로 비교
    const tokenA = a.split(/(\d+)/).filter(Boolean);
    const tokenB = b.split(/(\d+)/).filter(Boolean);

    while (tokenA.length && tokenB.length) {
        const partA = tokenA.shift()!;
        const partB = tokenB.shift()!;

        const numA = parseInt(partA, 10);
        const numB = parseInt(partB, 10);
        const isNumPartA = !isNaN(numA);
        const isNumPartB = !isNaN(numB);

        // 둘 다 숫자면 숫자 크기 비교
        if (isNumPartA && isNumPartB) {
            if (numA !== numB) return numA - numB;
        }
        // 둘 다 문자면 문자열 비교
        else if (!isNumPartA && !isNumPartB) {
            if (partA !== partB) return partA.localeCompare(partB);
        }
        // 숫자 vs 문자면 (보통 문자가 먼저 오지만 상황에 따라 다름, 여기선 단순 문자열 비교 fallback)
        else {
            return partA.localeCompare(partB);
        }
    }

    // 길이가 다른 경우 (예: "고1" vs "고1-1")
    return tokenA.length - tokenB.length;
};

/**
 * 정렬 대상 객체 인터페이스
 */
export interface SortableParticipant {
    season?: string | null;
    name?: string | null;
}

/**
 * 1순위 기수(season), 2순위 이름(name)으로 정렬하는 함수
 */
export const compareParticipants = (a: SortableParticipant, b: SortableParticipant): number => {
    // 1. 기수 정렬
    const seasonDiff = compareSeasons(a.season, b.season);
    if (seasonDiff !== 0) return seasonDiff;

    // 2. 이름 정렬 (기수가 같을 때)
    const nameA = a.name || '';
    const nameB = b.name || '';
    return nameA.localeCompare(nameB);
};
