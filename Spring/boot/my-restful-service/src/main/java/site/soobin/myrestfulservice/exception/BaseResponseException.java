package site.soobin.myrestfulservice.exception;

import lombok.Getter;
import site.soobin.myrestfulservice.exception.enums.ErrorCode;

@Getter
public class BaseResponseException extends RuntimeException {
  private final ErrorCode errorCode;

  public BaseResponseException(ErrorCode errorCode) {
    super(errorCode.getMessage());
    this.errorCode = errorCode;
  }
}
