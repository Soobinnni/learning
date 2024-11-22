`configuration.setMaxAge(3600L);`는 CORS 설정에서 **캐시 유효 시간**을 설정하는 부분으로, 클라이언트가 CORS 정책을 재요청 없이 일정 시간
동안 재사용할 수 있도록 합니다. `maxAge` 값은 클라이언트가 CORS 정책을 다시 확인할 때까지의 시간(초 단위)을 지정합니다. 3600초(1시간)로 설정하면 클라이언트는
1시간 동안 같은 CORS 정책을 캐시할 수 있습니다.

### 예시 설명

1. 클라이언트가 첫 번째 요청을 보낼 때, 서버는 CORS 헤더를 포함하여 응답합니다.
2. 이 응답에 `Access-Control-Max-Age` 헤더가 포함되어 있으면, 클라이언트는 해당 헤더에 지정된 시간 동안 동일한 CORS 정책을 캐시하고, 이후 요청 시
   캐시된 CORS 정보를 사용하여 서버에 다시 CORS 요청을 하지 않습니다.
3. `maxAge` 값을 설정하지 않으면 매번 CORS 요청을 보내야 하므로 서버와 클라이언트의 부하가 증가할 수 있습니다.

### 예시 1: CORS 응답 헤더

서버에서 클라이언트로 응답이 올 때, `Access-Control-Max-Age` 헤더를 포함하여 CORS 정책을 전달합니다.

#### 서버 응답 예시:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 3600
Content-Type: application/json
```

#### 설명:

- **`Access-Control-Max-Age: 3600`**: 이 헤더는 클라이언트에게 CORS 정책을 1시간 동안 캐시할 수 있도록 지시합니다.
- 이 설정으로 인해, 클라이언트는 1시간 동안 같은 출처와 동일한 메서드, 헤더를 가진 요청에 대해서는 서버에 CORS 프리플라이트 요청을 보내지 않고 바로 요청을 보낼 수
  있습니다.

### 예시 2: 클라이언트 요청

클라이언트가 첫 번째 요청을 보낼 때, 서버는 CORS 응답을 포함하여 반환합니다. 이후 클라이언트는 `Access-Control-Max-Age` 값을 기반으로 1시간 동안 재요청
없이 CORS 정책을 캐시합니다.

#### 첫 번째 요청:

클라이언트에서 `https://example.com`에서 `https://api.server.com`으로 요청을 보냅니다.

```http
OPTIONS /api/resource HTTP/1.1
Host: api.server.com
Origin: https://example.com
Access-Control-Request-Method: GET
Access-Control-Request-Headers: Content-Type
```

#### 서버 응답:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600
```

이 응답 후, 클라이언트는 1시간 동안 이 CORS 정책을 캐시하고, `OPTIONS` 요청을 재전송하지 않습니다. 1시간 내에 다른 요청을 보낼 때는
`Access-Control-Max-Age`가 유효하므로, CORS 프리플라이트 요청 없이 바로 요청을 보낼 수 있습니다.

#### 이후 요청:

```http
GET /api/resource HTTP/1.1
Host: api.server.com
Origin: https://example.com
```

이후 1시간 내에 클라이언트는 CORS 프리플라이트 요청 없이 바로 `GET` 요청을 보낼 수 있습니다.

### 요약:

- `Access-Control-Max-Age: 3600` 설정은 클라이언트가 1시간 동안 CORS 정책을 캐시할 수 있도록 합니다.
- 이를 통해 CORS 프리플라이트 요청을 줄이고, 네트워크 효율성을 높일 수 있습니다.