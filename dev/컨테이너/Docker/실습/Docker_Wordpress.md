# 워드프레스 블로그 실행하기

__MySQL 컨테이너를 생성한 상태에서 만들 것__

    docker run \
        -d -p 3306:3306 \
        -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
        --name mysql \
        mysql:5.7

__Wordpress 컨테이너 생성 및 실행__

    docker run -d -p 8080:80 \
     --name wordpress \
     --add-host host.docker.internal:host-gateway \
     -e WORDPRESS_DB_HOST=host.docker.internal \
     -e WORDPRESS_DB_NAME=wp \
     -e WORDPRESS_DB_USER=wp \
     -e WORDPRESS_DB_PASSWORD=wp wordpress