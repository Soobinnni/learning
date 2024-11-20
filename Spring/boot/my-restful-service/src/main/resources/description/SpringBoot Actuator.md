### Actuator란?

Spring Boot Actuator는 애플리케이션의 상태를 모니터링하고 관리하기 위한 다양한 기능을 제공하는 모듈이다. 애플리케이션의 상태를 확인하거나 메트릭스를 수집하고,
애플리케이션 동작을 제어하는 데 유용하다.

---

### 주요 기능

- **애플리케이션 상태 확인**
    - `/actuator/health` 엔드포인트를 통해 애플리케이션의 상태를 확인할 수 있다.
    - 상태 정보는 기본적으로 `UP` 또는 `DOWN`으로 표시된다.

- **메트릭스 제공**
    - `/actuator/metrics` 엔드포인트를 통해 JVM, 메모리, CPU, 스레드와 같은 리소스 정보를 제공한다.
    - 특정 메트릭 데이터를 조회할 수도 있다.

- **환경 정보 확인**
    - `/actuator/env` 엔드포인트를 통해 현재 애플리케이션 환경 변수와 프로퍼티 값을 확인할 수 있다.

- **로그 레벨 변경**
    - `/actuator/loggers` 엔드포인트를 통해 애플리케이션의 특정 로거(log)의 로그 레벨을 런타임에 동적으로 변경할 수 있다.

---

### 설정 방법

#### Maven 의존성 추가

```xml

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

#### Gradle 의존성 추가

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
}
```

---

### 주요 설정

- **엔드포인트 노출**  
  Actuator 엔드포인트는 기본적으로 일부만 노출된다. 노출 설정을 통해 필요한 엔드포인트만 활성화하거나 전체를 활성화할 수 있다.

  ```yaml
  management:
    endpoints:
      web:
        exposure:
          include: "health,info" # 특정 엔드포인트만 노출
  ```

    - 모든 엔드포인트를 노출하려면 `include: "*"`를 사용한다.

---

### 기본 엔드포인트 목록

| 엔드포인트               | 설명                        |
|---------------------|---------------------------|
| `/actuator/health`  | 애플리케이션의 상태를 확인한다.         |
| `/actuator/info`    | 애플리케이션의 일반적인 정보를 제공한다.    |
| `/actuator/metrics` | 애플리케이션의 메트릭스를 확인한다.       |
| `/actuator/env`     | 현재 환경 변수 및 설정 정보를 확인한다.   |
| `/actuator/loggers` | 애플리케이션의 로깅 설정을 조회하고 변경한다. |

---

### 주의 사항

- Actuator는 애플리케이션의 민감한 정보를 노출할 수 있으므로 반드시 인증 및 권한 설정을 함께 적용해야 한다.
- 운영 환경에서는 필요한 엔드포인트만 노출하고, 나머지는 비활성화하는 것이 권장된다.

--- 

### 참고

Actuator는 Spring Boot 애플리케이션을 모니터링하고 디버깅하는 데 필수적인 도구로, 개발 및 운영 환경에서 유용하게 사용된다.