package com.springcloud.eureka.client.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  /**
   * 사용자 ID를 받아 JWT 액세스 토큰을 생성하여 응답합니다.
   *
   * @param user_id 사용자 ID
   * @return JWT 액세스 토큰을 포함한 AuthResponse 객체를 반환합니다.
   */
  @GetMapping("/auth/signIn")
  public ResponseEntity<?> createAuthenticationToken(@RequestParam("user_id") String user_id) {
    return ResponseEntity.ok(new AuthResponse(authService.createAccessToken(user_id)));
  }
}
