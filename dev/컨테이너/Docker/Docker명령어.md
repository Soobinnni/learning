# Docker 명령어

### 목차
1. <a href = "#a">도커 설치하기</a>
2. <a href = "#b">도커 버전 확인</a>
3. <a href = "#c">run</a>
4. <a href = "#d">exec</a>
5. <a href = "#e">ps</a>
6. <a href = "#f">stop</a>
7. <a href = "#g">rm</a>
8. <a href = "#h">logs</a>
9. <a href = "#i">images</a>
10. <a href = "#j">pull</a>
10. <a href = "#k">rmi</a>
10. <a href = "#l">network create</a>
10. <a href = "#m">network connect</a>
10. <a href = "#n">volume mount(-v)</a>
10. <a href = "#o"></a>

<br>

## :star: <span id = "a">도커 설치하기</span>
1) 리눅스 

    `curl -s https://get.docker.com/ | sudo sh` 
    
    명령어 입력 > 패스워드 입력 > 리눅스 배포판에 따라 자동으로 최신 버전의 도커가 설치된다.

    우분투를 사용한다면,
    
    `sudo usrmod -aG docker ubuntu` 명령어로 그룹을 변경하여 도커 명령어를 사용할 수 있게 권한을 준다

2) MacOS or Windows

    Docker for Mac / Docker for Windows

    도커에서 공식으로 제공하는 프로그램을 설치한다.
    도커는 기본적으로 linux를 지원하기 때문에 MacOS와 Windows에 설치되는 Docker는 가상머신에 설치됨
    MacOS는 xhyve를 사용하고 Windows는 Hyper-V 사용

<br>

## :star: <span id = "b">도커 버전 확인</span>
```
    docker version
```

<br>

## :star: <span id = "c">run</span>
- 컨테이너 실행 명령어

    ```bash
    docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
    ```


    :heart: OPTIONS
    - docker run 명령어에 전달할 옵션을 지정.

    :heart: IMAGE[:TAG|@DIGEST]
    - 실행할 Docker 이미지를 지정
    - IMAGE: Docker Hub 또는 로컬 Docker 레지스트리에서 사용 가능한 이미지 이름
    - TAG: 이미지의 버전 또는 태그를 지정. 이 부분을 생략하면 기본적으로 "latest" 태그를 사용
    - DIGEST: 이미지의 고유한 다이제스트 값을 사용하여 이미지를 지정. 다이제스트는 이미지의 내용을 나타내는 해시값

    :heart: COMMAND
    - 실행할 명령을 지정. 이것은 컨테이너 내에서 실행할 프로그램이나 스크립트의 경로 또는 명령어일 수 있음.
    - 이 부분을 생략하면 이미지의 기본 실행 명령이 실행
    - 명령은 컨테이너 시작 후에 실행될 것

    :heart: ARG
    - 필요한 경우 명령에 전달할 추가적인 인수나 옵션을 지정할 수 있음.
    - 이 부분은 [COMMAND]에 전달될 인수

    | option | description |
    | --- | --- |
    | -d | detached mode (백그라운드 모드)로, 백그라운드에서 컨테이너 내부의 명령을 실행하도록 함. 이렇게 하면 터미널을 차지하지 않고 다른 작업을 수행할 수 있음.  |
    | -p | 호스트와 컨테이너의 포트를 연결 |
    | -v | 호스트와 컨테이너의 디렉토리를 연결 |
    | -e | 컨테이너 내에서 사용할 환경변수 설정(실행 중인 명령에 환경 변수를 전달) |
    | --name | 컨테이너 이름 설정 |
    | --rm | 프로세스 종료시 컨테이너 자동 제거(컨테이너 실행이 완료되면 컨테이너를 자동으로 제거, 일회성 작업에 유용) |
    | -it | i와 -t를 동시에 사용한 것으로 터미널 입력을 위한 옵션 |
    | --network | 네트워크 연결 |

> 부연설명
- run 명령어를 사용하면 사용할 이미지가 저장되어 있는지 확인하고 없다면 다운로드 (pull) 한 후 컨테이너를 생성(create)하고 시작(start)
- 도커 이미지마다 컨테이너가 만들어질때 실행할 명령어를 지정할 수 있음
- `docker run ubuntu:20.04` 명령어 이후 컨테이너가 바로 종료되는 이유?
  - 명령어로 컨테이너는 정상적으로 실행됐지만 컨테이너는 ***프로세스***이기 때문에 해당 명령어로는 생성 이후 실행중인 프로세스가 없으므로 컨테이너는 생성되자마자 종료되게 된다.
- `docker run --rm -it ubuntu:20.04 /bin/sh`
  - 컨테이너 내부에 들어가기 위해 sh를 실행하고 키보드 입력을 위해 -it 옵션 추가 > 우분투 컨테이너 쉘이 보임
  - 추가적으로 프로세스가 종료되면 컨테이너가 자동으로 삭제되도록 --rm 옵션도 추가
  - --rm 옵션이 없다면 컨테이너가 종료되더라도 삭제되지 않고 남아 있어 수동으로 삭제해야 함
    - 컨테이너는 실행 중 | 멈춤 | 없음 상태가 있는데,, --rm옵션 없이 exit한 경우 멈추게 되고 필요하다면 재접속이 가능함

