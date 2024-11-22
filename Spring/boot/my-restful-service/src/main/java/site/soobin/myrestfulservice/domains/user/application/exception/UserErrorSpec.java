package site.soobin.myrestfulservice.domains.user.application.exception;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import site.soobin.myrestfulservice.commons.exception.ErrorSpec;

@Getter
@RequiredArgsConstructor
public enum UserErrorSpec implements ErrorSpec {
  USER_NOT_FOUND(NOT_FOUND, "User not found")
//  USER_OTHER_EXCEPTION(INTERNAL_SERVER_ERROR, "User other exception"),
;
  private final HttpStatusCode status;
  private final String message;
  private String code = this.name();
}
