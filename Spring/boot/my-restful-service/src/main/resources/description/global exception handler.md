### Global Exception Handler 클래스 정리

![mermaid live_view (7)](https://github.com/user-attachments/assets/c7501924-1652-427e-ad04-6f8a77fbf3c3)

- ErrorCode 인터페이스와 이를 구현하는 UserErrorCode enum의 관계
- BaseResponseException이 ErrorCode를 포함하는 구조
- GlobalExceptionHandler가 ErrorResponse를 생성하고 BaseResponseException을 처리하는 관계
  각 클래스의 주요 메서드와 필드를 표시

### 시퀀스 다이어그램

![mermaid live_view (8)](https://github.com/user-attachments/assets/1c6d8639-caee-4c9b-8fa9-2e8c0847e49e)

- 예외가 발생하고 처리되는 전체 흐름
- Controller에서 시작해서 Service에서 예외 발생
- GlobalExceptionHandler에서 예외를 잡아서 ErrorResponse 생성
- 최종적으로 클라이언트에게 응답을 반환하는 과정