# Prometheus 모니터링

## 1. Prometheus란?

- Prometheus는 오픈소스 시스템 모니터링 및 경고 도구이다. SoundCloud에서 시작되어 현재는 Cloud Native Computing Foundation(CNCF)에서 호스팅하고 있다. 
- Prometheus는 시계열 데이터베이스를 사용하여 메트릭 데이터를 수집하고, 쿼리 및 시각화를 통해 시스템 상태를 모니터링하고 경고를 설정할 수 있다.

Prometheus는 다음과 같은 특징을 가지고 있다:

- **풀 모델(Pull Model)**: 타겟 시스템으로부터 직접 메트릭을 수집(스크레이핑)한다
- **다차원 데이터 모델**: 키-값 쌍으로 구성된 시계열 데이터 구조
- **강력한 쿼리 언어(PromQL)**: 복잡한 데이터 쿼리 및 분석 가능
- **독립적인 운영**: 외부 시스템에 대한 의존성 없이 작동 가능
- **그래프 및 대시보드 지원**: 내장 표현식 브라우저 제공, Grafana와 통합 가능
- **효율적인 저장**: 시계열 데이터에 최적화된 저장소

## 2. Prometheus의 주요 구성 요소

### 2.1 Prometheus 서버

- 메트릭 데이터를 수집하고 저장하는 핵심 컴포넌트이다
- 각 타겟으로부터 데이터를 주기적으로 스크랩(scrape)하여 시계열 데이터베이스에 저장한다
- 시계열 데이터베이스(Time Series Database, TSDB)는 시간에 따라 변화하는 데이터를 효율적으로 저장하고 조회할 수 있도록 최적화된 데이터베이스이다
- PromQL을 사용한 쿼리 처리 및 경고 규칙 평가를 수행한다

### 2.2 Exporters

- Prometheus는 기본적으로 애플리케이션에서 메트릭 데이터를 수집한다
- Exporter는 특정 애플리케이션이나 시스템의 메트릭 데이터를 Prometheus가 이해할 수 있는 형식으로 변환해주는 도구이다
- 주요 Exporter 예시:
    - **Node Exporter**: 서버의 CPU, 메모리, 디스크, 네트워크 등 시스템 메트릭 수집
    - **PostgreSQL Exporter**: PostgreSQL 데이터베이스의 메트릭 수집
    - **MySQL Exporter**: MySQL 데이터베이스의 메트릭 수집
    - **Blackbox Exporter**: HTTP, HTTPS, DNS, TCP, ICMP 등의 프로토콜을 모니터링
    - **Spring Boot**: micrometer-registry-prometheus 의존성을 사용하여 애플리케이션 메트릭 노출

### 2.3 Pushgateway

- 짧은 수명의 작업(job)에서 메트릭을 수집하여 Prometheus 서버에 푸시(push)할 수 있다
- 일반적으로 지속적으로 실행되지 않는 작업에서 사용된다
- 사용 예시:
    - 배치 작업
    - 스크립트 실행
    - 크론 작업
    - 일회성 프로세스

### 2.4 Alertmanager

- Prometheus 서버에서 발생하는 경고(alert)를 처리하고, 이메일, PagerDuty, Slack 등 다양한 방법으로 알림을 보낼 수 있다
- 주요 기능:
    - 알림 그룹화: 관련된 여러 알림을 하나로 묶어 처리
    - 알림 억제: 특정 조건에서 알림 생성 억제
    - 알림 무음 처리: 특정 시간 동안 알림 중지
    - 알림 라우팅: 알림 대상 및 방식 설정

### 2.5 Grafana

- Prometheus 데이터를 시각화하기 위해 자주 사용되는 대시보드 도구이다
- Grafana를 사용하면 Prometheus에서 수집한 메트릭 데이터를 대시보드 형태로 시각화할 수 있다
- 여러 데이터 소스를 지원하고, 정교한 대시보드 및 알림 기능 제공

## 3. Prometheus 아키텍처

Prometheus의 전체 아키텍처는 다음과 같이 구성된다:

