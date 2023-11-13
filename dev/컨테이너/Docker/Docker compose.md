# Docker Compose
- 여러 개의 도커 컨테이너를 정의하고 실행하기 위한 도구
- Docker Compose를 사용하면 여러 컨테이너를 하나의 프로젝트로 정의하고, 이를 간단한 설정 파일(YAML 형식)로 관리할 수 있다. 
  - YAML 파일을 사용하여 서비스, 네트워크 및 볼륨과 같은 여러 도커 구성 요소를 정의하고, 이러한 정의를 사용하여 여러 컨테이너를 쉽게 생성하고 실행.


### :star: 예시
- 웹 애플리케이션과 데이터베이스를 함께 실행해야 하는 경우, Docker Compose를 사용하여 두 개의 도커 컨테이너를 정의하고 이를 함께 실행

    ```yaml
    version: '3'
    services:
    web:
        image: nginx:latest
    db:
        image: postgres:latest
  ```

- 두 개의 서비스 (`web`과 `db`)를 정의하고 각각의 이미지를 지정 -> 이러한 정의를 사용하여 `docker-compose up` 명령어로 두 컨테이너를 동시에 실행할 수 있음.