# 애플리케이션 로그 모니터링 - Loki

## 1. Loki 소개

Loki는 Grafana Labs에서 개발한 로그 집계 시스템으로, Prometheus의 메트릭 수집 방식과 유사하게 로그 데이터를 수집하고 쿼리할 수 있도록 설계되었다. Loki는 주로 로그 데이터를 저장하고, 이를 Grafana를 통해 시각화하는 데 사용된다.

### 1.1 Loki의 주요 특징

- **수평적 확장성**: 대량의 로그 데이터도 효율적으로 처리할 수 있는 구조
- **비용 효율성**: 인덱스는 라벨만 저장하고 원본 로그는 압축하여 저장
- **라벨 기반 인덱싱**: Prometheus와 유사한 라벨 체계로 로그 검색 및 필터링
- **간편한 통합**: Grafana와의 원활한 통합을 통한 로그 시각화
- **멀티 테넌시**: 여러 팀이나 서비스의 로그를 분리하여 관리 가능

### 1.2 Loki의 아키텍처

Loki는 크게 세 가지 주요 컴포넌트로 구성된다:

1. **Distributor**: 클라이언트로부터 로그 스트림을 받아 처리
2. **Ingester**: 로그를 메모리에 저장하고 주기적으로 스토리지에 기록
3. **Querier**: 로그 쿼리 처리 및 결과 반환

일반적으로 Loki는 Promtail이라는 에이전트를 통해 로그를 수집하지만, Java 애플리케이션에서는 loki-logback-appender를 사용하여 직접 로그를 전송할 수 있다.

## 2. loki-logback-appender

loki-logback-appender는 Logback을 사용하는 Java 애플리케이션에서 로그를 Loki로 직접 전송하기 위한 라이브러리이다. 이 라이브러리를 사용하면 별도의 Promtail 설정 없이도 로그를 Loki로 전송할 수 있다.

### 2.1 loki-logback-appender의 주요 특징

- **경량화**: 적은 리소스로 로그 전송 가능
- **배치 처리**: 로그를 배치로 묶어 전송하여 효율성 향상
- **백 프레셔 처리**: 서버 부하 시 로그 손실 최소화
- **HTTP/JSON 형식**: Loki API와 호환되는 형식으로 로그 전송
- **라벨 지정**: 애플리케이션 특성에 맞는 라벨 설정 가능

## 3. 스프링 부트 프로젝트 설정

### 3.1 의존성 추가

`build.gradle` 파일에 loki-logback-appender 의존성을 추가한다:

```gradle
dependencies {
    implementation 'com.github.loki4j:loki-logback-appender:1.5.1'
    
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    runtimeOnly 'io.micrometer:micrometer-registry-prometheus'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
```

Maven을 사용하는 경우:

```xml
<dependency>
    <groupId>com.github.loki4j</groupId>
    <artifactId>loki-logback-appender</artifactId>
    <version>1.5.1</version>
</dependency>
```

### 3.2 예제 컨트롤러 작성

로그 생성을 위한 샘플 컨트롤러를 작성한다. 루트 경로에 접근하면 403 에러와 함께 로그를 생성한다:

```java
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class SampleController {

    private static final Logger logger = LoggerFactory.getLogger(SampleController.class);

    @GetMapping("/")
    public String hello(HttpServletResponse response) throws IOException {
        logger.info("Attempted access to / endpoint resulted in 403 Forbidden");
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
        return null;
    }
}
```

### 3.3 Logback 설정

`src/main/resources` 디렉토리에 `logback.xml` 파일을 생성하고 다음과 같이 설정한다:

```xml
<configuration>
    <!-- 콘솔 출력용 Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <!-- Loki로 전송하는 Appender -->
    <appender name="LOKI" class="com.github.loki4j.logback.Loki4jAppender">
        <http>
            <url>http://localhost:3100/loki/api/v1/push</url>
        </http>
        <format>
            <label>
                <pattern>app=my-app,host=${HOSTNAME},level=%level</pattern>
            </label>
            <message class="com.github.loki4j.logback.JsonLayout" />
        </format>
    </appender>

    <!-- 로그 레벨 설정 -->
    <root level="INFO">
        <appender-ref ref="CONSOLE" />
        <appender-ref ref="LOKI" />
    </root>
</configuration>
```

