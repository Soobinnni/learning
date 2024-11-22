package site.soobin.myrestfulservice.commons.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import site.soobin.myrestfulservice.commons.util.ValidationErrorUtil;
import site.soobin.myrestfulservice.domains.auth.application.exception.AuthenticationException;

@RestControllerAdvice
@Log4j2
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(Exception.class)
  public final ResponseEntity<ApiErrorResponse> handleAllExceptions(
      Exception exception, WebRequest request) {
    ApiErrorResponse response =
        ApiErrorResponseFactory.createResponse(GlobalErrorSpec.INTERNAL_ERROR, request);
    return buildResponse(exception, response);
  }

  @ExceptionHandler(ApiBusinessException.class)
  public final ResponseEntity<ApiErrorResponse> handleApiErrorResponse(
      ApiBusinessException exception, WebRequest request) {
    ApiErrorResponse response =
        ApiErrorResponseFactory.createResponse(exception.getErrorSpec(), request);
    return buildResponse(exception, response);
  }

  @ExceptionHandler(AuthenticationException.class)
  public final ResponseEntity<ApiErrorResponse> handleAuthenticationException(
      AuthenticationException exception, WebRequest request) {
    ApiErrorResponse response =
        ApiErrorResponseFactory.createResponse(exception.getErrorSpec(), request);
    return buildResponse(exception, response);
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException exception,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    ApiErrorResponse response =
        ApiErrorResponseFactory.createResponse(
            GlobalErrorSpec.INVALID_INPUT,
            request,
            ValidationErrorUtil.extractFieldErrors(exception));
    return buildResponse(exception, response);
  }

  private <T> ResponseEntity<T> buildResponse(Exception exception, ApiErrorResponse response) {
    logErrorIfEnabled(exception, response, true);
    return new ResponseEntity<>((T) response, HttpStatusCode.valueOf(response.getStatus()));
  }

  private void logErrorIfEnabled(
      Exception exception, ApiErrorResponse response, boolean shouldLog) {
    if (shouldLog) {
      log.error(
          "Exception: system message: {}, response body: {}", exception.getMessage(), response);
    }
  }
}
