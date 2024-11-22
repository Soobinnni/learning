package site.soobin.myrestfulservice.domains.auth.application.exception;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import site.soobin.myrestfulservice.commons.exception.ErrorSpec;

@Getter
@RequiredArgsConstructor
public enum AuthErrorSpec implements ErrorSpec {
  NEED_AUTHENTICATION(UNAUTHORIZED, "인증이 필요한 엔드포인트입니다."),
  NO_AUTHENTICATION(FORBIDDEN, "해당 리소스에 대한 권한이 없습니다.");

  private final HttpStatus status;
  private final String message;
  private String code = this.name();
}
