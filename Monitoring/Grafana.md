# Grafana 모니터링 및 알림 설정

## 1. Grafana란?

Grafana는 오픈소스 데이터 시각화 및 모니터링 도구이다. 다양한 데이터 소스를 지원하여 데이터를 시각화하고 분석할 수 있도록 돕는다. Grafana는 대시보드를 생성하고, 데이터를 그래프나 차트 형태로 표현하며, 알림 기능을 제공하여 모니터링을 강화할 수 있다.

### 1.1 Grafana의 주요 특징

- **다양한 데이터 소스 통합**: Prometheus, InfluxDB, Graphite, Elasticsearch, MySQL, PostgreSQL 등 여러 데이터 소스와 연동
- **직관적인 대시보드**: 사용하기 쉬운 인터페이스로 강력한 시각화 대시보드 구성
- **자동화된 알림**: 특정 조건이 충족될 때 이메일, Slack, PagerDuty 등으로 알림 전송
- **사용자 관리**: 팀 내에서 권한 설정과 협업이 가능한 사용자 관리 시스템
- **플러그인 생태계**: 확장 가능한 플러그인으로 다양한 기능 추가 가능

## 2. Grafana 주요 기능

### 2.1 대시보드 생성

Grafana는 사용자가 데이터를 시각화할 수 있는 대시보드를 생성할 수 있도록 한다. 여러 가지 그래프, 차트, 게이지 등을 사용하여 데이터를 시각적으로 표현할 수 있다.

- 다양한 시각화 옵션 (그래프, 히트맵, 테이블, 게이지 등)
- 드래그 앤 드롭 인터페이스로 패널 배치
- 템플릿 변수를 통한 동적 대시보드

### 2.2 다양한 데이터 소스 지원

Prometheus, InfluxDB, Graphite, Elasticsearch, MySQL, PostgreSQL 등 다양한 데이터 소스를 지원한다. 이를 통해 여러 시스템과 애플리케이션의 데이터를 통합하여 시각화할 수 있다.

- 하나의 대시보드에서 여러 데이터 소스 활용 가능
- 복잡한 쿼리 작성 및 변환
- 데이터 소스별 최적화된 에디터 제공

### 2.3 알림 기능

조건을 설정하여 조건이 충족되면 이메일, Slack, PagerDuty 등 다양한 채널을 통해 알림을 보낼 수 있다. 이를 통해 시스템 상태를 실시간으로 모니터링하고 문제가 발생했을 때 즉시 대응할 수 있다.

- 임계값 기반 알림 설정
- 다중 채널 알림 라우팅
- 알림 기록 및 상태 추적

### 2.4 플러그인 지원

Grafana는 플러그인 아키텍처를 지원하여, 다양한 플러그인을 통해 기능을 확장할 수 있다. 예를 들어, 새로운 데이터 소스나 시각화 유형을 추가할 수 있다.

- 데이터 소스 플러그인
- 패널 플러그인
- 앱 플러그인

### 2.5 사용자 관리

사용자를 관리하고, 대시보드와 데이터 소스에 대한 접근 권한을 설정할 수 있다. 이를 통해 팀 내에서 협업을 강화하고 데이터 보안을 유지할 수 있다.

- 역할 기반 접근 제어
- 사용자 그룹 관리
- 조직 간 분리

## 3. Grafana 설치 및 설정

### 3.1 Docker를 사용한 설치

Grafana를 가장 쉽게 설치하는 방법은 Docker를 사용하는 것이다:

```bash
docker run -d --name=grafana -p 3000:3000 grafana/grafana
```

### 3.2 초기 설정

1. 웹 브라우저에서 `http://localhost:3000`에 접속
2. 기본 사용자 이름과 비밀번호로 로그인 (기본값: admin/admin)
3. 최초 로그인 시 비밀번호 변경 권장

### 3.3 Prometheus 데이터 소스 연결

