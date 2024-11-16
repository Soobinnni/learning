package site.soobin.myrestfulservice.exception.enums;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;

@Getter
@RequiredArgsConstructor
public enum UserErrorCode implements ErrorCode {
  USER_NOT_FOUND(NOT_FOUND, "User not found")
//  USER_OTHER_EXCEPTION(INTERNAL_SERVER_ERROR, "User other exception"),
;
  private final HttpStatusCode httpStatusCode;
  private final String message;
  private String errorCode = this.name();
}
