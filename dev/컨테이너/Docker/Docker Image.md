# Docker Image

- 도커 이미지는 여러 개의 레이어(layer)로 구성.
- 각 레이어는 파일 시스템의 변경 사항을 저장하고, 이러한 레이어들이 쌓여서 최종적으로 도커 이미지를 형성
- ∴ 도커는 새로운 상태를 이미지로 저장함

<br>

## 레이어

- 레이어들은 변경 가능한 컨텐츠와 불변하는 컨텐츠로 구성.
- 각 레이어드 파일은 이전 레이어에 대한 변경 사항을 기록하므로 레이어드 파일은 파일 시스템의 스냅샷으로 볼 수 있음.
- 각 레이어는 파일 및 디렉토리의 변경 사항을 표현하고, 이미지가 실행되는 도중에 변경 가능한 부분은 해당 레이어에 저장

<br>



## 도커 이미지 만들기

- 도커 이미지를 만들 때 `docker commit` 명령어와 `docker build` 명령어는 둘 다 사용할 수 있음. 
- 목적과 사용 사례에 따라 선택
- 일반적으로는 `docker build` 명령어를 선호
  - Dockerfile을 사용하면 이미지를 생성하는 데 필요한 모든 구성을 명시적으로 정의할 수 있으며, 버전 관리 및 공유가 더 용이하며 또, Dockerfile을 통해 빌드 프로세스를 자동화하고 반복 가능한 방식으로 이미지를 생성할 수 있기 때문.


:star: **docker commit 명령어:**
-  현재 실행 중인 컨테이너의 상태를 기반으로 이미지를 생성할 때.
- 주로 간단한 테스트, 실험 또는 이미지의 빠른 생성을 위해 사용.
  
     ```bash
     docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
     ```
     `CONTAINER`는 커밋할 컨테이너의 ID 또는 이름이고, `REPOSITORY[:TAG]`는 새 이미지의 이름과 태그를 지정.

<br>

:star: **docker build 명령어:**
   - Dockerfile을 사용하여 이미지를 정의하고 생성할 때.
   - 보다 구조화된 방식으로 이미지를 정의하고 빌드.

  1) Dockerfile을 이용하여 빌드할 때

      ```bash
      docker build [OPTIONS] PATH | URL | -
      ```
     `PATH`는 Dockerfile이 위치한 경로.

<br>

  2) 태그로 지정할 때
  
      ```bash
          docker build -t namespace/이미지이름:태그 .
        ``` 

<br>




## 예시

### :star: 도커 이미지 상태 변화

![도커 이미지 상태 변화](https://github.com/Soobinnni/learning/assets/111328823/2f93c663-2824-41ab-bba7-1ba19462b6e9)

<br>

1. ubuntu 최신(latest) 버전의 이미지를 실행

    <img src = "https://github.com/Soobinnni/learning/assets/111328823/a83580b4-1a5c-43d4-b481-e3dd7efa77e4" alt = "base image" width = "250px"/>

    ```bash
        docker run -it --name git ubuntu:latest bash 
    ```
- 최신 버전의 우분투 이미지가 실행됨.
- git이 설치되지 않은 상태.

<br>

1. 1의 우분투 이미지에 추가적으로 git을 설치함

    <img src = "https://github.com/Soobinnni/learning/assets/111328823/939c7a43-66b4-4584-9037-298b55cb18b2" alt = "Container" width = "250px"/>

    ```bash
        apt-get update
        apt-get install git
        exit
    ```
- 이렇게 Base Image에 git을 추가적으로 설치한 후 이미지를 커밋
  
    ```bash
        docker commit git ubuntu:git
    ```
- git이란 이름의 우분투 컨테이너를 ubuntu의 태그 git으로 커밋

<br>

1. 태그 git으로 저장하였으니, ubuntu:git으로 run했을 때, git이 설치되어 있는 ubuntu 컨테이너(커스텀 컨테이너)를 실행할 수 있음

    <img src = "https://github.com/Soobinnni/learning/assets/111328823/c59b3bca-e730-4b3b-9d8d-087693582e92" alt = "custom image" width = "180px"/>

   ```bash
        docker run -it --name git2 ubuntu:git bash
   ```

<br>




---

### 추가 설명
- **roofts** : 파일 시스템을 계층적으로 구성할 때 시스템의 시작점이 되는 루트 파일 시스템을 가리킴
