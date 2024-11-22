package site.soobin.myrestfulservice.domains.auth.presentation.handler;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import site.soobin.myrestfulservice.commons.exception.ApiErrorResponse;
import site.soobin.myrestfulservice.commons.exception.ApiErrorResponseFactory;
import site.soobin.myrestfulservice.domains.auth.application.exception.AuthErrorSpec;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
  // Spring Security에서 인증되지 않은 사용자가 보호된 리소스에 접근할 때 발생하는
  // AuthenticationException을 처리 (401)
  @Override
  // 이 메서드는 인증되지 않은 사용자가 보호된 리소스에 접근할 때 호출
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException {
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding("UTF-8");

    ApiErrorResponse errorResponse =
        ApiErrorResponseFactory.createResponse(AuthErrorSpec.NEED_AUTHENTICATION, request);
    new Gson().toJson(errorResponse, response.getWriter());
  }
}
