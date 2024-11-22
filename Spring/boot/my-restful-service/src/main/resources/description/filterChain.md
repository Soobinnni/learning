이 설정은 JWT 기반 인증을 가능하게 만드는 **Spring Security** 설정입니다. 각 항목이 JWT 인증과 어떻게 연결되는지 설명하겠습니다.

### 1. **CSRF 비활성화 (`http.csrf(AbstractHttpConfigurer::disable)`)**

- CSRF(Cross-Site Request Forgery)는 주로 세션 쿠키 기반 인증을 사용할 때 중요한 보안 기능입니다.
- JWT 인증은 기본적으로 **무상태(stateless)** 방식으로 동작하기 때문에, 세션 쿠키를 사용하지 않습니다. 따라서 CSRF 보호를 사용할 필요가 없으며, 이를
  비활성화하여 JWT 방식에서 발생할 수 있는 불필요한 문제를 방지합니다.
- **이 설정**: CSRF 보호를 비활성화하여 JWT 기반 인증에서 세션 쿠키와 관련된 CSRF 공격을 막는 데 필요한 설정을 제거합니다.

### 2. **CORS 설정 (`http.cors(cors -> cors.configurationSource(corsConfigurationSource()))`)**

- CORS(Cross-Origin Resource Sharing)는 브라우저가 다른 출처의 서버와 통신할 수 있도록 허용하는 보안 메커니즘입니다.
- JWT 인증은 보통 클라이언트가 **Authorization 헤더에 JWT를 담아서** 요청을 보내므로, 클라이언트와 서버가 서로 다른 출처에 있을 경우 CORS 설정을 해줘야
  합니다.
- **이 설정**: `corsConfigurationSource()`를 사용하여 CORS 정책을 설정하고, 다른 출처에서 JWT 인증을 사용할 수 있도록 허용합니다.

### 3. **세션 관리 비활성화 (STATELESS) (

`http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))`)
**

- **JWT 인증**은 **무상태(stateless)** 인증 방식입니다. 즉, 서버는 클라이언트의 상태를 저장하지 않으며, 모든 요청은 클라이언트가 보낸 **JWT 토큰**에
  의존합니다.
- 세션을 사용하지 않기 때문에, 서버는 클라이언트의 상태를 저장하지 않으며 각 요청은 **JWT 토큰을 사용하여 인증**됩니다.
- **이 설정**: `SessionCreationPolicy.STATELESS`로 설정하여 세션을 사용하지 않도록 하고, 매 요청마다 클라이언트가 JWT 토큰을 헤더에 포함하여
  인증할 수 있도록 합니다.

### 4. **기본 폼 로그인 비활성화 (`http.formLogin(AbstractHttpConfigurer::disable)`)**

- 기본적으로 Spring Security는 폼 로그인을 활성화해두고 있습니다. 그러나 JWT 인증을 사용하려면 **폼 로그인**을 사용하지 않고, JWT를 통한 인증 방식으로
  처리해야 합니다.
- **이 설정**: 기본 폼 로그인을 비활성화하여, JWT를 통한 인증 방식을 사용하도록 설정합니다.

### 5. **기본 HTTP 기본 인증 비활성화 (`http.httpBasic(AbstractHttpConfigurer::disable)`)**

- HTTP 기본 인증은 주로 **사용자명과 비밀번호**를 `Authorization` 헤더에 포함시켜서 인증하는 방식입니다.
- JWT 인증에서는 HTTP 기본 인증을 사용하지 않으며, 대신 JWT 토큰을 사용하여 인증을 처리합니다.
- **이 설정**: 기본 HTTP 기본 인증을 비활성화하여, JWT 기반 인증 방식만 사용되도록 합니다.

### 요약

이 설정이 **JWT 인증을 가능하게 만드는 이유**는 다음과 같습니다:

- **CSRF 비활성화**: JWT 인증에서는 세션 쿠키를 사용하지 않기 때문에 CSRF 공격을 방지할 필요가 없습니다.
- **CORS 설정**: JWT 인증을 사용할 때 다른 출처에서 요청할 수 있도록 CORS 정책을 설정합니다.
- **세션 관리 비활성화 (STATELESS)**: JWT는 무상태 인증 방식이므로, 세션을 생성하거나 관리하지 않고, 요청마다 JWT 토큰을 검사하여 인증합니다.
- **기본 폼 로그인 비활성화**: 폼 로그인을 비활성화하여 JWT 인증 방식을 사용합니다.
- **기본 HTTP 기본 인증 비활성화**: HTTP 기본 인증을 비활성화하여 JWT 인증만을 사용하도록 설정합니다.

이 모든 설정은 **JWT를 사용한 인증 방식**을 올바르게 적용하는 데 필요한 설정입니다.

---

이 설정은 **Spring Security**에서 예외 처리 및 필터 체인을 구성하는 부분입니다. 각 설정의 목적을 자세히 설명하겠습니다.

