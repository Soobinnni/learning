package site.soobin.myrestfulservice.domains.auth.application.exception;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import site.soobin.myrestfulservice.commons.exception.ErrorSpec;

@Getter
@RequiredArgsConstructor
public enum TokenErrorSpec implements ErrorSpec {
  TOKEN_UNACCEPT(UNAUTHORIZED, "토큰이 없거나 너무 짧습니다"),
  TOKEN_MALFORM(FORBIDDEN, "잘못된 토큰입니다"),
  ACCESS_TOKEN_EXPIRED(FORBIDDEN, "액세스 토큰이 만료되었습니다"),
  REFRESH_TOKEN_EXPIRED(FORBIDDEN, "리프레시 토큰이 만료되었습니다"),
  ACCESS_TOKEN_BLACKLISTED(FORBIDDEN, "이 액세스 토큰은 사용이 불가능합니다."),
  ACCESS_TOKEN_VALID(UNAUTHORIZED, "현재 액세스 토큰은 유효합니다. 새 토큰이 필요하지 않습니다.");

  private final HttpStatus status;
  private final String message;
  private String code = this.name();
}