이 설정은 로그를 콘솔에 출력하고 동시에 Loki 서버로 전송한다. 로그 메시지는 JSON 형식으로 전송되며, 애플리케이션 이름, 호스트명, 로그 레벨을 라벨로 포함한다.

## 4. Loki 서버 설정 (Docker 사용)

### 4.1 Loki 설정 파일 생성

먼저 Loki 서버를 위한 설정 파일을 생성한다. 적절한 디렉토리에 `loki-config.yml` 파일을 생성하고 다음 내용을 추가한다:
[참고: 공식문서](https://grafana.com/docs/loki/latest/setup/install/docker/)

```yaml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  instance_addr: 127.0.0.1
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

query_range:
  results_cache:
    cache:
      embedded_cache:
        enabled: true
        max_size_mb: 100

schema_config:
  configs:
    - from: 2020-10-24
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

ruler:
  alertmanager_url: http://localhost:9093
```

이 설정은 Loki의 기본적인 동작을 정의하며, 인증 없이 로컬 파일 시스템에 로그를 저장하는 간단한 설정이다.

### 4.2 Docker로 Loki 실행

Docker를 사용하여 Loki 서버를 실행한다:

```bash
docker run --name loki -d -v /path/to/loki-config.yml:/mnt/config/loki-config.yml -p 3100:3100 grafana/loki:3.0.0 -config.file=/mnt/config/loki-config.yml
```

`/path/to/loki-config.yml`은 앞서 생성한 설정 파일의 전체 경로로 대체해야 한다.

### 4.3 Loki 서버 상태 확인

Loki 서버가 정상적으로 실행되었는지 확인하려면 브라우저에서 `http://localhost:3100/ready`에 접속한다. "ready" 메시지가 표시되면 서버가 정상적으로 실행된 것이다.

## 5. Grafana에 Loki 데이터 소스 추가

### 5.1 Loki 데이터 소스 추가

1. Grafana에 로그인한다.
2. 왼쪽 메뉴에서 "Configuration" > "Data sources"를 선택한다.
3. "Add data source" 버튼을 클릭한다.
4. 목록에서 "Loki"를 선택한다.
5. 다음 설정을 입력한다:
    - Name: Loki (또는 원하는 이름)
    - URL: `http://host.docker.internal:3100` (Docker를 사용하는 경우)
    - 기타 설정은 기본값 유지
6. "Save & Test" 버튼을 클릭하여 연결을 테스트하고 저장한다.

### 5.2 로그 조회 및 시각화

1. 스프링 부트 애플리케이션을 실행한다.
2. 브라우저에서 애플리케이션의 루트 경로(`http://localhost:8080/`)에 접속하여 403 에러를 발생시킨다.
3. Grafana에서 "Explore" 페이지로 이동한다.
4. 데이터 소스로 "Loki"를 선택한다.
5. 로그 쿼리를 입력한다:
   ```
   {app="my-app"} |= "403 Forbidden"
   ```
6. "Run Query" 버튼을 클릭하여 로그를 조회한다.

## 6. 고급 Loki 쿼리 기능

### 6.1 로그 필터링

Loki에서는 다양한 방법으로 로그를 필터링할 수 있다:

- **라벨 기반 필터링**:
  ```
  {app="my-app", level="ERROR"}
  ```

- **텍스트 매칭**:
  ```
  {app="my-app"} |= "error"  // "error" 포함
  {app="my-app"} |~ "error.*" // 정규식 매칭
  {app="my-app"} != "success" // "success" 제외
  ```

### 6.2 로그 파싱 및 집계

LogQL(Loki Query Language)을 사용하여 로그를 파싱하고 집계할 수 있다:

- **로그 라인 수 카운트**:
  ```
  count_over_time({app="my-app", level="ERROR"}[1h])
  ```

- **JSON 필드 추출**:
  ```
  {app="my-app"} | json | response_time > 200
  ```

- **특정 패턴 매칭 및 그룹화**:
  ```
  {app="my-app"} | pattern `<_> status=<status> <_>` | status="500"
  ```

### 6.3 메트릭 생성

LogQL을 사용하여 로그에서 메트릭을 추출할 수 있다:

- **에러 발생 빈도**:
  ```
  sum(rate({app="my-app", level="ERROR"}[5m])) by (host)
  ```

- **응답 시간 분포**:
  ```
  quantile_over_time(0.95, {app="my-app"} | json | unwrap response_time[5m])
  ```

## 7. Grafana 대시보드 생성

### 7.1 로그 시각화 패널 추가

1. Grafana에서 "Dashboards" > "New Dashboard"를 선택한다.
2. "Add new panel"을 클릭한다.
3. 데이터 소스로 "Loki"를 선택한다.
4. 원하는 로그 쿼리를 입력한다.
5. "Visualization" 탭에서 "Logs"를 선택한다.
6. 원하는 대로 패널을 구성하고 "Apply"를 클릭한다.

### 7.2 로그 기반 메트릭 패널 추가

1. 대시보드에 새 패널을 추가한다.
2. 데이터 소스로 "Loki"를 선택한다.
3. 메트릭 쿼리를 입력한다 (예: `rate({app="my-app"}[5m])`).
4. "Visualization" 탭에서 "Time series" 또는 "Stat"과 같은 적절한 시각화를 선택한다.
5. 패널을 구성하고 "Apply"를 클릭한다.

### 7.3 알림 설정

1. 패널의 "Edit" 모드에서 "Alert" 탭을 선택한다.
2. "Create Alert"를 클릭한다.
3. 알림 조건을 설정한다.
4. 알림 메시지 및 라벨을 구성한다.
5. 알림 채널을 선택한다 (Slack, Email, PagerDuty 등).
6. "Save" 버튼을 클릭하여 알림을 저장한다.

## 8. 로깅 모범 사례

### 8.1 구조화된 로깅

구조화된 로깅을 사용하면 로그 분석이 용이해진다:

```java
// 기존 방식
logger.info("User " + userId + " purchased item " + itemId + " for " + amount);

// 구조화된 로깅
logger.info("User purchase completed", Map.of(
    "userId", userId,
    "itemId", itemId,
    "amount", amount
));
```

### 8.2 적절한 로그 레벨 사용

- **ERROR**: 시스템 오류, 복구 불가능한 상황
- **WARN**: 잠재적 문제, 경고 상황
- **INFO**: 일반적인 운영 정보, 중요한 비즈니스 이벤트
- **DEBUG**: 개발 및 문제 해결에 유용한 상세 정보
- **TRACE**: 가장 상세한 정보, 진단 목적

### 8.3 컨텍스트 정보 포함

로그에 충분한 컨텍스트 정보를 포함시켜 문제 해결에 도움이 되도록 한다:

- 트랜잭션 ID
- 사용자 ID 또는 세션 ID
- 요청 ID
- 중요한 비즈니스 파라미터

### 8.4 로그 보존 정책 설정

로그 데이터의 양을 관리하기 위해 적절한 보존 정책을 설정한다:

```yaml
# Loki 설정에 추가
limits_config:
  retention_period: 30d
```

## 9. 결론

Loki와 Grafana를 사용한 로그 모니터링 시스템은 Spring Boot 애플리케이션의 운영 상태를 파악하고 문제를 신속하게 해결하는 데 큰 도움이 된다. loki-logback-appender를 사용하면 별도의 로그 수집 에이전트 없이도 로그를 효율적으로 전송하고 관리할 수 있다.

이 시스템을 통해 개발 팀은 로그 데이터를 실시간으로 모니터링하고, 문제가 발생했을 때 빠르게 원인을 파악하여 대응할 수 있다. 또한, 로그 데이터를 기반으로 한 메트릭과 알림 시스템을 구축하여 선제적인 대응도 가능하다.

로그 기반 모니터링은 메트릭 기반 모니터링과 함께 종합적인 관찰성(Observability) 시스템의 핵심 요소로, 현대적인 마이크로서비스 아키텍처에서 특히 중요한 역할을 한다.