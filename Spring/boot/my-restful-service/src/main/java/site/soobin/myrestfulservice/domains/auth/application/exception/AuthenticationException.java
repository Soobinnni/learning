package site.soobin.myrestfulservice.domains.auth.application.exception;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.Getter;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import site.soobin.myrestfulservice.commons.exception.ApiErrorResponse;
import site.soobin.myrestfulservice.commons.exception.ApiErrorResponseFactory;
import site.soobin.myrestfulservice.commons.exception.ErrorSpec;

@Log4j2
@Getter
public class AuthenticationException extends RuntimeException {

  private final ErrorSpec errorSpec;

  public AuthenticationException(ErrorSpec errorSpec) {
    super(errorSpec.getMessage());
    this.errorSpec = errorSpec;
  }

  public void sendResponseError(HttpServletRequest request, HttpServletResponse response) {
    try {
      configureResponse(response);
      writeErrorResponse(request, response);
    } catch (IOException e) {
      log.error("Error sending response: {}", e.getMessage());
      throw new RuntimeException("Failed to send error response", e);
    }
  }

  private void configureResponse(HttpServletResponse response) {
    response.setStatus(getErrorSpec().getStatus().value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding("UTF-8");
  }

  private void writeErrorResponse(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    ApiErrorResponse errorResponse = createErrorResponse(request);
    String jsonResponse = convertToJson(errorResponse);
    response.getWriter().write(jsonResponse);
  }

  private ApiErrorResponse createErrorResponse(HttpServletRequest request) {
    ErrorSpec errorSpec = getErrorSpec();
    return ApiErrorResponseFactory.createResponse(errorSpec, request);
  }

  private String convertToJson(ApiErrorResponse errorResponse) {
    return new Gson().toJson(errorResponse);
  }
}
