# SesacTalk 배포하기

## [1] Docker로 Python과 Django 설치하기
`Dockerfile`

```Dockerfile
    FROM python:3.8.18-slim
    WORKDIR /app/src
    RUN pip install Django==2.0.7
    RUN django-admin startproject trydjango
    CMD ["python", "./trydjango/manage.py", "runserver", "0.0.0.0:8000"]
```