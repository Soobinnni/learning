# from절에는 hub에 올라온 이미지 이름이거나, local에 있는 이미지 이름
FROM node

# cf. cd /app
# 워킹디렉토리 설정, 앞으로의 명령어 수행 공간 설정.
WORKDIR /app

# 이미지의 캐싱 메커니즘은 정확한 업데이트 수행을 위해 변경사항과 변경사항 후의 레이어를
# 다시 캐시하므로 해당 설계가 최적화라고 할 수 있다.
COPY package.json /app

# 이미지 빌드 시점에 한 번 실행.
RUN npm install

# 첫 번째 경로는 컨테이너의 외부(이미지의 외부 경로)로 로컬의 위치이며, dockerfile은 제외된다.
# 두 번째 경로는 컨테이너 내부의 위치
# (Host file system -> image/container file system)
# 상대경로: COPY . ./ (워킹디렉토리가 /app이므로 해당 경로는 상대경로인 /app과 같다)
COPY . /app

# 컨테이너가 수신할 포트를 명시
EXPOSE 80

# 이미지 빌드 후 한 번 실행되는 명령어.
CMD ["node", "server.js"]