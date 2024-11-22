package site.soobin.myrestfulservice.commons.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.web.context.request.WebRequest;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ApiErrorResponseFactory {
  public static ApiErrorResponse createResponse(ErrorSpec errorSpec) {
    return createResponse(errorSpec, null, null);
  }

  public static ApiErrorResponse createResponse(ErrorSpec errorSpec, Object request) {
    return createResponse(errorSpec, request, null);
  }

  public static ApiErrorResponse createResponse(
      ErrorSpec errorSpec, Object request, Map<String, String> details) {
    return ApiErrorResponse.builder()
        .code(errorSpec.getClass().getSimpleName())
        .message(errorSpec.getMessage())
        .status(errorSpec.getStatus().value())
        .path(extractPath(request))
        .details(details)
        .build();
  }

  private static String extractPath(Object request) {
    if (request == null) {
      return null;
    }

    if (request instanceof WebRequest) {
      return ((WebRequest) request).getDescription(false);
    }

    if (request instanceof HttpServletRequest) {
      return ((HttpServletRequest) request).getRequestURI();
    }

    return null;
  }
}
