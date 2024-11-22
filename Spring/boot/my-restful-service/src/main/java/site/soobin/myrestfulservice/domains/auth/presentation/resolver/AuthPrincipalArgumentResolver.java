package site.soobin.myrestfulservice.domains.auth.presentation.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import site.soobin.myrestfulservice.domains.auth.domain.AuthPrincipal;
import site.soobin.myrestfulservice.domains.auth.domain.CustomPrincipal;
import site.soobin.myrestfulservice.domains.auth.domain.JwtClaims;

@Component
// Spring MVC에서 @AuthPrincipal 어노테이션을 가진
// 메서드 파라미터에 대해 CustomPrincipal 객체를 자동으로 주입하는 역할
// Spring Security와 연동하여 인증된 사용자의 정보를 커스터마이징된 형태로 제공할 수 있도록 한다.
public class AuthPrincipalArgumentResolver implements HandlerMethodArgumentResolver {

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    // @AuthPrincipal 어노테이션이 적용된 파라미터가 CustomPrincipal 타입인지를 확인하여,
    // 해당 파라미터에 대해서만 resolveArgument가 호출되도록 한다.

    // 파라미터에 @AuthPrincipal 어노테이션이 있는지 확
    // &&
    // 파라미터 타입이 CustomPrincipal 클래스인지 확인
    // 이 두 조건을 만족하는 파라미터에 대해 resolveArgument가 호출
    return parameter.getParameterAnnotation(AuthPrincipal.class) != null
        && parameter.getParameterType().equals(CustomPrincipal.class);
  }

  @Override
  public Object resolveArgument(
      MethodParameter parameter,
      ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest,
      WebDataBinderFactory binderFactory) {
    // resolveArgument는 실제로 @AuthPrincipal이 적용된 파라미터에 대한 값을 설정하는 역할

    // SecurityContextHolder.getContext().getAuthentication()을 사용하여 현재 인증된 사용자의 정보를 가져옴
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    // 인증 객체가 UsernamePasswordAuthenticationToken 타입인 경우에만 처리를 진행
    if (authentication instanceof UsernamePasswordAuthenticationToken) {
      // authentication 객체에서 principal을 가져옵니다. principal은 인증된 사용자의 정보가 담겨 있는 객체
      // 일반적으로 UserDetails 구현체이지만,
      // 여기서는 JWT 토큰에서 파싱된 Map<String, Object> 형태로 사용자의 정보를 저장하고 있음
      JwtClaims claims = (JwtClaims) authentication.getPrincipal();

      // CustomPrincipal 객체를 생성하여, id와 role 값을 주입, 최종적으로 CustomPrincipal 객체를 반환
      return new CustomPrincipal(claims.id(), claims.role());
    }
    return null;
  }
}
