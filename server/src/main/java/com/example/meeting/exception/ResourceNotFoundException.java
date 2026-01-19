package com.example.meeting.exception;

/**
 * 요청한 리소스를 찾을 수 없을 때 발생하는 예외.
 * HTTP 404 NOT FOUND 응답으로 처리됩니다.
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * 지정된 상세 메시지로 새 ResourceNotFoundException을 생성합니다.
     *
     * @param message 어떤 리소스를 찾을 수 없는지 설명하는 상세 메시지
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