<br>

 - ***`-p 옵션`***

    ``` shell
        -p 호스트포트:컨테이네포트
    ```   

    - 컨테이너의 포트와 호스트의 포트 간의 포트 매핑을 설정하는 데 사용.

    - 컨테이너 내에서 실행 중인 애플리케이션의 포트를 호스트 시스템의 포트와 연결하여 외부에서 컨테이너의 애플리케이션에 액세스할 수 있게 한다.

    예시 

        docker run -p 8080:80 my-web-app
        docker run --rm -p 5678:5678 hashicorp/http-echo -text="hello world"
    - 호스트의 8080 포트를 컨테이너 내의 80 포트로 매핑합니다. 
    - 따라서 호스트 시스템에서 8080 포트로 접속하면 해당 요청이 컨테이너 내의 80 포트로 전달되며, 컨테이너 내의 웹 애플리케이션에 액세스할 수 있음.

  - ***`--network 옵션`***
        
        docker run -d -p 8080:80 \
            --network=app-network \
            -e WORDPRESS_DB_HOST=mysql \
            -e WORDPRESS_DB_NAME=wp \
            -e WORDPRESS_DB_USER=wp \
            -e WORDPRESS_DB_PASSWORD=wp \
            wordpress 
    - 컨테이너를 실행할 때 연결할 네트워크를 설정한다. 위 예시에선, wordpress컨테이너를 app-network란 네트워크에 연결한다.

<br>

## :star: <span id = "d">exec</span>

- **실행 중인** Docker 컨테이너에 접속하여 그 내에서 추가적인 프로세스나 명령을 실행하도록 하는 Docker 명령어
- 해당 명령어로 컨테이너 내부에 ssh 서버 등을 설치하지 않고 컨테이너 내부 환경에서 작업을 수행할 수 있음
  
        docker exec [OPTIONS] CONTAINER COMMAND [ARG...]


    :heart: OPTIONS
    - docker exec 명령어에 전달할 옵션을 지정.

    :heart: CONTAINER
    - 명령을 실행할 Docker 컨테이너의 이름이나 ID를 지정.

    :heart: COMMAND
    - 실행할 명령을 지정. 이것은 컨테이너 내에서 실행할 프로그램이나 스크립트의 경로 또는 명령어일 수 있음.

    :heart: ARG
    - 필요한 경우 명령에 전달할 추가적인 인수나 옵션을 지정할 수 있음.

    | option | description |
    | --- | --- |
    | -it | i와 -t를 동시에 사용한 것으로 터미널 입력을 위한 옵션 |
    | --user | 실행할 사용자를 지정. 사용자를 UID 또는 사용자 이름으로 지정할 수 있음 |
    | --workdir 또는 -w | 작업 디렉토리를 지정. 명령이 실행될 때 컨테이너 내부의 현재 작업 디렉토리를 변경함 |
    | -e | 컨테이너 내에서 사용할 환경변수 설정(실행 중인 명령에 환경 변수를 전달) |
    | -d | detached mode (백그라운드 모드)로, 백그라운드에서 컨테이너 내부의 명령을 실행하도록 함. 이렇게 하면 터미널을 차지하지 않고 다른 작업을 수행할 수 있음. |
    | --rm | 프로세스 종료시 컨테이너 자동 제거(컨테이너 실행이 완료되면 컨테이너를 자동으로 제거, 일회성 작업에 유용) |
    | --name | 컨테이너에 이름을 지정 |
    | --network | 네트워크 연결 |
    | --help | 도움말 메시지를 표시하고 사용 가능한 옵션과 명령어에 대한 설명을 확인 가능. |

- 예시
  
  (1) MySQL클라이언트 접속
  
      docker exec -it mysql mysql

  -  --name옵션으로 지정해둔 이름인 mysql(전자) 컨테이너에 접속, mysql(후자)라는 실행 명령어를 실행함
  - 해당 명령어로, mysql 클라이언트에 접속하게 된다.


  (2) "mycontainer"라는 이름의 Docker 컨테이너에서 Bash 셸을 실행

        docker exec -it mycontainer /bin/bash

  -  "mycontainer"라는 컨테이너 내에서 대화형으로 Bash 셸을 실행, -it 옵션으로 터미널 상호작용을 가능하게 함.

<br>

## :star: <span id = "e">ps</span>

- process list를 보는 명령어

        docker ps
    
 - 옵션 -a :  중지된 컨테이너도 확인함

        docker ps -a


<br>

## :star: <span id = "f">stop</span>

- 실행중인 컨테이너를 중지하는 명령어.
- 실행중인 컨테이너를 하나 또는 여러개 (띄어쓰기) 중지할 수 있음

        docker stop [OPTIONS] CONTAINER [CONTAINER...]

<br>

## :star: <span id = "g">rm</span>

