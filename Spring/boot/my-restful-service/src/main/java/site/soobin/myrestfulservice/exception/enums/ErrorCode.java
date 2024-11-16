package site.soobin.myrestfulservice.exception.enums;

import org.springframework.http.HttpStatusCode;

public interface ErrorCode {
  HttpStatusCode getHttpStatusCode();

  String getMessage();

  String getErrorCode();
}
