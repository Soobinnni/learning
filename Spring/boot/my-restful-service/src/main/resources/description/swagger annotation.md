# Swagger 관련 어노테이션 정리

## 클래스 어노테이션

```java
@Tag(name = "user-controller", description = "일반 사용자 서비스를 위한 컨트롤러입니다.")
```

### `@Tag`

- **설명:** Swagger에서 API 그룹화를 위한 어노테이션입니다.
- **속성:**
    - `name`: API의 이름 (예: `"user-controller"`)
    - `description`: API의 설명 (예: `"일반 사용자 서비스를 위한 컨트롤러입니다."`)

## 메소드 어노테이션

```java
@Operation(summary = "사용자 정보 조회 API", description = "사용자 ID를 이용하여 사용자 상세 정보 조회를 합니다.")
@ApiResponses({
        @ApiResponse(
                responseCode = "200",
                description = "OK !!",
                content = @Content(array = @ArraySchema(schema = @Schema(implementation = User.class)))),
        @ApiResponse(responseCode = "400", description = "BAD REQUEST !!"),
        @ApiResponse(responseCode = "404", description = "NOT FOUND !!"),
        @ApiResponse(responseCode = "500", description = "INTERNAL SERVER ERROR !!"),
})
```

### `@Operation`

- **설명:** 메소드에 대한 설명을 추가합니다.
- **속성:**
    - `summary`: API의 간단한 설명 (예: `"사용자 정보 조회 API"`)
    - `description`: API의 상세 설명 (예: `"사용자 ID를 이용하여 사용자 상세 정보 조회를 합니다."`)

### `@ApiResponses`

- **설명:** 다양한 HTTP 응답 코드에 대한 설명을 추가합니다.

##### 응답 코드 어노테이션

- **`@ApiResponse`**
    - **responseCode:** `"200"`
        - **description:** `"OK !!"`
        - **content:**
          `@Content(array = @ArraySchema(schema = @Schema(implementation = User.class)))`
            - **설명:** 성공적인 응답의 경우, 사용자 정보 배열을 반환합니다.

    - **responseCode:** `"400"`
        - **description:** `"BAD REQUEST !!"`
            - **설명:** 잘못된 요청인 경우의 응답입니다.

    - **responseCode:** `"404"`
        - **description:** `"NOT FOUND !!"`
            - **설명:** 요청한 사용자를 찾을 수 없는 경우의 응답입니다.

    - **responseCode:** `"500"`
        - **description:** `"INTERNAL SERVER ERROR !!"`
            - **설명:** 서버 내부 오류가 발생한 경우의 응답입니다.

