package site.soobin.myrestfulservice.domains.auth.presentation.filter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import site.soobin.myrestfulservice.domains.auth.application.exception.AuthenticationException;
import site.soobin.myrestfulservice.domains.auth.application.exception.TokenErrorSpec;
import site.soobin.myrestfulservice.domains.auth.application.service.TokenBlacklistService;
import site.soobin.myrestfulservice.domains.auth.domain.JwtClaims;
import site.soobin.myrestfulservice.domains.auth.presentation.utils.JwtUtil;

@Component
@RequiredArgsConstructor
@Log4j2
/**
 * Spring Security의 OncePerRequestFilter를 확장하여 JWT 기반 인증을 처리하는 AccessTokenFilter. 이 필터는 들어오는 HTTP
 * 요청에서 액세스 토큰을 추출하고 유효성을 검사한 뒤, 유효한 경우 인증을 설정하여 요청을 처리
 */
public class AccessTokenFilter extends OncePerRequestFilter {
  private final JwtUtil jwtUtil;
  private final TokenBlacklistService tokenBlacklistService;
  private final String REFRESH_URI = "/api/auth/refresh";

  @Override
  /** 이 메서드는 필터가 실행될 때마다 호출되며, 액세스 토큰의 추출, 유효성 검사, 인증 설정 등의 작업을 처리 정리-> */
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    // [큰 개요]
    // refresh uri 패스 -> black list 확인 -> token 검증 -> 유효하면 등록
    // 이 과정은 액세스 토큰이 유효한지 검사하고, 유효하다면 인증된 상태로 요청을 처리할 수 있게 한다.

    // 요청이 리프레시 토큰을 처리하는 경로(/api/auth/refresh)로 들어오는 경우 필터를 건너뛰도록 설정
    // 리프레시 토큰은 액세스 토큰의 유효성 검사를 거치지 않기 때문에 해당 요청에 대해서는 필터를 적용하지 않기 위함
    if (shouldSkipFilter(request)) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      // 메서드의 반환을 Optional로 하여 Authorization 헤더에서 Bearer 토큰을 추출, 없다면 exception 발생
      String token =
          extractToken(request)
              .orElseThrow(() -> new AuthenticationException(TokenErrorSpec.TOKEN_UNACCEPT));

      // 추출한 액세스 토큰이 블랙리스트에 등록되어 있는지 확인(TokenBlacklistService)
      // 액세스 토큰이 만료되었거나 유효하지 않음을 알려준다.
      // 예를 들어, 사용자가 로그아웃하거나 토큰을 명시적으로 무효화한 경우, 해당 토큰은 블랙리스트에 추가되고 더 이상 유효하지 않도록 처리
      checkBlacklist(token);

      // JwtUtil을 사용하여 JWT 토큰의 유효성을 검사, 유효한 토큰이라면 클레임 정보를 반환하며, 유효하지 않은 경우 예외가 발생
      JwtClaims claims = validateToken(token);

      // 토큰에서 추출한 클레임을 기반으로 UsernamePasswordAuthenticationToken 객체를 생성하고,
      // 이를 SecurityContextHolder에 설정하여 Spring Security의 인증 컨텍스트에 저장
      setAuthentication(claims);

      filterChain.doFilter(request, response);
    } catch (AuthenticationException e) {
      log.error("Token validation failed: {}", e.getMessage());
      e.sendResponseError(request, response);
    }
  }

  private Optional<String> extractToken(HttpServletRequest request) {
    // Authorization 헤더에서 Bearer 토큰을 추출
    String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
      return Optional.of(bearerToken.substring(7));
    }
    return Optional.empty();
  }

  private void checkBlacklist(String token) {
    if (tokenBlacklistService.isBlacklisted(token)) {
      throw new AuthenticationException(TokenErrorSpec.ACCESS_TOKEN_BLACKLISTED);
    }
  }

  private JwtClaims validateToken(String token) {
    try {
      // JWT의 유효성을 검증
      return jwtUtil.validateToken(token);
    } catch (Exception e) {
      throw handleJwtException(e);
    }
  }

  private AuthenticationException handleJwtException(Exception e) {
    // JWT util에서 던져진 토큰 검증 중 발생할 수 있는 예외들을 처리
    if (e instanceof ExpiredJwtException) {
      return new AuthenticationException(TokenErrorSpec.ACCESS_TOKEN_EXPIRED);
    }
    if (e instanceof MalformedJwtException || e instanceof SignatureException) {
      return new AuthenticationException(TokenErrorSpec.TOKEN_MALFORM);
    }
    return new AuthenticationException(TokenErrorSpec.TOKEN_UNACCEPT);
  }

  private void setAuthentication(JwtClaims claims) {
    UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(claims, null, extractAuthorities(claims));
    SecurityContextHolder.getContext().setAuthentication(authentication);
  }

  private List<GrantedAuthority> extractAuthorities(JwtClaims claims) {
    // 토큰의 클레임에서 역할(role)을 추출하고, 이를 기반으로 GrantedAuthority를 생성하여 사용자 권한을 설정합니다. 예를 들어, role 클레임에
    // "USER"가 있다면 ROLE_USER 권한을 부여
    return List.of(new SimpleGrantedAuthority("ROLE_" + claims.role()));
  }

  private boolean shouldSkipFilter(HttpServletRequest request) {
    return request.getRequestURI().equals(REFRESH_URI);
  }
}
