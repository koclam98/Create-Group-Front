/**
 * 전화번호를 010-XXXX-XXXX 형식으로 포맷팅합니다.
 * @param value 입력된 전화번호 문자열 (숫자만 포함하거나 하이픈 포함 가능)
 * @returns 포맷팅된 전화번호 문자열
 */
export const formatPhoneNumber = (value: string): string => {
    if (!value) return '';

    // 숫자만 추출하고 최대 11자리까지만 유지
    const rawValue = value.replace(/[^0-9]/g, '').slice(0, 11);
    let formatted = rawValue;

    if (rawValue.length > 3 && rawValue.length <= 7) {
        formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    } else if (rawValue.length > 7) {
        formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7)}`;
    }

    return formatted;
};
