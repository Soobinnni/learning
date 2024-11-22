package site.soobin.myrestfulservice.domains.auth.presentation.utils;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import site.soobin.myrestfulservice.domains.auth.application.exception.AuthenticationException;
import site.soobin.myrestfulservice.domains.auth.application.exception.TokenErrorSpec;
import site.soobin.myrestfulservice.domains.auth.domain.JwtClaims;
import site.soobin.myrestfulservice.domains.auth.domain.TokenType;

@Component
@Log4j2
// JwtUtil 클래스는 JWT (JSON Web Token)를 [생성]하고 [검증]하는 유틸리티 클래스로,
// 액세스 토큰과 리프레시 토큰을 다루기 위한 여러 메서드를 제공
public class JwtUtil {

  @Value("${jwt-secret}")
  private String key;

  // 액세스 토큰 생성 -> 사용자 정보와 같은 클레임을 valueMap으로 받아, 이를 기반으로 JWT를 생성
  public String generateAccessToken(JwtClaims claims) {
    return generateToken(claims, TokenType.ACCESS);
  }

  // 리프레시 토큰 생성 -> 사용자 정보와 같은 클레임을 valueMap으로 받아, 이를 기반으로 JWT를 생성
  public String generateRefreshToken(JwtClaims claims) {
    return generateToken(claims, TokenType.REFRESH);
  }

  // 토큰 생성 공통 로직
  // 액세스 토큰과 리프레시 토큰 생성의 공통 로직을 처리하는 메서드
  // 토큰의 헤더, 페이로드(클레임), 만료 시간을 설정하고, HMAC-SHA256 방식으로 서명하여 JWT를 생성
  private String generateToken(JwtClaims claims, TokenType tokenType) {
    Map<String, Object> headers = createHeaders();
    Map<String, Object> payloads = new HashMap<>(claims.toMap());

    return Jwts.builder()
        .header()
        .add(headers)
        .and()
        .claims(payloads)
        .issuedAt(Date.from(ZonedDateTime.now().toInstant()))
        .expiration(calculateExpiryDate(tokenType))
        .signWith(getSigningKey())
        .compact();
  }

  // 토큰 검증: 전달받은 JWT를 검증하는 메서드
  // JWT는 헤더(Header), 페이로드(Payload), 서명(Signature)으로 구성
  //    -> 이 메서드는 서명된 부분을 검증하고, 페이로드를 추출하는 과정
  // JWT가 만료되었거나 형식이 잘못된 경우, 또는 서명이 맞지 않으면 예외를 던짐
  // 검증에 성공하면 클레임(payload)을 반환
  public JwtClaims validateToken(String token) throws AuthenticationException {
    try {
      // Jwts.parser()는 JWT를 파싱할 수 있는 객체를 생성하는 메서드
      // 이 객체를 통해 JWT 토큰을 처리하고, 유효성을 검사
      Map<String, Object> mapClaims =
          Jwts.parser()
              .verifyWith(getSigningKey()) // JWT의 서명을 검증하기 위한 서명 키를 설정하는 메서드
              .build()
              .parseSignedClaims(
                  token) // JWT 토큰을 파싱하여, 토큰의 서명된 부분을 검증한 후, 토큰에 포함된 클레임(payload)을 반환하는 메서드
              // JWT의 서명이 올바르게 서명된 것인지 확인
              // 서명이 유효하면 페이로드(Payload)를 추출하여 반환
              // 페이로드에는 토큰에 저장된 실제 데이터(예: 사용자 정보, 권한 정보 등)가 포함
              // Map<String, Object> 형태로, JWT에서 추출된 클레임을 포함
              .getPayload(); // 클레임 반환(이 데이터는 JWT 토큰을 발급할 때 설정한 값)
      return JwtClaims.fromMap(mapClaims);
    } catch (ExpiredJwtException e) {
      log.error("Token expired: {}", e.getMessage());
      throw new AuthenticationException(TokenErrorSpec.ACCESS_TOKEN_EXPIRED);
    } catch (MalformedJwtException e) {
      log.error("Invalid token format: {}", e.getMessage());
      throw new AuthenticationException(TokenErrorSpec.TOKEN_MALFORM);
    } catch (SignatureException e) {
      log.error("Invalid token format: {}", e.getMessage());
      throw new AuthenticationException(TokenErrorSpec.TOKEN_MALFORM);
    } catch (Exception e) {
      log.error("Token validation failed: {}", e.getMessage());
      throw new AuthenticationException(TokenErrorSpec.TOKEN_UNACCEPT);
    }
  }

  private Map<String, Object> createHeaders() {
    return Map.of(
        "typ", "JWT",
        "alg", "HS256");
  }

  private Date calculateExpiryDate(TokenType tokenType) {
    // token type에 따라 유효 시간을 유연하게 설정
    return Date.from(ZonedDateTime.now().plusDays(tokenType.getExpiryDays()).toInstant());
  }

  private SecretKey getSigningKey() {
    // 서명에 사용할 비밀키 반환
    return Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));
  }
}