- 종료된 컨테이너를 완전히 제거하는 명령어 
- 컨테이너를 하나 또는 여러개 (띄어쓰기) 제거할 수 있음
  
      docker rm [OPTIONS] CONTAINER [CONTAINER...]


    | option | description |
    | --- | --- |
    | -f, --force | 실행 중인 컨테이너를 강제로 중지하고 삭제. |
    | -v, --volumes | 컨테이너와 연결된 볼륨도 함께 삭제. 이 옵션을 사용하지 않으면 컨테이너만 삭제. |
    | -link | 다른 컨테이너에 대한 링크를 제거. 예를 들어, 컨테이너 A가 컨테이너 B에 대한 링크를 가지고 있는 경우, docker rm --link A:B 명령을 사용하여 이 링크를 제거. |


        docker rm -f container_name

        docker rm -v container_name
        
        docker rm --link container_A:container_B
        
<br>

## :star: <span id = "h">logs</span>

- 컨테이너가 정상적으로 동작하는지 컨테이너의 로그를 확인하는 명령어
  
        docker logs [OPTIONS] CONTAINER 



    | option | description |
    | --- | --- |
    | --follow, -f | 로그 출력을 실시간으로 감시. 컨테이너에서 발생하는 새로운 로그 메시지를 지속적으로 표시하며, 컨테이너가 종료될 때까지 계속 실행. |
    | --tail | 로그의 마지막에서부터 출력할 라인 수를 지정. 기본값은 "all"로 모든 로그를 출력. |

        docker logs -f container_name

        docker logs --tail 20 container_name
        
<br>

## :star: <span id = "i">images</span>

- 도커가 다운로드한 이미지 목록을 보는 명령어

        docker images [OPTIONS] [REPOSITORY[:TAG]]

![image](https://github.com/Soobinnni/learning/assets/111328823/17fdb5ea-3b71-47ec-9ea6-4ee384e77982)

        
<br>

## :star: <span id = "j">pull</span>

- 이미지를 다운로드하는 명령어
- 예 : docker pull ubuntu:18.04
  
        docker pull [OPTIONS] NAME[:TAG|@DIGEST]
<br>

## :star: <span id = "k">rmi</span>

- 이미지를 삭제
- images 명령어를 통해 얻는 이미지 목록에서 이미지 ID를 입력하면 삭제
- 단, 컨테이너가 실행중인 이미지는 삭제되지 않음

        docker rmi [OPTIONS] IMAGE [IMAGE...]
<br>

## :star: <span id = "l">network create</span>

- 도커 컨테이너끼리 이름으로 통신할 수 있는 가상 네트워크를 만듦
  
        docker network create [OPTIONS] NETWORK
- `docker network create app-network`
  - app-network 라는 이름으로 wordpress와 mysql이 통신할 네트워크를 만듦
<br>

## :star: <span id = "m">network connect</span>

- 기존에 생성된 컨테이너에 네트워크를 추가

        docker network connect [OPTIONS] NETWORK CONTAINER
- `docker network connect app-network mysql`
  - mysql 컨테이너에 네트워크를 추가x
- --network 옵션으로 컨테이너를 실행할 때,네트워크를 연결할 수 있음
  
        docker run -d -p 8080:80 \
            --network=app-network \
            -e WORDPRESS_DB_HOST=mysql \
            -e WORDPRESS_DB_NAME=wp \
            -e WORDPRESS_DB_USER=wp \
            -e WORDPRESS_DB_PASSWORD=wp \
            wordpress
<br>

## :star: <span id = "n"><a href="https://github.com/Soobinnni/learning/blob/main/dev/컨테이너/Docker/Volume.md">volume</a> mount(-v)</span>
- 호스트 및 컨테이너 간의 데이터를 저장하고 공유하기 위해 디렉토리를 연결하는 명령어
- 도커 컨테이너끼리 이름으로 통신할 수 있는 가상 네트워크를 만듦

- 필요성
  - 예를 들어, MySQL 컨테이너를 삭제하면, 해당 컨테이너가 가지고 있던 데이터도 함께 삭제 > host path 또는 volume을 생성하여 연결하면 컨테이너 생명 주기와 관련 없이, 데이터를 저장 및 보존할 수 있음 > 새 컨테이너가 생성되면, 해당 볼륨(or host path)을 연결하여 그 데이터를 그대로 가져다 사용할 수 있음

- host path 연결
  - 실습

    1. mkdir 디렉토리명
    2. cd 디렉토리명
    3. pwd 명령어로 해당 디렉토리의 절대 경로 알아낸 뒤 복사
    4. 호스트 패스(절대경로)와 컨테이너 연결 
  
            docker run -d -p 3306:3306 \
                -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
                --network=app-network \
                --name mysql \
                -v /home/soobin/host_path_dir:/var/lib/mysql \
            mysql:5.7
    
    5. 새로 생성된 mysql 컨테이너에 데이터를 저장하면 2.의 디렉토리에 데이터가 저장된 것을 확인할 수 있음

        ![image](https://github.com/Soobinnni/learning/assets/111328823/7b76c1fd-aeb2-4b26-bf0c-70bb09248709)
  