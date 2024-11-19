package site.soobin.myrestfulservice.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
    info =
        @Info(
            title = "My Restful Service API 명세서",
            description = "Spring Boot로 개발하는 Restful API 명세서입니다.",
            version = "v1.0.0"))
@Configuration
@RequiredArgsConstructor
public class SwaggerConfig {
  @Bean
  public GroupedOpenApi customTestOpenAPI() {
    // API의 경로를 설정하여 특정 경로만 노출되도록 설정할 수 있다.
    String path[] = {"/user/**", "/admin/**"};

    return GroupedOpenApi.builder()
        .group("일반 사용자와 관리자를 위한 User 도메인에 대한 API")
        .pathsToMatch(path)
        .build();
  }
}