1. 왼쪽 사이드 메뉴에서 "Connections" > "Data sources" 선택
2. "Add data source" 버튼 클릭
3. 목록에서 "Prometheus" 선택
4. 다음 설정 입력:
    - Name: 원하는 이름 (예: Prometheus)
    - URL: Prometheus 서버 주소 (예: http://host.docker.internal:9090)
    - 기타 설정은 기본값 유지
5. "Save & test" 버튼을 클릭하여 연결 테스트 및 저장

### 3.4 대시보드 가져오기

Grafana는 커뮤니티에서 제작한 다양한 대시보드를 가져와 사용할 수 있다:

1. 왼쪽 메뉴에서 "Dashboards" > "Import" 선택
2. 대시보드 ID 입력란에 Spring Boot 대시보드 ID 입력 (예: 19004)
3. "Load" 버튼 클릭
4. 데이터 소스 선택 (앞서 설정한 Prometheus)
5. "Import" 버튼 클릭하여 대시보드 가져오기 완료

## 4. Slack 알림 설정하기

### 4.1 Slack 앱 생성

1. Slack 워크스페이스에 가입 또는 생성
2. [Slack API 웹사이트](https://api.slack.com/apps)에 접속하여 "Create an App" 클릭
3. "From scratch" 옵션 선택
4. 앱 이름 입력 및 워크스페이스 선택

### 4.2 Slack 앱 권한 설정

1. "OAuth & Permissions" 메뉴로 이동
2. "Scopes" 섹션에서 "Bot Token Scopes"에 "chat:write" 권한 추가
3. 페이지 상단의 "Install to Workspace" 버튼 클릭하여 앱 설치
4. 설치 승인

### 4.3 Slack 웹훅 설정

1. "Incoming Webhooks" 메뉴로 이동
2. "Activate Incoming Webhooks"를 활성화
3. "Add New Webhook to Workspace" 버튼 클릭
4. 알림을 받을 채널 선택
5. 생성된 웹훅 URL 복사
6. Slack 앱에서 알림을 받을 채널로 이동하여 "@앱이름"으로 앱 초대

### 4.4 Grafana에서 Slack 알림 설정

1. Grafana 사이드 메뉴에서 "Alerting" > "Contact points" 선택
2. "Add contact point" 버튼 클릭
3. 다음 정보 입력:
    - Name: 원하는 이름 (예: Slack-Alerts)
    - Integration: "Slack" 선택
    - Webhook URL: 앞서 복사한 Slack 웹훅 URL 붙여넣기
4. "Test" 버튼을 클릭하여 테스트 메시지 전송
5. "Save contact point" 버튼 클릭

### 4.5 알림 정책 설정

1. "Alerting" > "Notification policies" 선택
2. "Default policy" 옆의 수정 버튼 클릭
3. "Default contact point"를 앞서 생성한 Slack 연락처로 변경
4. "Save" 버튼 클릭

## 5. 알림 규칙 설정

### 5.1 새 알림 규칙 생성

1. "Alerting" > "Alert rules" 선택
2. "New alert rule" 버튼 클릭
3. 알림 규칙 이름 입력 (예: Spring Boot Down Alert)

### 5.2 알림 조건 설정

1. "Define query and alert condition" 섹션에서:
    - Data source: Prometheus 선택
    - Metric: "up" 선택
    - Label filter: "job" = "spring-boot" 설정
2. "Expression" 섹션에서:
    - Operation: "IS BELOW" 선택
    - Threshold: "1" 입력 (애플리케이션이 down되면 값이 0이 됨)

### 5.3 평가 동작 설정

1. "Set evaluation behavior" 섹션에서:
    - Folder: 기존 폴더 선택 또는 새 폴더 생성
    - Evaluation group: 기존 그룹 선택 또는 새 그룹 생성
    - Evaluation interval: "1m" (1분마다 평가)
    - Pending period: "1m" (1분간 조건이 지속되면 알림 발생)

### 5.4 알림 세부 설정

1. "Configure labels and annotations" 섹션에서:
    - Summary: "Spring Boot application is down" 입력
    - Description: "The Spring Boot application has been down for more than 1 minute" 입력
2. "Save" 버튼을 클릭하여 알림 규칙 저장

## 6. 알림 테스트 및 확인

### 6.1 알림 상태 확인

1. "Alerting" > "Alert rules"에서 생성한 알림 규칙의 상태 확인
2. 상태가 "Normal"인지 확인 (애플리케이션이 정상 작동 중일 때)

### 6.2 알림 테스트

1. Spring Boot 애플리케이션 중지
2. 잠시 기다리면 알림 상태가 "Pending"에서 "Firing"으로 변경됨
3. Slack 채널에서 알림 메시지 수신 확인

### 6.3 알림 해제 확인

1. Spring Boot 애플리케이션 재시작
2. 잠시 기다리면 알림 상태가 "Firing"에서 "Normal"로 변경됨
3. Slack 채널에서 "Resolved" 메시지 수신 확인

## 7. 고급 대시보드 기능

### 7.1 템플릿 변수 사용

템플릿 변수를 사용하여 대시보드를 동적으로 구성할 수 있다:

1. 대시보드 설정에서 "Variables" 선택
2. "Add variable" 클릭
3. Name, Type 등 설정 후 "Update" 클릭
4. 대시보드 패널 쿼리에서 $variable_name 형식으로 사용

### 7.2 대시보드 주석 추가

중요 이벤트를 대시보드에 표시할 수 있다:

1. 대시보드 설정에서 "Annotations" 선택
2. "Add annotation query" 클릭
3. 필요한 설정 후 "Update" 클릭

### 7.3 시간 범위 컨트롤

대시보드 상단의 시간 범위 선택기를 통해 데이터 조회 기간을 조정할 수 있다:

- 미리 정의된 범위 (예: Last 5 minutes, Last 1 hour)
- 사용자 정의 범위
- 자동 새로 고침 간격 설정

## 8. 결론

Grafana는 다양한 데이터 소스를 통합하여 시각화하고, 효과적인 알림 시스템을 구축할 수 있는 강력한 도구이다. Spring Boot 애플리케이션과 Prometheus를 연동하여 모니터링 시스템을 구축하고, Slack과 같은 커뮤니케이션 도구와의 통합을 통해 실시간 알림을 받을 수 있다.

이를 통해 시스템 장애를 신속하게 감지하고 대응할 수 있으며, 성능 문제를 사전에 파악하여 예방할 수 있다. Grafana의 다양한 시각화 옵션과 커스터마이징 기능을 활용하면 기업의 요구사항에 맞는 맞춤형 모니터링 시스템을 구축할 수 있다.