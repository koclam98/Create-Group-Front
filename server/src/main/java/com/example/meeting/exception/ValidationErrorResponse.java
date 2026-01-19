package com.example.meeting.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 검증 실패 처리를 위한 검증 오류 응답 DTO.
 * 필드별 검증 오류를 포함하여 표준 오류 응답을 확장합니다.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {

    /**
     * 검증 오류가 발생한 타임스탬프
     */
    private LocalDateTime timestamp;

    /**
     * HTTP 상태 코드
     */
    private int status;

    /**
     * HTTP 상태 사유 구문
     */
    private String error;

    /**
     * 일반 검증 오류 메시지
     */
    private String message;

    /**
     * 필드 이름과 해당 검증 오류 메시지의 맵
     */
    private Map<String, String> validationErrors;
}
