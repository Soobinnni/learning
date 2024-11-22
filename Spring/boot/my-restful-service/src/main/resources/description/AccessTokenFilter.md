이 코드는 **Spring Security**의 `OncePerRequestFilter`를 확장하여 JWT 기반 인증을 처리하는 **`AccessTokenFilter`**입니다.
이 필터는 들어오는 HTTP 요청에서 액세스 토큰을 추출하고 유효성을 검사한 뒤, 유효한 경우 인증을 설정하여 요청을 처리합니다. 각 부분의 흐름을 따라가면서 JWT 기반 인증이
어떻게 수행되는지 설명하겠습니다.

### 1. **`doFilterInternal` 메서드**:

이 메서드는 필터가 실행될 때마다 호출되며, 액세스 토큰의 추출, 유효성 검사, 인증 설정 등의 작업을 처리합니다.

```java

@Override
protected void doFilterInternal(
        HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
    if (shouldSkipFilter(request)) {
        filterChain.doFilter(request, response);
        return;
    }

    try {
        String token =
                extractToken(request)
                        .orElseThrow(() -> new TokenException(TokenErrorSpec.TOKEN_UNACCEPT));

        checkBlacklist(token);
        Map<String, Object> claims = validateToken(token);
        setAuthentication(claims);

        filterChain.doFilter(request, response);
    } catch (TokenException e) {
        log.error("Token validation failed: {}", e.getMessage());
        e.sendResponseError(response);
    }
}
```

#### 주요 흐름:

- **`shouldSkipFilter(request)`**: 이 메서드는 요청이 리프레시 토큰을 처리하는 경로(`/api/auth/refresh`)로 들어오는 경우 필터를
  건너뛰도록 설정합니다. 이는 리프레시 토큰은 액세스 토큰의 유효성 검사를 거치지 않기 때문에 해당 요청에 대해서는 필터를 적용하지 않기 위함입니다.

- **`extractToken(request)`**: 요청의 `Authorization` 헤더에서 **Bearer 토큰**을 추출합니다. Bearer 토큰이 없다면
  `TokenException`을 발생시킵니다.

- **`checkBlacklist(token)`**: 추출한 액세스 토큰이 **블랙리스트에 등록되어 있는지** 확인합니다. 만약 블랙리스트에 있다면 `TokenException`
  을 발생시켜 액세스 토큰이 만료되었거나 유효하지 않음을 알려줍니다.

- **`validateToken(token)`**: `JwtUtil`을 사용해 JWT 토큰을 **검증**하고, 유효하다면 토큰의 **클레임**을 반환합니다. 유효하지 않은 경우
  예외가 발생하며, `handleJwtException(e)`에서 적절한 예외로 처리됩니다.

- **`setAuthentication(claims)`**: 유효한 토큰의 클레임에서 인증 정보를 추출하여 **Spring Security의
  `SecurityContextHolder`**에 인증을 설정합니다. 이를 통해 요청이 인증된 상태로 처리됩니다.

### 2. **`extractToken` 메서드**:

```java
private Optional<String> extractToken(HttpServletRequest request) {
    String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
        return Optional.of(bearerToken.substring(7));
    }
    return Optional.empty();
}
```

- `Authorization` 헤더에서 **Bearer 토큰**을 추출합니다. `Bearer `라는 접두사가 포함되어 있기 때문에 이를 제거하고 순수한 토큰 값을 반환합니다. 이
  부분에서 **액세스 토큰**만을 추출하여 후속 처리에서 사용합니다.

### 3. **`checkBlacklist` 메서드**:

```java
private void checkBlacklist(String token) {
    if (tokenBlacklistService.isBlacklisted(token)) {
        throw new TokenException(TokenErrorSpec.ACCESS_TOKEN_EXPIRED);
    }
}
```

- **액세스 토큰이 블랙리스트에 포함되어 있는지 확인**합니다. 예를 들어, 사용자가 로그아웃하거나 토큰을 명시적으로 무효화한 경우, 해당 토큰은 블랙리스트에 추가되고 더 이상
  유효하지 않도록 처리합니다.