![Prometheus 아키텍처](https://github.com/user-attachments/assets/e6a21522-3923-4124-a029-438eac12945c)

1. **Prometheus 서버**가 각 **타겟(대상)**에서 메트릭을 수집
2. 수집된 메트릭은 내부 **시계열 데이터베이스**에 저장
3. **PromQL**을 통해 데이터 쿼리 및 분석
4. 설정된 규칙에 따라 **Alertmanager**로 알림 전송
5. **Grafana** 등을 통해 데이터 시각화

## 4. Spring Boot 애플리케이션과 Prometheus 연동

### 4.1 의존성 추가

#### Maven (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Actuator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    
    <!-- Micrometer Prometheus Registry -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>
</dependencies>
```

#### Gradle (build.gradle)

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'io.micrometer:micrometer-registry-prometheus'
}
```

> **주의사항**: Prometheus 버전이 1.1.3으로 업데이트됨에 따라 Spring Boot 버전 3.3.3 이상에서만 정상 동작한다. https://start.spring.io/에서는 최신 버전만 지원하고 있으므로 버전 선택에 참고한다.
>
> 참고 링크: https://github.com/micrometer-metrics/micrometer/issues/5093

### 4.2 Spring Boot 설정

`application.properties` 또는 `application.yml` 파일에 다음과 같이 설정한다:

#### application.properties

```properties
spring.application.name=sample

server.port=8080

# 모든 엔드포인트 노출 설정 (또는 prometheus만 포함할 수도 있음)
management.endpoints.web.exposure.include=* 

# 헬스 체크 엔드포인트 상세 정보 표시 설정
management.endpoint.health.show-details=always

# Prometheus 엔드포인트 활성화
management.endpoint.prometheus.enabled=true
```

#### application.yml

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
        include: "*"  # 또는 prometheus만 명시
  endpoint:
    health:
      show-details: always
    prometheus:
      enabled: true
```

### 4.3 커스텀 메트릭 추가

애플리케이션에 필요한 커스텀 메트릭을 추가할 수 있다:

```java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final Counter orderCounter;
    
    public OrderService(MeterRegistry registry) {
        this.orderCounter = Counter.builder("app.orders.total")
                .description("Total number of orders placed")
                .tag("region", "us-east-1")
                .register(registry);
    }
    
    public void placeOrder() {
        // 주문 처리 로직
        
        // 메트릭 증가
        orderCounter.increment();
    }
}
```

### 4.4 타이머 메트릭 추가

애플리케이션의 응답 시간 등을 측정하기 위한 타이머 메트릭:

```java
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final Timer fetchProductTimer;
    
    public ProductService(MeterRegistry registry) {
        this.fetchProductTimer = Timer.builder("app.product.fetch.time")
                .description("Time taken to fetch product details")
                .tag("tier", "premium")
                .register(registry);
    }
    
    public Product getProductById(String id) {
        return fetchProductTimer.record(() -> {
            // 제품 조회 로직
            return findProductInDatabase(id);
        });
    }
    
    private Product findProductInDatabase(String id) {
        // 실제 DB 조회 로직
        return new Product();
    }
}
```

## 5. Prometheus 설정 및 실행

### 5.1 Prometheus 설정 파일 생성

Prometheus가 모니터링할 타겟과 기타 설정을 정의하는 설정 파일(`prometheus.yml`)을 생성한다:

```yaml
global:
  scrape_interval: 15s  # 기본 수집 간격
  evaluation_interval: 15s  # 규칙 평가 간격

scrape_configs:
  - job_name: 'spring-boot'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['host.docker.internal:8080']  # Docker 사용 시
      # - targets: ['localhost:8080']  # 로컬 실행 시
```

> `host.docker.internal`은 Docker에서 제공하는 특수한 DNS 이름으로, Docker 컨테이너가 호스트 머신(즉, Docker를 실행하는 컴퓨터)의 네트워크 서비스에 접근할 수 있도록 한다. 이를 통해 컨테이너 내부에서 호스트 머신의 네트워크 주소를 참조할 수 있다.

### 5.2 Docker를 사용한 Prometheus 실행

Docker 명령어를 사용해 Prometheus 컨테이너를 실행한다:

```bash
docker run -d --name=prometheus -p 9090:9090 -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

> `-v` 옵션의 앞부분은 방금 생성한 prometheus.yml의 전체 경로를 포함하여 작성해야 한다.

### 5.3 Docker Compose 설정 (선택사항)

여러 컨테이너를 함께 관리하기 위해 Docker Compose를 사용할 수 있다:

```yaml
version: '3'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
```

## 6. Prometheus UI 접속 및 기본 사용법

### 6.1 Prometheus UI 접속

브라우저에서 `http://localhost:9090`에 접속하면 Prometheus 웹 인터페이스를 확인할 수 있다.

### 6.2 타겟 확인

상단 메뉴에서 `Status > Targets`에 접속하여 스프링 애플리케이션의 메트릭 수집 상태를 확인할 수 있다.
`State`가 `UP`인 경우 정상적으로 메트릭을 수집하고 있는 것이다.

### 6.3 기본 쿼리 실행

Prometheus UI에서 `Graph` 탭을 선택하고 다음과 같은 쿼리를 실행해볼 수 있다:

- 시스템 가동 시간: `process_uptime_seconds`
- HTTP 요청 수: `http_server_requests_seconds_count`
- JVM 메모리 사용량: `jvm_memory_used_bytes`
- 시스템 CPU 사용량: `system_cpu_usage`

### 6.4 PromQL 기본 문법

Prometheus Query Language(PromQL)를 사용하여 복잡한 쿼리 실행이 가능하다:

- **인스턴트 벡터**: 특정 시점의 단일 샘플(예: `http_server_requests_seconds_count`)
- **레인지 벡터**: 시간 범위에 걸친 샘플 시리즈(예: `http_server_requests_seconds_count[5m]`)
- **스칼라**: 부동 소수점 값(예: `1.234`)
- **문자열**: 현재 쿼리 평가에만 사용(예: `"hello"`)

