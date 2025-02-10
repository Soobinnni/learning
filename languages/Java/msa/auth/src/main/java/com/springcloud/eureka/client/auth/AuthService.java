package com.springcloud.eureka.client.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final SecretKey secretKey;

  @Value("${spring.application.name}")
  private String issuer;

  @Value("${service.jwt.access-expiration}")
  private Long accessExpiration;

  /**
   * AuthService 생성자. Base64 URL 인코딩된 비밀 키를 디코딩하여 HMAC-SHA 알고리즘에 적합한 SecretKey 객체를 생성합니다.
   *
   * @param secretKey Base64 URL 인코딩된 비밀 키
   */
  public AuthService(@Value("${service.jwt.secret-key}") String secretKey) {
    this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(secretKey));
  }

  /**
   * 사용자 ID를 받아 JWT 액세스 토큰을 생성합니다.
   *
   * @param user_id 사용자 ID
   * @return 생성된 JWT 액세스 토큰
   */
  public String createAccessToken(String user_id) {
    return Jwts.builder()
        // 사용자 ID를 클레임으로 설정
        .claim("user_id", user_id)
        .claim("role", "ADMIN")
        // JWT 발행자를 설정
        .issuer(issuer)
        // JWT 발행 시간을 현재 시간으로 설정
        .issuedAt(new Date(System.currentTimeMillis()))
        // JWT 만료 시간을 설정
        .expiration(new Date(System.currentTimeMillis() + accessExpiration))
        // SecretKey를 사용하여 HMAC-SHA512 알고리즘으로 서명
        // .signWith(secretKey, SignatureAlgorithm.HS512)
        .signWith(secretKey, Jwts.SIG.HS512)
        // JWT 문자열로 컴팩트하게 변환
        .compact();
  }
}

/**
 * [.signWith(secretKey, SignatureAlgorithm.HS512) -> .signWith(secretKey, Jwts.SIG.HS512) 변경]
 *
 * <p>- 기존 SignatureAlgorithm은 HMAC, RSA, EC 등 다양한 알고리즘을 하나의 클래스에서 관리하는 방식. <br>
 * - 하지만 이 방식은 키 타입과 알고리즘 간의 불일치로 인해 보안적인 취약점이 발생할 가능성이 있어 Deprecated 됨.
 *
 * <p>- Jwts.SIG.HS512는 MacAlgorithm 인터페이스를 구현한 객체로, HMAC 기반 알고리즘만 처리할 수 있도록 설계되었다. <br>
 * - 이를 통해 RSA 키를 HMAC 알고리즘에 잘못 사용하는 실수를 원천적으로 방지할 수 있으며, 컴파일 단계에서 오류를 발생시켜 보다 안전한 구현이 가능. <br>
 * - HMAC: 대칭키 기반의 해시 서명 방식 (예: HS256, HS512) <br>
 * - RSA: 비대칭키(공개키-개인키) 기반의 암호화 및 서명 방식 (예: RS256, RS512)
 */
