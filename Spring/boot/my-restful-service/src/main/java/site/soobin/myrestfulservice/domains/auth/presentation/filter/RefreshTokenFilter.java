package site.soobin.myrestfulservice.domains.auth.presentation.filter;

import com.google.gson.Gson;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Reader;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import site.soobin.myrestfulservice.domains.auth.application.dto.TokenRequest;
import site.soobin.myrestfulservice.domains.auth.application.dto.TokenResponse;
import site.soobin.myrestfulservice.domains.auth.application.exception.AuthenticationException;
import site.soobin.myrestfulservice.domains.auth.application.exception.TokenErrorSpec;
import site.soobin.myrestfulservice.domains.auth.application.service.TokenBlacklistService;
import site.soobin.myrestfulservice.domains.auth.domain.JwtClaims;
import site.soobin.myrestfulservice.domains.auth.presentation.utils.JwtUtil;

@Component
@RequiredArgsConstructor
@Log4j2
public class RefreshTokenFilter extends OncePerRequestFilter {
  private final String REFRESH_URI = "/api/auth/refresh";
  private final JwtUtil jwtUtil;
  private final TokenBlacklistService tokenBlacklistService;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    // 필터는 요청 URI가 /api/auth/refresh인 경우에만 동작
    // 그렇지 않으면 필터 체인에서 넘어간다.
    if (!request.getRequestURI().equals(REFRESH_URI)) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      // 클라이언트가 보낸 요청에서 액세스 토큰과 리프레시 토큰을 추출
      TokenRequest tokenRequest = extractTokenRequest(request);

      // refresh token 처리
      // 1. Access Token 검증 (만료 예상) -> 2. Refresh Token 검증 -> 3. 새 토큰 발급
      TokenResponse tokenResponse = processRefreshToken(tokenRequest);

      // 정상 처리 후 응답으로 토큰 반환
      sendTokenResponse(response, tokenResponse);
    } catch (AuthenticationException e) {
      log.error("Refresh token 처리 실패: {}", e.getMessage());
      //      e.sendResponseError(request, response);
    }
  }

  private TokenRequest extractTokenRequest(HttpServletRequest request) throws IOException {
    // request.getReader()는 HttpServletRequest 객체에서 요청 본문(request body)을 읽기 위한 메서드
    // 이 메서드는 BufferedReader 객체를 반환하며, 이를 통해 요청 본문에 포함된 데이터를 문자열로 읽을 수 있다.
    // request.getReader()는 클라이언트로부터 전송된 JSON 형태의 데이터를 TokenRequest 객체로 변환하는 데 사용
    // 즉 JSON 데이터를 TokenRequest 객체로 변환
    try (Reader reader = request.getReader()) {
      return new Gson().fromJson(reader, TokenRequest.class);
    }
  }

  private TokenResponse processRefreshToken(TokenRequest request) {
    // Access Token 검증 (만료 예상)
    checkAccessToken(request.accessToken());

    String refreshToken = request.refreshToken();
    // Refresh Token 검증
    JwtClaims refreshClaims = validateRefreshToken(refreshToken);

    // 모두 다 통과했다면 -> 새 토큰 발급
    return generateNewTokens(refreshClaims, refreshToken);
  }

  private void checkAccessToken(String accessToken) {
    try {
      jwtUtil.validateToken(accessToken);
      // Access Token이 아직 유효하면 갱신 불필요
      throw new AuthenticationException(TokenErrorSpec.ACCESS_TOKEN_VALID);
    } catch (ExpiredJwtException e) {
      // 만료된 경우는 정상 케이스
      log.debug("Access token is expired as expected");
    }
  }

  private JwtClaims validateRefreshToken(String refreshToken) {
    // 블랙리스트 체크
    if (tokenBlacklistService.isBlacklisted(refreshToken)) {
      throw new AuthenticationException(TokenErrorSpec.REFRESH_TOKEN_EXPIRED);
    }

    try {
      // refresh token 유효성 검사
      return jwtUtil.validateToken(refreshToken);
    } catch (Exception e) {
      throw handleJwtException(e);
    }
  }

  private void sendTokenResponse(HttpServletResponse response, TokenResponse tokenResponse)
      throws IOException {
    // 응답으로 토큰 반환
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding("UTF-8");

    String jsonResponse = new Gson().toJson(tokenResponse);

    // getWriter()는 응답을 클라이언트에게 출력할 때 사용
    // 이를 통해 서버는 응답 본문에 데이터를 쓰기 시작할 수 있다(문자열을 응답 본문에 기록).
    // `/api/auth/refresh` GET 요청에 대한 응답에서 서버가 데이터를 반환하는 역할
    response.getWriter().write(jsonResponse);
  }

  private TokenResponse generateNewTokens(JwtClaims refreshClaims, String refreshToken) {
    // 기존 클레임에서 필요한 정보 추출, 새 클레임 생성
    JwtClaims claims =
        JwtClaims.builder().id(refreshClaims.id()).role(refreshClaims.role()).build();

    // 새 액세스 토큰 생성
    String newAccessToken = jwtUtil.generateAccessToken(claims);

    // Refresh 토큰 만료 임박 체크 및 재발급
    String newRefreshToken =
        shouldRefreshToken(refreshClaims)
            ? jwtUtil.generateRefreshToken(claims)
            : refreshToken; // null이면 클라이언트는 기존 refresh token 계속 사용

    return TokenResponse.builder()
        .accessToken(newAccessToken)
        .refreshToken(newRefreshToken) // 필요한 경우만 새로 발급
        .claims(claims)
        .build();
  }

  private boolean shouldRefreshToken(JwtClaims refreshClaims) {
    // refresh token 만료 시간 확인
    Long exp = (Long) refreshClaims.exp();
    Date expTime = new Date(exp * 1000L);
    Date current = new Date();

    // 만료 3일 전부터 갱신
    long thresholdTime = 3 * 24 * 60 * 60 * 1000L; // 3일
    return (expTime.getTime() - current.getTime()) < thresholdTime;
  }

  private AuthenticationException handleJwtException(Exception e) {
    if (e instanceof ExpiredJwtException) {
      log.error("Token expired: {}", e.getMessage());
      return new AuthenticationException(TokenErrorSpec.REFRESH_TOKEN_EXPIRED);
    }
    if (e instanceof MalformedJwtException || e instanceof SignatureException) {
      log.error("Malformed token: {}", e.getMessage());
      return new AuthenticationException(TokenErrorSpec.TOKEN_MALFORM);
    }
    log.error("Unacceptable token: {}", e.getMessage());
    return new AuthenticationException(TokenErrorSpec.TOKEN_UNACCEPT);
  }
}
