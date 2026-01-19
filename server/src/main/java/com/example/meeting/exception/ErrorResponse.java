package com.example.meeting.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * API 오류 처리를 위한 표준 오류 응답 DTO.
 * 클라이언트에 일관된 오류 정보를 제공하는 데 사용됩니다.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    /**
     * 오류가 발생한 타임스탬프
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
     * 상세한 오류 메시지
     */
    private String message;
}
