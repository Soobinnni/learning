## handleMethodArgumentNotValid

<aside>
💡

**Spring Framework**에서 제공하는 예외 처리 메서드로,

주로 `@Valid`나 `@Validated`를 사용하여 요청 본문 데이터를 검증할 때 발생하는 `MethodArgumentNotValidException`을 처리.

</aside>

### 동작 맥락

1. 컨트롤러의 요청 바디나 파라미터에 **유효성 검사 어노테이션**(예: `@NotNull`, `@Size`, `@Email` 등)을 적용.
2. 유효성 검사에 실패하면 **`MethodArgumentNotValidException`이 발생.**
3. 이 예외를 처리하기 위해 **예외 처리 메서드**로 `handleMethodArgumentNotValid`를 사용할 수 있음.

---

### 주요 사용 예

주로 `@ControllerAdvice`와 함께 사용되며, 글로벌 예외 처리 핸들러에서 선언

```java

@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String, String>> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();

    // BindingResult에서 모든 필드 에러 가져오기
    ex.getBindingResult().getFieldErrors().forEach(error -> {
        String fieldName = error.getField();               // 오류가 발생한 필드 이름
        String errorMessage = error.getDefaultMessage();   // 해당 필드의 오류 메시지
        errors.put(fieldName, errorMessage);               // 필드 이름과 메시지를 Map에 추가
    });

    return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
}

```

1. **`getBindingResult`**:
    - `MethodArgumentNotValidException`에서 호출하여 `BindingResult` 객체를 가져옵니다.
2. **`getFieldErrors`**:
    - 모든 필드 오류 목록을 반환합니다. 이 목록에서 각 필드에 대한 오류 정보를 얻을 수 있습니다.
3. **`FieldError`의 주요 메서드**:
    - `getField()`: 유효성 검사가 실패한 필드 이름.
    - `getDefaultMessage()`: 필드의 검증 실패 메시지(예: `@NotBlank(message = "...")`에서 설정한 메시지).

---

### 주요 매개변수 및 결과

1. **`MethodArgumentNotValidException`**:
    - 발생한 검증 오류 정보를 포함.
    - `BindingResult` 객체로 접근 가능하여, 어떤 필드에서 어떤 에러가 발생했는지 확인 가능.
2. **응답 구조**:
    - 일반적으로 JSON 형태로 클라이언트에 검증 실패 메시지와 상태 코드를 반환.

---

### 동작 예시

### 컨트롤러

```java

@PostMapping("/users")
public ResponseEntity<String> createUser(@Valid @RequestBody UserDto userDto) {
    // 요청 성공 시 처리
    return ResponseEntity.ok("User created successfully");
}

```

### DTO 클래스

```java
public class UserDto {

    @NotBlank(message = "Name is mandatory")
    private String name;

    @Email(message = "Email should be valid")
    private String email;

    // Getters and Setters
}

```

### 유효성 검사 실패 시 응답 예시

```json
{
  "name": "Name is mandatory",
  "email": "Email should be valid"
}

```

---

### 활용 포인트

- API 요청 시 유효성 검사를 체계적으로 관리.
- 사용자에게 상세하고 명확한 검증 오류 메시지를 제공.
- `@ControllerAdvice`를 통해 중앙 집중식 예외 처리를 구현 가능.