package site.soobin.myrestfulservice.domains.auth.application.service;

import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import site.soobin.myrestfulservice.domains.auth.application.exception.AuthenticationException;
import site.soobin.myrestfulservice.domains.auth.domain.BlacklistRepository;
import site.soobin.myrestfulservice.domains.auth.domain.BlacklistedToken;
import site.soobin.myrestfulservice.domains.auth.domain.JwtClaims;
import site.soobin.myrestfulservice.domains.auth.presentation.utils.JwtUtil;

@Service
@Log4j2
@RequiredArgsConstructor
public class TokenBlacklistService {

  private final BlacklistRepository repository;
  private final JwtUtil jwtUtil;

  // 주어진 토큰을 블랙리스트에 추가하는 역할(후에 user service에서 로그아웃 시 사용될 것)
  public void addToBlacklist(String token) {
    try {
      // JWT 토큰을 검증 후 유효하면 클레임 추출
      JwtClaims claims = jwtUtil.validateToken(token);

      // 클레임에서 유효시간 계산 후
      Long expirationTime = calculateExpirationTime(claims);

      // 만약 만료 시간이 유효한 경우(토큰이 만료되지 않은 경우),
      // Redis에 해당 토큰을 blacklist:{token} 형식의 키로 저장하고, 만료 시간을 설정
      // 블랙리스트에 추가된 토큰은 마스킹 처리하여 로깅
      if (expirationTime > 0) {
        BlacklistedToken blacklistedToken =
            BlacklistedToken.builder().token(token).expirationTime(expirationTime).build();
        repository.save(blacklistedToken);
        log.info("Token added to blacklist: {}", maskToken(token));
      }
    } catch (AuthenticationException e) {
      log.warn("Failed to add invalid token to blacklist: {}", e.getMessage());
    }
  }

  // 주어진 토큰이 블랙리스트에 존재하는지 확인 후 로그 처리
  public boolean isBlacklisted(String token) {
    boolean isBlacklisted = repository.existsById(token);
    if (isBlacklisted) {
      log.debug("Token found in blacklist: {}", maskToken(token));
    }
    return isBlacklisted;
  }

  // 만료 시간 계산
  private Long calculateExpirationTime(JwtClaims claims) {
    Date expiration = new Date(claims.exp() * 1000);
    return expiration.getTime() - System.currentTimeMillis();
  }

  // 로깅을 위한 토큰 마스킹(토큰을 로깅할 때, 민감한 정보를 숨기기 위해 마스킹 처리)
  // 토큰이 길면 처음 5자와 끝 5자만 보여주고, 나머지는 ...으로 대체하여 출력합니다. 만약 토큰이 10자 이하라면 전체를 *로 마스킹
  private String maskToken(String token) {
    if (token.length() <= 10) return "*".repeat(token.length());
    return token.substring(0, 5) + "..." + token.substring(token.length() - 5);
  }
}