### 1. **예외 처리 설정 (`http.exceptionHandling(...)`)**

```java
http.exceptionHandling(
        exc ->exc.

accessDeniedHandler(accessDeniedHandler())
        .

authenticationEntryPoint(authenticationEntryPoint())
        );
```

- **예외 처리**는 주로 인증 또는 권한 문제가 발생했을 때, 사용자가 어떻게 처리될지를 정의합니다.
    - `accessDeniedHandler`: 사용자가 **권한이 없는** 리소스에 접근했을 때의 처리 방법을 정의합니다. 예를 들어, 사용자가 로그인을 했지만 권한이 없는
      리소스에 접근하려고 할 때, `403 Forbidden` 에러를 처리하는 로직을 정의할 수 있습니다.
    - `authenticationEntryPoint`: 사용자가 **인증되지 않은** 상태로 보호된 리소스에 접근했을 때의 처리 방법을 정의합니다. 예를 들어, JWT 토큰이
      없거나 유효하지 않은 경우 `401 Unauthorized` 에러를 반환하도록 설정할 수 있습니다.

#### 예시:

- **`accessDeniedHandler`**는 사용자가 인증을 했지만, 권한이 부족할 때 `403 Forbidden`을 반환하는 핸들러입니다.
- **`authenticationEntryPoint`**는 사용자가 인증되지 않은 상태에서 요청을 보내면, `401 Unauthorized`를 반환하는 핸들러입니다.

```java
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
    }
}

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }
}
```

### 2. **필터 체인 설정 (`http.addFilterBefore(...)`)**

```java
http.addFilterBefore(refreshTokenFilter, AccessTokenFilter .class)
    .

addFilterBefore(accessTokenFilter, UsernamePasswordAuthenticationFilter .class);
```

- **필터 체인**은 요청이 들어오고, 응답을 보내기 전에 **다양한 필터**들이 처리하는 순서를 정의하는 부분입니다. 필터는 요청을 가로채어 인증, 권한 확인, 로깅 등의
  작업을 수행합니다.
- `addFilterBefore()` 메서드는 필터의 순서를 지정하는 데 사용됩니다. 특정 필터가 다른 필터보다 먼저 실행되도록 할 수 있습니다.

#### 설명:

- `refreshTokenFilter`를 **`AccessTokenFilter`보다 먼저** 실행하도록 설정합니다. 즉, `refreshTokenFilter`가 먼저 실행된 후
  `AccessTokenFilter`가 실행됩니다.
    - **`refreshTokenFilter`**는 JWT의 **리프레시 토큰**을 확인하는 필터일 가능성이 큽니다. 이 필터는 사용자가 **액세스 토큰**이 만료되었을 때
      **리프레시 토큰**을 사용하여 새로운 액세스 토큰을 발급받을 수 있도록 합니다.
    - **`AccessTokenFilter`**는 사용자가 요청할 때 **액세스 토큰**의 유효성을 검사하는 필터입니다. 사용자가 보낸 액세스 토큰이 유효한지, 만료되지
      않았는지 등을 확인합니다.

- `accessTokenFilter`를 **`UsernamePasswordAuthenticationFilter`보다 먼저** 실행하도록 설정합니다.
    - `UsernamePasswordAuthenticationFilter`는 기본적으로 **사용자명과 비밀번호**를 사용하여 인증을 처리하는 필터입니다. 하지만 JWT
      인증에서는 액세스 토큰을 사용하기 때문에, 이 필터가 실행되기 전에 **액세스 토큰을 확인**하는 `accessTokenFilter`를 실행하여, JWT 기반 인증을
      수행합니다.

#### 필터 체인 순서:

1. **`refreshTokenFilter`**: 리프레시 토큰을 확인하고, 필요시 새로운 액세스 토큰을 발급하는 필터.
2. **`accessTokenFilter`**: 액세스 토큰의 유효성을 검사하고 인증을 수행하는 필터.
3. **`UsernamePasswordAuthenticationFilter`**: 기본적인 사용자명/비밀번호 인증 필터 (JWT 인증에서는 사용되지 않지만, 순서상 이 필터가
   뒤에 위치).

### 요약:

1. **예외 처리 설정**: `accessDeniedHandler`와 `authenticationEntryPoint`를 통해 권한 부족(`403 Forbidden`)과 인증
   실패(`401 Unauthorized`)를 처리합니다.
2. **필터 체인 구성**:
    - `refreshTokenFilter`를 `AccessTokenFilter`보다 먼저 실행하여 리프레시 토큰을 통해 액세스 토큰을 갱신할 수 있도록 합니다.
    - `accessTokenFilter`는 액세스 토큰의 유효성을 검사하여 인증을 처리합니다.
    - `UsernamePasswordAuthenticationFilter`는 일반적인 사용자명/비밀번호 인증 필터이지만, JWT 인증에서는 사용되지 않습니다.