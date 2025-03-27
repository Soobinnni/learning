# Spring Boot Actuator

## 1. Spring Boot Actuator란?

Spring Boot Actuator는 Spring Boot 애플리케이션의 상태와 성능을 모니터링하고 관리할 수 있도록 다양한 엔드포인트를 제공하는 기능이다. Actuator는 헬스 체크, 메트릭스, 환경 정보, 로그 정보 등 여러 가지 중요한 정보를 쉽게 확인할 수 있도록 도와준다.

Spring Boot Actuator는 운영 환경에서 애플리케이션을 모니터링하고 관리하는 데 필수적인 도구로, 별도의 모니터링 시스템 없이도 애플리케이션의 기본적인 상태를 파악할 수 있게 해준다.

## 2. Actuator 의존성 추가

Maven 또는 Gradle 프로젝트에 다음과 같이 의존성을 추가한다:

### Maven (pom.xml)

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### Gradle (build.gradle)

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
```

## 3. Actuator 엔드포인트

Actuator는 기본적으로 여러 엔드포인트를 제공한다. 이러한 엔드포인트는 `/actuator` 경로 하위에 위치하며, 각각의 엔드포인트는 다양한 정보를 제공한다.

### 주요 엔드포인트

| 엔드포인트 | 설명 |
|------------|------|
| **/actuator/health** | 애플리케이션의 상태를 확인한다. 기본적으로 단순 상태(UP/DOWN)만 표시하며, 상세 설정 시 데이터베이스, 디스크 공간 등의 상태도 확인 가능하다. |
| **/actuator/metrics** | 애플리케이션의 메트릭 정보를 제공한다. 메모리 사용량, CPU 사용량, HTTP 요청 수 등 다양한 측정 정보를 확인할 수 있다. |
| **/actuator/loggers** | 로깅 설정을 조회하고 변경할 수 있다. 런타임에 로그 레벨을 동적으로 변경 가능하다. |
| **/actuator/env** | 환경 변수와 설정 정보를 확인한다. 시스템 환경 변수, 애플리케이션 속성 등을 볼 수 있다. |
| **/actuator/beans** | 애플리케이션 컨텍스트에 있는 빈 목록을 확인한다. 각 빈의 이름, 타입, 의존성 등을 볼 수 있다. |
| **/actuator/threaddump** | 스레드 덤프를 확인한다. 현재 실행 중인 모든 스레드의 상태를 볼 수 있어 교착 상태 분석 등에 유용하다. |
| **/actuator/httptrace** | 최근 HTTP 요청 및 응답을 추적한다. 클라이언트 IP, 요청 URL, 응답 상태 코드 등을 확인할 수 있다. |
| **/actuator/mappings** | 모든 HTTP 요청 매핑 정보를 표시한다. 컨트롤러의 URL 패턴, HTTP 메서드 등을 확인할 수 있다. |
| **/actuator/info** | 애플리케이션의 정보를 표시한다. 기본적으로 비어있으며, 사용자가 직접 정보를 추가할 수 있다. |
| **/actuator/shutdown** | 애플리케이션을 원격으로 종료한다. 기본적으로 비활성화되어 있다. |

## 4. Actuator 엔드포인트 설정

기본적으로 모든 엔드포인트가 활성화되어 있지만, 대부분은 웹을 통해 노출되지 않는다. `application.properties` 또는 `application.yml` 파일을 사용하여 필요한 엔드포인트를 활성화하거나 비활성화할 수 있다.

### application.properties 설정 예시

```properties
spring.application.name=sample
server.port=8080

# 모든 엔드포인트 노출 설정
management.endpoints.web.exposure.include=*

# 특정 엔드포인트만 노출
# management.endpoints.web.exposure.include=health,metrics,loggers

# 특정 엔드포인트 제외
# management.endpoints.web.exposure.exclude=env,beans

# 헬스 체크 엔드포인트 상세 정보 표시 설정
management.endpoint.health.show-details=always

# 개별 엔드포인트 활성화/비활성화
management.endpoint.shutdown.enabled=true
```

### application.yml 설정 예시

```yaml
spring:
  application:
    name: sample

server:
  port: 8080

management:
  endpoints:
    web:
      exposure:
        include: "*"
  endpoint:
    health:
      show-details: always
    shutdown:
      enabled: true
```

### 설정 옵션 설명

**management.endpoint.health.show-details** 옵션은 다음 값을 가질 수 있다:

- **never**: 헬스 체크 상세 정보를 절대 표시하지 않는다(기본값).
- **always**: 모든 사용자에게 헬스 체크 상세 정보를 항상 표시한다.
- **when_authorized**: 인증된 사용자에게만 헬스 체크 상세 정보를 표시한다.


## 5. 주의사항 및 권장사항

### 보안

* 모든 엔드포인트를 노출하는 설정은 개발 및 테스트 환경에서는 유용할 수 있지만, 운영 환경에서는 보안 위험을 증가시킬 수 있다. 필요한 엔드포인트만 노출하는 것을 권장한다.
* 헬스 체크 엔드포인트에서 상세 정보를 항상 노출하는 설정 역시 운영 환경에서는 민감한 정보를 포함할 수 있으므로, `show-details` 설정을 `when_authorized` 옵션을 사용하는 것이 좋다.

### 엔드포인트 보호

#### 별도 포트 사용

Actuator 엔드포인트를 별도의 포트로 분리하여 네트워크 레벨에서 보호할 수 있다:

```properties
# 애플리케이션의 기본 포트를 8080으로 설정
server.port=8080

# Actuator 엔드포인트를 19090 포트에서 서비스하도록 설정
management.server.port=19090

# (선택) Actuator 경로 변경
management.endpoints.web.base-path=/manage
```

#### Spring Security 적용

Spring Security를 사용하여 민감한 엔드포인트에 접근 제어를 설정하는 것이 좋다:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .requestMatchers("/actuator/health").permitAll() // 헬스 체크는 누구나 접근 가능
                .requestMatchers("/actuator/**").hasRole("ADMIN") // 다른 Actuator 엔드포인트는 ADMIN 권한 필요
                .anyRequest().authenticated()
            .and()
            .httpBasic(); // 기본 인증 사용
        
        return http.build();
    }
}
```

## 6. 결론

Spring Boot Actuator는 애플리케이션의 모니터링과 관리를 위한 강력한 도구이다. 헬스 체크, 메트릭 수집, 환경 정보 확인 등 다양한 기능을 제공하며, 이를 통해 운영 중인 애플리케이션의 상태를 실시간으로 파악할 수 있다.

하지만 보안적인 측면에서 신중하게 설정해야 하며, 특히 운영 환경에서는 필요한 엔드포인트만 노출하고 적절한 접근 제어를 설정하는 것이 중요하다. 또한, Prometheus, Grafana 등의 모니터링 시스템과 통합하여 더욱 효과적인 모니터링 환경을 구축할 수 있다.