package site.soobin.myrestfulservice.domains.auth.infrastructure.config;

import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import site.soobin.myrestfulservice.domains.auth.presentation.filter.AccessTokenFilter;
import site.soobin.myrestfulservice.domains.auth.presentation.filter.RefreshTokenFilter;
import site.soobin.myrestfulservice.domains.auth.presentation.handler.CustomAccessDeniedHandler;
import site.soobin.myrestfulservice.domains.auth.presentation.handler.CustomAuthenticationEntryPoint;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
@Log4j2
public class SecurityConfig {

  private final AccessTokenFilter accessTokenFilter;
  private final RefreshTokenFilter refreshTokenFilter;

  @Value("${cors.allowed-origins}")
  private String allowedOrigins;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // [해당 메서드에 대한 설명 -> filterChain.md 에 정리]
    // 기본 설정 비활성화: JWT 인증에서는 세션 쿠키를 사용하지 않기 때문에 CSRF 공격을 방지할 필요가 없음
    // - CSRF 비활성화
    // - CORS 설정
    // - 세션 관리 비활성화 (STATELESS): JWT는 무상태 인증 방식이므로, 세션을 생성하거나 관리하지 않고, 요청마다 JWT 토큰을 검사하여 인증
    // - 기본 form 로그인 비활성화: 폼 로그인을 비활성화하여 JWT 인증 방식을 사용
    // - 기본 HTTP 기본 인증 비활성화: HTTP 기본 인증을 비활성화하여 JWT 인증만을 사용하도록 설정
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .formLogin(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    // URL 기반 권한 설정
    http.authorizeHttpRequests(
        auth ->
            auth
                // 공개 엔드포인트
                .requestMatchers(
                    "/api/auth/**", "/api/public/**", "/swagger-ui/**", "/v3/api-docs/**")
                .permitAll()

                // 관리자 전용 엔드포인트
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")

                // 사용자 권한 필요 엔드포인트
                .requestMatchers("/api/users/**")
                .hasAnyRole("USER", "ADMIN")

                // 그 외 모든 요청은 인증 필요
                .anyRequest()
                .authenticated());

    // 예외 처리 설정: 인증 또는 권한 문제가 발생했을 때, 사용자가 어떻게 처리될지를 정의(핸들러)
    // 예외 처리 설정은 필터 체인과는 독립적이고, 필터가 실행된 후 발생할 수 있는 예외들을 처리하기 위해 사용
    http.exceptionHandling(
        exc ->
            // 사용자가 권한이 없는 리소스에 접근했을 때의 처리 방법을 정의(403: Forbidden)
            exc.accessDeniedHandler(accessDeniedHandler())
                // 사용자가 권한이 없는 리소스에 접근했을 때의 처리 방법을 정의(401: Unauthorized)
                .authenticationEntryPoint(authenticationEntryPoint()));

    // 필터 체인 구성: 상세 filterChain 확인, HTTP 요청 처리 중에 실행되며 요청을 가로챈다.
    // - 필터 체인은 요청이 들어오고, 응답을 보내기 전에 다양한 필터들이 처리하는 순서를 정의하는 부분
    // - 필터는 요청을 가로채어 인증, 권한 확인, 로깅 등의 작업을 수행
    // - addFilterBefore() 메서드는 필터의 순서를 지정하는 데 사용

    // accessTokenFilter를 UsernamePasswordAuthenticationFilter보다 먼저 실행하도록 설정
    // accessTokenFilter는 사용자가 요청할 때 액세스 토큰의 유효성을 검사하는 필터로 사용자가 보낸 액세스 토큰이 유효한지, 만료되지 않았는지 등을 확인
    // UsernamePasswordAuthenticationFilter는 기본적으로 사용자명과 비밀번호를 사용하여 인증을 처리하는 필터
    // 이므로 JWT 인증에서는 액세스 토큰을 사용하기 때문에, 이 필터가 실행되기 전에 액세스 토큰을 확인하는 accessTokenFilter를 실행하여, JWT
    // 기반 인증을 수행
    http.addFilterBefore(accessTokenFilter, UsernamePasswordAuthenticationFilter.class);
    // refreshTokenFilter를 AccessTokenFilter보다 먼저 실행하도록 설정
    // 액세스 토큰이 만료되었을 때 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급
    http.addFilterBefore(refreshTokenFilter, AccessTokenFilter.class);

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AccessDeniedHandler accessDeniedHandler() {
    return new CustomAccessDeniedHandler();
  }

  @Bean
  public AuthenticationEntryPoint authenticationEntryPoint() {
    return new CustomAuthenticationEntryPoint();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // 허용할 출처(Origin) 설정
    configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));

    // 허용할 HTTP 메서드를 설정
    configuration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

    // 허용할 요청 헤더를 설정
    configuration.setAllowedHeaders(
        Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"));

    // 라이언트가 접근 가능한 응답 헤더를 설정
    configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));

    /**
     * 자격 증명(쿠키, 인증 헤더 등)을 포함한 요청을 허용할지 설정 자격 증명이란 주로 쿠키, HTTP 인증 헤더, TLS 클라이언트 인증을 의미 - JWT 인증에서
     * 쿠키에 JWT를 저장하고 요청 시 쿠키를 포함시키는 방식이라면, CORS 설정에서 configuration.setAllowCredentials(true)가 중요. 이
     * 설정이 있어야 브라우저가 쿠키를 포함한 요청을 보낼 수 있음. 단, JWT를 Authorization 헤더에 포함시켜 전송하는 방식은 CORS 설정에서
     * AllowCredentials 설정과 관계가 없음.
     */
    configuration.setAllowCredentials(true);

    // CORS 정책의 캐시 유효 시간을 설정. 3600초(1시간)로 설정되어 클라이언트가 캐시를 활용할 수 있도록 한다.
    // 즉 특정 리소스에 대한 CORS 프리플라이트 요청의 결과를 클라이언트가 캐시하도록 지시.
    // 따라서, 동일한 리소스에 대한 여러 요청이 있을 경우에는 CORS 정책을 재요청하지 않고 캐시된 값을 사용하지만, 다른 엔드포인트나 다른 메서드에 대한 요청은 여전히
    // 별도의 CORS 프리플라이트 요청을 보내야 한다.

    // 자세한 설명-> cors configuration cache.md 참고
    configuration.setMaxAge(3600L);

    /**
     * UrlBasedCorsConfigurationSource를 생성하고 특정 경로에 대해 CorsConfiguration을 등록
     * source.registerCorsConfiguration("/**", configuration);: 애플리케이션의 모든 경로(/**)에 대해 위에서 정의한 CORS
     * 설정을 적용
     */
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
