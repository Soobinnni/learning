package site.soobin.myrestfulservice.domains.auth.presentation.handler;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import site.soobin.myrestfulservice.commons.exception.ApiErrorResponse;
import site.soobin.myrestfulservice.commons.exception.ApiErrorResponseFactory;
import site.soobin.myrestfulservice.domains.auth.application.exception.AuthErrorSpec;

@Component
// Spring Security에서 사용자의 권한이 부족할 경우(즉, 403 Forbidden 오류가 발생할 때),
// 해당 요청에 대해 커스텀한 에러 응답을 처리하는 역할
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
  // 권한이 부족한 사용자의 접근 처리 (403)
  @Override
  public void handle(
      HttpServletRequest request,
      HttpServletResponse response,
      AccessDeniedException accessDeniedException)
      throws IOException {
    response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 상태 코드 설정
    response.setContentType(MediaType.APPLICATION_JSON_VALUE); // 응답 타입을 JSON으로 설정
    response.setCharacterEncoding("UTF-8"); // 응답 문자 인코딩 설정

    ApiErrorResponse errorResponse =
        ApiErrorResponseFactory.createResponse(AuthErrorSpec.NO_AUTHENTICATION, request);

    new Gson().toJson(errorResponse, response.getWriter());
  }
}
