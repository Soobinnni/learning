# MySQL 실행하기
    docker run \
        -d -p 3306:3306 \
        -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
        --name mysql \
        mysql:5.7

- -d 옵션으로 해당 컨테이너가 백그라운드로 실행됨 > 로그가 뜨지 않음
- -e 옵션으로 MYSQL_ALLOW_EMPTY_PASSWORD = true로 설정하면서, 비밀번호 입력 없이 데이터베이스에 접근하도록 설정
- --name옵션으로 이름을 지정함

<br>

**`위에서 생성한 MySQL 컨테이너에 접속하므로써 MySQL 데이터베이스를 실행`**

    docker exec -it mysql mysql

- docker exec 명령어로 --name옵션으로 지정해둔 이름인 mysql(전자) 컨테이너에 접속, mysql(후자)라는 실행 명령어를 실행함
  - 해당 명령어로, mysql 클라이언트에 접속하게 된다.

    ![docker mysql](https://github.com/Soobinnni/learning/assets/111328823/137d2f44-06da-4f87-a24b-2a1a5561541b)


  - 위와 같은 MySQL 커맨드 창에 똑같이 SLQ문을 이용하여 데이터베이스에 접속, 조작 등이 가능하다

        show database;
        create database wp CHARACTER SET utf8;
        grant all privileges on wp.* to wp@'%' identified by 'wp';
        flush privileges;
        quit
