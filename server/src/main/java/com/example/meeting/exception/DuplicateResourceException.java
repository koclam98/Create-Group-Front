package com.example.meeting.exception;

/**
 * 이미 존재하는 리소스를 생성하려고 시도할 때 발생하는 예외.
 * HTTP 409 CONFLICT 응답으로 처리됩니다.
 */
public class DuplicateResourceException extends RuntimeException {

    /**
     * 지정된 상세 메시지로 새 DuplicateResourceException을 생성합니다.
     *
     * @param message 어떤 리소스가 중복되었는지 설명하는 상세 메시지
     */
    public DuplicateResourceException(String message) {
        super(message);
    }
}
