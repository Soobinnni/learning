package site.soobin.myrestfulservice.domains.auth.domain;

import java.util.Map;
import lombok.Builder;

@Builder
public record JwtClaims(
    Long id, // 사용자 ID
    String role, // 사용자 역할
    String iss, // 토큰 발급자 (iss)
    String aud, // 토큰 대상자 (aud)
    Long iat, // 발급 시간 (iat, 초 단위)
    Long exp // 만료 시간 (exp, 초 단위)
    ) {

  public static JwtClaims fromMap(Map<String, Object> claims) {
    return JwtClaims.builder()
        .id((Long) claims.get("id"))
        .role((String) claims.get("role"))
        .iss((String) claims.get("iss"))
        .aud((String) claims.get("aud"))
        .iat((Long) claims.get("iat")) // 초 단위 그대로 가져옴
        .exp((Long) claims.get("exp")) // 초 단위 그대로 가져옴
        .build();
  }

  public Map<String, Object> toMap() {
    return Map.of(
        "id", id,
        "role", role,
        "iss", iss,
        "aud", aud,
        "iat", iat, // 초 단위 그대로 저장
        "exp", exp // 초 단위 그대로 저장
        );
  }
}
