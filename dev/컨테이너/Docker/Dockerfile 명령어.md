# Dockerfile 명령어

## 요약

| 문법 | 설명 |
| --- | --- |
| FROM | 기본 이미지 |
| RUN | 쉘 명령어 실행 |
| CMD | 컨테이너 기본 실행 명령어 (Entrypoint의 인자로 사용) |
| EXPOSE | 오픈되는 포트 정보 |
| ENV | 환경변수 설정 |
| ADD | 파일 또는 디렉토리 추가. URL/ZIP 사용가능 |
| COPY | 파일 또는 디렉토리 추가 |
| ENTRYPOINT | 컨테이너 기본 실행 명령어 |
| VOLUME | 외부 마운트 포인트 생성 |
| USER | RUN, CMD, ENTRYPOINT를 실행하는 사용자 |
| WORKDIR | 작업 디렉토리 설정 |
| ARGS | 빌드타임 환경변수 설정 |
| LABEL | key - value 데이터 |
| ONBUILD | 다른 빌드의 베이스로 사용될때 사용하는 명령어 |

<br>

**`.dockerignore`**
- cf. git의 .ignore
- 도커 빌드 컨텍스트에서 지정된 패턴의 파일을 무시.
- .git이나 민감한 정보를 제외하는 용도로 주로 사용
- .git이나 에셋 디렉터리만 제외시켜도 빌드 속도가 개선됨
- 이미지 빌드 시에 사용하는 파일은 제외시키면 안 됨 


## 예제
```bash
    mkdir git
    cd git
    touch Dockerfile
```

`Dockerfile`
```
    FROM ubuntu:latest

    RUN apt-get update
    RUN apt-get install -y git
```

```bash
    cd git
    docker build -t ubuntu:docker-git
```

만든 image를 run하여 컨테이너 만들기
```bash
    docker run -it --name ubuntu-git ubuntu:docker-git bash
```

<br><br>
---

[도커명령어](https://cultivo-hy.github.io/docker/image/usage/2019/03/14/Docker%EC%A0%95%EB%A6%AC/#dockerfile-%EA%B8%B0%EB%B3%B8-%EB%AA%85%EB%A0%B9%EC%96%B4) 참고