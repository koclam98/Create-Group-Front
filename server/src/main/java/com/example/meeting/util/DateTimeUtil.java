package com.example.meeting.util;

import java.time.LocalDateTime;

public class DateTimeUtil {

    /**
     * ISO 8601 형식의 문자열을 LocalDateTime으로 변환
     * React에서 보내는 ISO 형식(2026-01-15T12:00:00.000Z)을 처리
     */
    public static LocalDateTime parseIsoString(String dateStr) {
        if (dateStr == null) {
            return null;
        }

        // Z(UTC 표시)와 밀리초 제거
        String normalized = dateStr;
        if (normalized.endsWith("Z")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        if (normalized.contains(".")) {
            normalized = normalized.substring(0, normalized.indexOf("."));
        }

        return LocalDateTime.parse(normalized);
    }
}
