# WSGI
 WSGI is the Web Server Gateway Interface. It is a specification that describes how a web server communicates with web applications, and how web applications can be chained together to process one request.

<br>

> 개념
- `Web Server Gateway Interface`의 약자. 위스키라고 읽는다.
- WSGI는 Python 웹 애플리케이션과 <a href="#ws">웹 서버</a> 간의 표준 인터페이스 또는 프로토콜
- 즉 WSGI는 웹 애플리케이션과 웹 서버 사이의 상호 작용을 정의하고 조정하는 역할을 하여 통신을 단순화하고 표준화하여 Python으로 작성된 웹 애플리케이션이 다양한 웹 서버와 호환되도록 돕는 중요한 구성 요소.

<br>


> **WSGI 순서도**
  <img src = "https://wikidocs.net/images/page/75556/4-08_1.png" alt ="출처_https://wikidocs.net/75556" />

- [동적 페이지 요청 → 웹 서버 → WSGI 서버 → WSGI 애플리케이션]
  - 웹 브라우저의 정적 페이지 요청은 웹 서버가 처리하고, 웹서버에 동적 페이지 요청이 발생하면 `웹 서버는 WSGI 서버를 호출하고 WSGI 서버는 다시 WSGI 애플리케이션을 호출`한다. 
  - 실제 동적 페이지 요청은 결론적으로 WSGI 애플리케이션이 처리한다.


<br>



## WSGI 서버
- Python 웹 애플리케이션을 실행하는 데 사용되는 웹 서버의 한 유형으로 Web Server Gateway Interface (WSGI)를 준수.
- WSGI 서버는 웹 서버와 WSGI 애플리케이션 중간에 위치하면서 WSGI 애플리케이션과 상호작용하여 클라이언트의 웹 요청을 처리하고 애플리케이션의 응답을 반환. 따라서 WSGI 서버는 WSGI 미들웨어(middleware) 또는 WSGI 컨테이너(container)라고도 함.
- WSGI 서버는 다수의 클라이언트 요청을 동시에 처리할 수 있도록 다중 스레드 또는 다중 프로세스 방식으로 동작할 수 있음
- Gunicorn, uWSGI, mod_wsgi(Apache 웹 서버용 모듈), CherryPy 등이 대표적인 WSGI 서버.

<br>

  
> projects\mysite\config\wsgi.p

WSGI 서버는 항상 [파일명: projects\mysite\config\wsgi.py] 파일을 경유하여 장고(django) 프로그램을 호출

  ```python
    import os

    from django.core.wsgi import get_wsgi_application

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

    application = get_wsgi_application()
  ```
이 파일에 선언된 application이 바로 장고의 애플리케이션이며 이 파일은 장고 프로젝트 생성시 자동으로 만들어지며 특별한 경우가 아니고는 수정할 필요가 없음.

<br>

> 참고 : `장고의 내장서버`
  - python manager.py runserver 처럼 장고는 내장 서버로 구동 가능.
  - 장고의 내장 서버는 웹 서버와 WSGI 서버의 기능을 모두 포함하나 내장 서버는 기능이 단순하고 '대량 요청'이나 '동시 요청'을 효율적으로 처리하지 못하므로 운영 환경에는 적합하지 않음.

<br>

## WSGI 애플리케이션
- Web Server Gateway Interface(WGSI)를 준수하는 특별한 방식으로 작성된 Python 함수 또는 객체(Python 웹 애플리케이션의 구조)를 의미.
- WSGI 인터페이스를 준수하므로 다양한 서버와 호환 가능하며, 장고(Django), 플라스크(Flask) 등이 있다. 


<br><br>
---

> 참고
- [위키독스](https://wikidocs.net/75556)
- [How to deploy with WSGI](https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/) 
- [WSGI 공식 문서](https://wsgi.readthedocs.io/en/latest/what.html)
  
<br>

<span id = "si">**표준 인터페이스**<span>
- 서로 다른 시스템이나 구성 요소 간의 상호 작용을 정의하는 규칙 또는 규격
- 표준 인터페이스는 서로 다른 시스템 간의 통신을 가능하게 하며, 다양한 소프트웨어 구성 요소나 시스템이 상호 운용성을 유지할 수 있도록 한다.

<br>


<span id = "ws">**웹 서버(Web Server)**</span>
- 웹 브라우저의 정적 요청과 동적 요청을 처리하는 서버
- 대표 적인 웹 서버에는 아파치(Apache), 엔진엑스(Nginx) 등이 있다.
- 웹 서버에 정적 페이지 요청이 들어오면 정적 파일을 읽어 응답하면 되므로 간단하다.
- 웹 서버에 동적 페이지 요청이 들어오면 웹 서버는 파이썬 프로그램을 호출해야 한다
  - (ex - db조회 결과에 따라 동적인 응답 데이터를 반환...)
  - Nginx, Apache와 같은 서버들은 python으로 작성한 web application을 호출할 수 있는 기능이 대부분 없음. 따라서 WSGI 서버를 호출하게 됨. 