### 4. **`validateToken` 메서드**:

```java
private Map<String, Object> validateToken(String token) {
    try {
        return jwtUtil.validateToken(token);
    } catch (Exception e) {
        throw handleJwtException(e);
    }
}
```

- `JwtUtil`을 사용하여 **JWT 토큰의 유효성을 검사**합니다. 유효한 토큰이라면 클레임 정보를 반환하며, 유효하지 않은 경우 예외가 발생합니다.

### 5. **`handleJwtException` 메서드**:

```java
private TokenException handleJwtException(Exception e) {
    if (e instanceof ExpiredJwtException) {
        return new TokenException(TokenErrorSpec.ACCESS_TOKEN_EXPIRED);
    }
    if (e instanceof MalformedJwtException || e instanceof SignatureException) {
        return new TokenException(TokenErrorSpec.TOKEN_MALFORM);
    }
    return new TokenException(TokenErrorSpec.TOKEN_UNACCEPT);
}
```

- **토큰 검증 중 발생할 수 있는 예외들**을 처리합니다. 예를 들어, 토큰이 만료된 경우 `ExpiredJwtException`, 토큰의 형식이 잘못된 경우
  `MalformedJwtException` 또는 서명이 맞지 않는 경우 `SignatureException`을 처리하여 적절한 `TokenException`을 던집니다.

### 6. **`setAuthentication` 메서드**:

```java
private void setAuthentication(Map<String, Object> claims) {
    UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(claims, null, extractAuthorities(claims));
    SecurityContextHolder.getContext().setAuthentication(authentication);
}
```

- 토큰에서 추출한 **클레임**을 기반으로 **`UsernamePasswordAuthenticationToken`** 객체를 생성하고, 이를 **
  `SecurityContextHolder`**에 설정하여 Spring Security의 인증 컨텍스트에 저장합니다.
- 이로 인해 후속 처리에서 인증된 사용자로 요청이 처리됩니다.

### 7. **`extractAuthorities` 메서드**:

```java
private List<GrantedAuthority> extractAuthorities(Map<String, Object> claims) {
    return List.of(new SimpleGrantedAuthority("ROLE_" + claims.get("role")));
}
```

- 토큰의 **클레임**에서 역할(role)을 추출하고, 이를 기반으로 **`GrantedAuthority`**를 생성하여 사용자 권한을 설정합니다. 예를 들어, `role`
  클레임에 `"USER"`가 있다면 `ROLE_USER` 권한을 부여합니다.

### 8. **`shouldSkipFilter` 메서드**:

```java
private boolean shouldSkipFilter(HttpServletRequest request) {
    return request.getRequestURI().equals("/api/auth/refresh");
}
```

- **리프레시 토큰**을 처리하는 요청 경로(`/api/auth/refresh`)에 대해서는 **액세스 토큰 필터**를 적용하지 않도록 설정합니다. 리프레시 토큰은 별도로
  처리되므로 액세스 토큰 검증을 생략합니다.

---

### **JWT 기반 인증 흐름 요약**:

1. **액세스 토큰 추출**: 클라이언트는 요청 헤더에 JWT 토큰을 포함하여 서버에 요청을 보냅니다.
2. **블랙리스트 확인**: 서버는 해당 액세스 토큰이 **블랙리스트**에 포함되어 있는지 확인합니다.
3. **토큰 유효성 검사**: 서버는 `JwtUtil`을 통해 토큰이 **유효한지** 검사합니다. 만약 유효하지 않으면 예외를 발생시킵니다.
4. **인증 설정**: 토큰이 유효하다면, 토큰에서 **사용자 정보를** 추출하여 Spring Security의 **인증 정보**로 설정합니다.
5. **요청 처리**: 인증된 사용자의 요청은 후속 필터와 핸들러를 통해 처리됩니다.

이 과정은 **액세스 토큰이 유효한지 검사**하고, 유효하다면 **인증된 상태로 요청을 처리**할 수 있게 합니다.