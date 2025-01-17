package site.soobin.myrestfulservice.exception;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import site.soobin.myrestfulservice.exception.enums.ErrorCode;

@RestControllerAdvice
@Slf4j // 로깅 추가
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
  private static final String INVALID_INPUT_ERROR_CODE = "INVALID_INPUT";
  private static final String INVALID_INPUT_MESSAGE = "Validation failed";

  @ExceptionHandler(Exception.class)
  public final ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
    String exceptionMessage = ex.getMessage();

    log.error("Handle handleAllExceptions: {}", exceptionMessage);
    ErrorResponse errorResponse = initializeCommonErrorFields(exceptionMessage, request).build();

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public final ResponseEntity<Object> handleUserNotFoundException(
      Exception ex, WebRequest request) {
    String exceptionMessage = ex.getMessage();

    log.error("Handle user not found: {}", exceptionMessage);
    ErrorResponse errorResponse = initializeCommonErrorFields(exceptionMessage, request).build();

    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(BaseResponseException.class)
  public final ResponseEntity<ErrorResponse> handleBaseException(
      BaseResponseException ex, WebRequest request) {
    ErrorCode errorCode = ex.getErrorCode();
    String exceptionMessage = ex.getMessage();
    int httpStatusCode = errorCode.getHttpStatusCode().value();

    log.error("Handle BaseResponseException: {}", exceptionMessage);

    ErrorResponse errorResponse =
        initializeCommonErrorFields(exceptionMessage, request)
            .errorCode(errorCode.getErrorCode())
            .build();

    return ResponseEntity.status(httpStatusCode).body(errorResponse);
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    Map<String, String> errors = new HashMap<>();

    // BindingResult에서 모든 필드 에러 가져오기
    ex.getBindingResult()
        .getFieldErrors()
        .forEach(
            error -> {
              String fieldName = error.getField(); // 오류가 발생한 필드 이름
              String errorMessage = error.getDefaultMessage(); // 해당 필드의 오류 메시지
              errors.put(fieldName, errorMessage); // 필드 이름과 메시지를 Map에 추가
            });

    ErrorResponse errorResponse =
        ErrorResponse.builder()
            .timestamp(new Date())
            .errorCode(INVALID_INPUT_ERROR_CODE)
            .message(INVALID_INPUT_MESSAGE)
            .details(errors)
            .build();
    return ResponseEntity.status(status.value()).body(errorResponse);
  }

  private ErrorResponse.ErrorResponseBuilder initializeCommonErrorFields(
      String exceptionMessage, WebRequest request) {
    return ErrorResponse.builder()
        .timestamp(new Date())
        .message(exceptionMessage)
        .details(request.getDescription(false));
  }
}