주요 연산자:
- **합계**: `sum(http_server_requests_seconds_count)`
- **평균**: `avg(http_server_requests_seconds_count)`
- **최댓값**: `max(http_server_requests_seconds_count)`
- **최솟값**: `min(http_server_requests_seconds_count)`
- **특정 시간 범위의 평균 계산**: `rate(http_server_requests_seconds_count[5m])`

### 6.5 레이블 필터링

특정 레이블을 기준으로 데이터 필터링이 가능하다:

- **정확한 일치**: `http_server_requests_seconds_count{status="200"}`
- **정규식 일치**: `http_server_requests_seconds_count{uri=~"/api/.*"}`
- **복합 필터**: `http_server_requests_seconds_count{status="200", method="GET"}`

## 7. Grafana 연동

### 7.1 Grafana 실행

Docker를 사용하여 Grafana를 실행한다:

```bash
docker run -d --name=grafana -p 3000:3000 grafana/grafana
```

### 7.2 Prometheus 데이터 소스 추가

1. `http://localhost:3000`으로 접속 (기본 계정: admin/admin)
2. 왼쪽 메뉴에서 `Configuration > Data Sources` 선택
3. `Add data source` 클릭
4. `Prometheus` 선택
5. URL에 `http://host.docker.internal:9090` 입력 (Docker 사용 시)
6. `Save & Test` 클릭하여 연결 확인

### 7.3 대시보드 생성

1. `Create > Dashboard` 선택
2. `Add new panel` 클릭
3. 쿼리 편집기에서 Prometheus 쿼리 입력 (예: `rate(http_server_requests_seconds_count[5m])`)
4. 패널 제목, 설명 등 설정
5. `Apply` 클릭하여 패널 추가
6. 대시보드 저장

### 7.4 기존 대시보드 임포트

Spring Boot 애플리케이션 모니터링을 위한 다양한 커뮤니티 대시보드가 존재한다:

1. `Create > Import` 선택
2. 대시보드 ID 입력 (Spring Boot 2.1+ 용 대시보드 ID: 12900)
3. `Load` 클릭
4. Prometheus 데이터 소스 선택
5. `Import` 클릭하여 대시보드 가져오기

## 8. 알림 설정

### 8.1 Prometheus 알림 규칙 추가

prometheus.yml 파일에 알림 규칙 설정을 추가한다:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - 'alert_rules.yml'  # 알림 규칙 파일

scrape_configs:
  - job_name: 'spring-boot'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['host.docker.internal:8080']

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - 'alertmanager:9093'
```

### 8.2 알림 규칙 파일 생성

`alert_rules.yml` 파일을 생성한다:

```yaml
groups:
- name: spring-boot-alerts
  rules:
  - alert: HighRequestLatency
    expr: http_server_requests_seconds_sum / http_server_requests_seconds_count > 0.5
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "High request latency on {{ $labels.instance }}"
      description: "Spring Boot app has a request latency above 500ms for 2 minutes."
      
  - alert: HighErrorRate
    expr: sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m])) > 0.05
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "High error rate"
      description: "Error rate is above 5% for 2 minutes."
```

### 8.3 Alertmanager 설정

`alertmanager.yml` 파일을 생성한다:

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'email-notifications'

receivers:
- name: 'email-notifications'
  email_configs:
  - to: 'your-email@example.com'
    from: 'alertmanager@example.com'
    smarthost: 'smtp.example.com:587'
    auth_username: 'your-username'
    auth_password: 'your-password'
```

### 8.4 Alertmanager 실행

```bash
docker run -d --name=alertmanager -p 9093:9093 -v /path/to/alertmanager.yml:/etc/alertmanager/alertmanager.yml prom/alertmanager
```

## 9. 모범 사례

### 9.1 메트릭 네이밍 규칙

- 애플리케이션 이름을 접두어로 사용: `app_name_metric_name`
- 단위를 접미어로 포함: `http_requests_total`, `request_duration_seconds`
- 일관된 레이블 사용: 동일한 메트릭에 대해 항상 동일한 레이블 세트 유지

### 9.2 스토리지 최적화

- 적절한 데이터 보존 기간 설정
- 불필요한 메트릭 수집 제한
- 적절한 스크랩 간격 설정 (기본값 15초가 대부분의 경우 적절)

### 9.3 보안 고려사항

- Prometheus 엔드포인트에 인증 추가
- 프로덕션 환경에서는 네트워크 접근 제한
- 민감한 메트릭에 접근 제어 설정

## 10. 결론

Prometheus는 강력한 모니터링 도구로, Spring Boot 애플리케이션과 통합하면 실시간으로 시스템 상태를 모니터링하고 문제를 사전에 감지할 수 있다. Micrometer와 Spring Boot Actuator를 통해 쉽게 메트릭을 노출하고, Prometheus를 사용하여 수집하고, Grafana를 통해 시각화함으로써 종합적인 모니터링 시스템을 구축할 수 있다.

Prometheus의 풀 모델(Pull Model) 접근 방식과 다양한 인테그레이션 옵션을 통해 마이크로서비스 아키텍처부터 단일 애플리케이션까지 다양한 환경에서 효과적으로 활용할 수 있다.