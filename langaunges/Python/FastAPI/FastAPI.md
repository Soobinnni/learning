[목록]
- <a href="#1">타입 힌팅</a>
- <a href="#2">Generic 타입</a>
- <a href="#3">async, await 문법</a>
- <a href="#4">FastAPI, uvicorn</a>
- <a href="#5">라우팅 함수</a>
- <a href="#6">경로 매개변수</a>
- <a href="#7">쿼리 매개변수</a>
- <a href="#8">요청 본문 매개 변수, Pydantic 모델</a>
- <a href="#9">Query, Path, Body 객체</a>
- <a href="#10">문자열 검증</a>
- <a href="#11">숫자값 검증</a>
- <a href="#12">메타 데이터 관련 속성</a>
- <a href="#13">Pydantic의 Field를 사용하여 모델 내에서 검증 및 메타데이터 선언</a>
- <a href="#14">쿠키 매개변수</a>
- <a href="#15">헤더 매개변수</a>
- <a href="#16">응답 모델(Response Model)</a>
- <a href="#17">모델 간 상속을 통한 코드 간소화</a>
- <a href="#18">응답 상태코드(HTTP status code)</a>
- <a href="#19">Form Data</a>
- <a href="#20">File Data</a>
- <a href="#21">File 및 Form 업로드</a>
- <a href="#22">오류 처리</a>
- <a href="#23">경로 작동 데코레이터의 속성들</a>
- <a href="#24">jsonable_encoder</a>
- <a href="#25">update와 exclude_unset, update parameter</a>
- <a href="#26">의존성(Dependency)</a>
- <a href="#27">Security - 세션 기반 인증과 토큰 기반 인증</a>
- <a href="#28">Security - OAuth2PasswordBearer</a>
- <a href="#29">Security - 현재 사용자 가져오기</a>
- <a href="#30">Security - 로그인 경로 함수 작성</a>
- <a href="#31">Security - 인증 로직 상세</a>
- <a href="#32">Security - JWT를 통한 토큰 발급</a>
- <a href="#33">Middleware</a>
- <a href="#34">CORS</a>
- <a href="#35">SQL (Relational) Databases</a>
- <a href="#36">파일 구조</a>
- <a href="#37">백그라운드 작업</a>
- <a href="#38">정적 파일</a>
- <a href="#39">test code</a>
- <a href="#40">Debugging</a>

<h1 id = "1">타입 힌팅</h1>

> def example(ex: int, p: People)
- 위 예시처럼 ex 매개변수의 타입이 int임을 힌팅하거나, p의 타입이 People처럼 사용자 정의 클래스 타입임을 힌팅할 수 있다.

<h1 id = "2">Generic 타입</h1>

- from typing
- import List, Tuple, Set, Dict, Optional, Union
- 파이썬은 데이터 구조의 내부타입을 선언하기 위해 위와 같은 모듈을 사용한다.
> ```python
>   from typing import List, Set, Tuple, Dict, Optional, Union, Annotated
>   from fastapi import Cookie
> 
>   # ================================================================================================
>   def ex_1(a: List[int]): pass # a는 list며, list 내부의 타입은 int다.
> 
>   def ex_2(b: Set[bytes]): pass # b는 set이며, set 내부의 타입은 bytes다.
> 
>   def ex_3(c: Tuple[int, int, str]): pass # c는 tuple이며, tuple 내부의 타입은 int, int, str 순이다.
> 
>   def ex_4(d: Dict[str, int]): pass # d는 dict며, dict 내부의 타입은 key는 string, value는 int다.
> 
>   def ex_5(e: Union[str, int]): pass # Union은 e의 타입이 str 또는 int라는 것을 알려주는 힌팅객체다.
> 
>   def ex_(f: Optional[str]): pass # Optional은 f의 타입이 str 또는 None라는 것을 알려주는 힌팅객체다 
>                                   # 따라서 Optional[str]은 Union[str, None]과 같은 의미다.
> 
>   def ex_(g: Annotated[str|None, Cookie()]=None): pass # Annotated는 첫 번째 인자는 타입, 두 번째 인자는 주석을 의미.
>                                                        # str|None가 의미하는 것은 g가 Union타입이라는 것을 의미하고,
>                                                        # Cookie는 g가 Cookie 매개변수라는 것을 의미.
>   # ================================================================================================
> ```

## Union
- 두 매개 변수 중 하나의 타입이라는 힌트를 제공하는 데 사용
- `process_after: Union[Item | User]`: Pydantic 객체인 Item 또는 Pydantic 객체인 User 중 하나 객체 타입이다.

## Annotated
- Annotated: 타입 힌트에 추가적인 정보를 제공하는 데 사용
- 예시 `process_after: Annotated[timedelta | None, Body()] = None`
  - [timedelta | None, Body()]
      1. `timedelta | None`: Union으로써, process_after가 timedelta 혹은 None이 될 수 있음을 의미
      2. Body(): process_after가 request body의 매개변수임을 나타냄(즉, 이 매개변수는 클라이언트에서 전송된 데이터에 의해 설정)
      3. = None: process_after의 기본값이 None임을 나타냄
- 두 번째 인자에 똑같이 검증 또는 메타 데이터 선언 가능
`process_after: Annotated[timedelta | None, Query(default=None, min_length=2, max_length=50) ] = None`

<h1 id = "3">async, await 문법</h1>

- 형태: `async def a():` ... `await`
- async가 선언된 함수 내부에서만 await키워드를 사용할 수 있다.
- 라우팅 함수에서 사용한다.
- 라우팅 함수에서 필요에 따라 def와 async def를 혼용하여 사용한다.
- 사용
  - await을 함수 내부에서 사용
    ```python
        async def a():
            await 'db조회, 이메일 전송 등'
    ```
  - 데이터베이스, API, 파일시스템 등과 상호작용하는 third party 라이브러리 사용할 때
    ```python
        async def results():
            result = await some_library()
            return result
    ```
    
<h1 id = "4">FastAPI, Uvicorn</h1>

## FastAPI와 Starlette
- FastAPI는 Starlette를 직접 상속하는 클래스이기 때문에 Starlette의 기능을 모두 사용할 수 있다.

## FastAPI객체
- 모든 API를 생성하기 위한 주요 객체
    ```python
        from fastapi import FastAPI
  
        app = FastAPI()
  
        @app.get("/")
        def index(): pass
    ```

## Uvicorn
- 파이썬으로 작성된 빠르고 가벼운 ASGI(Asynchronous Server Gateway Interface) 웹 서버
- 비동기 웹 어플리케이션 ASGI 서버
- `uvicorn main:app --reload`에서 `main`은 main.py모듈 즉 main파일을 의미하고 `app`은 main.py의 FastAPI객체(app=FastAPI)의 
    변수명을 의미한다(만일 my_app=FastAPI()와 같이 작성되었다면 명령어는 `uvicorn main:my_app --reload`). `--reload`옵션은 코드
    변경 시 재시작 옵션이므로 개발 시에만 사용한다.


<h1 id = "5">라우팅 함수</h1>

1. 매개변수: 쿼리 매개변수, 경로 매개변수, 본문 매개변수
2. 힌팅 가능한 데이터 타입: 
  - int, str, float, bool, UUID, datetime.datetime, datetime.date, datetime.time, datetime.timedelta, frozenset, bytes,
    Decimal 
    ```python
    from datetime import datetime, time, timedelta
    from typing import Annotated
    from uuid import UUID
    ...
    
    @app.put("/items/{item_id}")
    async def read_items(
        item_id: UUID,
        start_datetime: Annotated[datetime | None, Body()] = None,
        end_datetime: Annotated[datetime | None, Body()] = None,
        repeat_at: Annotated[time | None, Body()] = None,
        process_after: Annotated[timedelta | None, Body()] = None,
    ): ...
    ```
3. 반환가능 데이터: dict, list, 단일 값을 가진 str, int, Pydantic 객체
4. 순서
    - 만약,
      `/user/me`를 처리하는 a 라우팅 함수와
      `/user/{id:int}`를 처리하는 b 라우팅 함수가 있을 때
      a 요청을 하고 싶다면, b를 먼저 작성하면 안 된다(타입 불일치 오류 발생. 라우팅 함수를 순서대로 확인하므로). 작성 순서가 b->a일 경우
      me를 str로 인식하고 id의 힌팅인 int와 맞지 않다고 판단하여 오류가 생긴다.
5. Enum 클래스
    - 경로 매개변수 값을 미리 정의
    - 주요 모듈: enum.Enum
    - Enum을 import하고 str, Enum을 상속하는 사용자 정의 클래스 생성
  ```python
    from enum import Enum
    
    class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"
    
    @app.get("/models/{model_name}")
    async def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
    return {"model_name": model_name, "message": "Deep Learning FTW!"}
  ```

<h1 id = "6">경로 매개변수</h1>

- 경로 변수 값이 라우팅 함수 매개변수명이 같은 매개변수에 전달되어 그 값을 인자로 활용
- ex: http://주소:포트/item/2
    ```python
      @app.get("/item/{count}/")
      def item_count(count:int): pass
    ```
    경로 변수의 타입을 int로 지정하였기 대문에 타입 선언 시 FastAPI가 자동으로 파싱. int 타입이 아닐 경우 오류 발생
- 참고: 파이썬 문법 == 기본값을 설정한 매개변수와 없는 매개변수 중 우선하여 작성해야할 것은 없는 매개변수
  - `(q: str, p:int=1)` 가능 하지만 `(p:int=1, q: str)` 잘못된 작성. 
  - 따라서 다음과 같이 작성해야함`async def read_items(q: str, item_id: int = Path(title="The ID of the item to get")):`
  - 순서를 바꾸고 싶다면? `*` 키워드가 가능하게 함
    - `async def read_items(*, item_id: int = Path(title="The ID of the item to get"), q: str)`

<h1 id = "7">쿼리 매개변수</h1>

- 쿼리 매개변수는 일부는 필수로, 다른 일부는 기본값을, 또는 선택적으로 선언할 수 있다.
1. 기본 값이 있는 쿼리 매개 변수
    ```python
        @app.get("/a")
        def a(skip:int=0, limit:str=0)
    ```
2. 필수적인 쿼리 매개 변수: needed는 str형인 필수 쿼리 매개변수로, 필수로 만들기 위해선 단순히 기본값(=)을 선언하지 않으면 됨
    ```python
        @app.get("/a")
        def b(needed:str)
    ```
3. 선택적인 쿼리 매개 변수
    ```python
        @app.get("/a")
        def c(skip:Union[int, None]=None, limit:Union[str, None]=None)
    ```

- 쿼리 매개변수로 리스트 또는 다중 값 받기
  - list 자료형으로 쿼리 매개변수를 선언하려면 Query를 명시적으로 선언해야 한다. (그렇지 않으면 FastAPI가 요청 본문으로 해석)
  - (ex) `?q=foo&q=bar`
    ```python
    def read_items(q:Union[list, None]=Query(None)):
        print(q) # ['foo', 'bar']
    ```

<h1 id = "8">요청 본문 매개 변수, Pydantic 모델</h1>

## 요청 본문 매개 변수
- 클라이언트에서 API로 보내지는 데이터(<-> 응답 본문: API가 클라이언트로 보내는 데이터)
- 요청 본문 선언은 Pydantic 모델 사용(Get요청엔 본문을 담는 것을 권장하지 않는다.)

## Pydantic 객체
- 모듈: `pydantic.BaseModel`

## 힌팅으로 모델 스키마의 모양을 선언할 수 있다.
  - int, str, float, bool, UUID, datetime.datetime, datetime.date, datetime.time, datetime.timedelta, frozenset, bytes,
    Decimal
  ```python
  from pydantic import BaseModel

  """
  쿼리 매개 변수와 마찬가지로 필수와 선택을 다음과 같이 선언 가능하다.
  """
  class Item(BaseModel):
      name:str # 필수(기본값 없음)
      description:str|None = None# 선택: None을 이용하여 선택적으로 만듦)
      count:int=1 # 기본값이 1로, create시 count값을 전달하지 않아도 기본값으로 1로 생성.
  ```
- 필요한 경우 적당한 타입으로 변환시켜 데이터가 포함된 객체를 반환한다.

## 참고, Pydantic 모델 생성하기, `model_dump` 함수(.dict())
- Pydantic 모델 생성
    ```python
    item = Item(name="icecream", description="sweet", count=3)
    ```
- 객체를 dictionary 형태로 만들기: Pydantic v1과의 호환성을 위해 .dict()를 사용하지만, 
  Pydantic v2를 사용할 수 있다면 대신 .model_dump()를 사용한다.
    ```python
    item_dict = item.model_dump()
    # item_dict = item.dict()
  
    print(item_dict) # {"name"="icecream", "description"="sweet", "count"=3}
    ```
- 위 두 예제를 이용하여 Pydantic 모델 생성하기
    ```python
    UserInDB(
        username = user_dict["username"],
        password = user_dict["password"],
        email = user_dict["email"],
        full_name = user_dict["full_name"],
    ) 
    ```
    또는 언팩킹 연산자 ** 활용
    ```python
    print(Item(**item_dict)) # Item(name="icecream", description="sweet", count=3)
    ```


### List, Set 등을 Field로 설정하기
- 타입 매개변수를 설정하지 않을 때
```python
class Item(BaseModel):
    tags: list = []
```
- 타입 매개변수가 있는 리스트 필드
```python
class Item(BaseModel):
    tags: List[str] = []
```
- 타입 매개변수가 있는 Set 필드
```python
class Item(BaseModel):
    tags: Set[str] = set()
```

### 중첩 모델
- 각 어트리뷰트가 정의된 Pydantic 모델은 해당 타입 자체로 또다른 Pydantic 모델의 타입이 될 수 있다.
- 즉 특정한 어트리뷰트의 이름, 타입, 검증을 사용하여 깊게 중첩된 JSON "객체"를 선언할 수 있다.
1. 서브 모델 정의
```python
class Image(BaseModel):
    url: str
    name: str
```
2. 서브 모델을 어트리뷰트로 정의
```python
class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None
    tags: Set[str] = set()
    image: Union[Image, None] = None
```
3. 
```python
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item): pass
```
에서 요구되는 본문 요청
```json
{
    "name": "Foo",
    "description": "The pretender",
    "price": 42.0,
    "tax": 3.2,
    "tags": ["rock", "metal", "bar"],
    "image": {
        "url": "http://example.com/baz.jpg",
        "name": "The Foo live"
    }
}
```

### HttpUrl, EmailStr 등 특별한 타입의 검증
- EmailStr: pip install 'pydantic[email]' 필요
```python
from pydantic import BaseModel, HttpUrl
from pydantic.networks import EmailStr

class Image(BaseModel):
    url: HttpUrl
    email: EmailStr = None
```

### 서브모델 리스트를 갖는 어트리뷰트
- 코드
    ```python
    from typing import List, Set, Union
    from pydantic import BaseModel, HttpUrl
    
    class Image(BaseModel):
        url: HttpUrl
        name: str
        
    class Item(BaseModel):
        ...
        images: Union[List[Image], None] = None
    ```
- 예상되는 JSON 본문
    ```json
    {
        "images": [
            {
                "url": "http://example.com/baz.jpg",
                "name": "The Foo live"
            },
            {
                "url": "http://example.com/dave.jpg",
                "name": "The Baz"
            }
        ]
    }
    ```
  
### 깊게 중첩된 모델 예시
```python
from typing import List, Union
from pydantic import BaseModel, HttpUrl

class Image(BaseModel):
    url: HttpUrl
    name: str

class Item(BaseModel):
    ...
    images: Union[List[Image], None] = None


class Offer(BaseModel):
    ...
    items: List[Item]

@app.post("/offers/")
async def create_offer(offer: Offer):
    return offer
```

### 라우팅 함수에서 List 타입 매개 변수로 Pydantic 모델객체 사용
`async def create_multiple_images(images: List[Image]):`

---

### dict를 요청 본문 매개변수로 사용(임의 응답 시 사용)
- When: Pydantic처럼 미리 정의되어 있는 Request Body를 받는 것이 아니라, 필드와 어트리뷰트 이름을 모를 때(아직 모르는 키를 받을 때)
    ```python
    from typing import Dict
    
    ...
    
    @app.post("/index-weights/")
    async def create_index_weights(weights: Dict[int, float]):
        return weights 
    ```
- JSON은 오직 str형 키만 지원하지만, Pydantic은 자동으로 데이터를 변환시켜 weights로 받은 dict는 실제로 int 키와 float 값을 가진다.

---

## Pydantic BaseModel을 라우팅 함수의 요청 본문 매개변수로 선언
- 동작
  1. 요청의 본문을 JSON으로 읽는다.
  2. (필요하다면) 대응되는 타입으로 변환한다.
  3. 데이터 검증
  4. 매개변수 Item에 대한 수신 데이터 제공
  5. 모델의 JSON 스키마 제공
```python
from pydantic import BaseModel

@app.post("/items/")
async def create_item(item: Item): # ⓐ: create_item함수의 요청본문매개변수(다른 변수 제외) 하나일 경우
    return item

@app.post("/items-users/")
async def create_item_user(item: Item, user:User): # ⓑ: create_item_user함수의 요청본문매개변수가 둘 이상일 경우
    return item
```
- ⓐ의 요청 본문: 단일이기 때문에 모델의 프로퍼티 키, 값만 전달됨(단일도 모델명을 key로, 프로퍼티 키와 값을 value로 받고 싶다면 Body(embed=True) 속성 이용)
  ```json
  {
    'name' : 'kim',
    'description' : 'abc',
  }
  ```
- ⓑ의 요청 본문: 둘 이상이기 때문에 모델명을 key로 하여 각각의 프로퍼티의 키와 값이 value로 전달
  ```json
  {
    'item': 
            {
              'name' : 'kim',
              'description' : 'abc',
            },
    'user': 
            {
              'name' : 'kim',
              'description' : 'abc',
            },
  }
  ```
### Pydantic BaseModel 사용하기
```python
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

@app.post("/items/")
async def create_item(item: Item):
    return item.price + item.tax # 모델 객체의 어트리뷰트로 접근할 수 있다.
```


<h1 id = "9">Query, Path, Body, Cookie 객체</h1>

- 모듈: `from fastapi import Query, Path, Body, Cookie, Header`
- 각각의 객체는 쿼리 매개 변수, 경로 매개 변수, 요청 본문 매개 변수, 쿠키, 헤더와 관련 있다.
- 각각의 객체는 각 매개 변수에 유효성을 더하거나, 메타 데이터를 추가 하는 등의 속성을 설정할 수 있게 기능을 제공한다.
- 유효성 관련: `min_legth`, `max_length`, `lt,` `gt`, `le`, `ge` 등
- 메타 데이터 관련: `title`, `description`, `alias`, `deprecated` 등 

## 매개변수를 선택적으로 만들기
- 참고: 경로 매개변수는 경로에 포함된 것이기 때문에 None값이 허용되지 않기 때문에 아래의 문법을 사용하여 기본값을 None으로 두더라도 무시하며 언제나 필수인 매개변수다.
- `(count:Union[int, None]=None)`
- `(count:Optional[int]=None)`
- `(count:Union[int, None]=Query(default=None))`
- `(count:Union[int, None]=Query(None))`
- `(count:Optional[int]=Query(default=None))`
- `(count:Optional[int]=Query(None))`

## 매개 변수를 필수적으로 만들기
- None을 첫 번째 인자로 두지 않으면 된다.
- `(count:Union[str, None]=Query(max_length=2))`

## Query와 관련된 속성
### 쿼리 매개변수로 리스트 또는 다중 값 받기
  - list 자료형으로 쿼리 매개변수를 선언하려면 Query를 명시적으로 선언해야 한다. (그렇지 않으면 FastAPI가 요청 본문으로 해석)
  - (ex) `?q=foo&q=bar`
    ```python
    def read_items(q:Union[list, None]=Query(None)):
        print(q) # ['foo', 'bar']
    ```
### deprecated
- 해당 매개변수를 사용하는 클라이언트가 있을 수도 있으므로 한 동안 두어야하지만, 사용하지 않는다고 OpenAPI에 표현하고 싶을 때
- `async def read_items(q: Union[str, None] = Query(deprecated=True)`

## Body와 관련된 속성
### 단일 response body의 내용 가져오기
- Body객체를 사용한다.
- Pydantic 객체 사용 없이 그냥 매개변수로 두면 FastAPI는 해당 변수를 본문에 담긴 단일 값이 아닌 
  쿼리 매개변수로 인식하므로(기본적으로 단일값은 쿼리매개변수) Body를 통해 단일 요청 매개변수임을 명시해야한다.
- `async def update_item(item_id: int, item: Item, user: User, importance: int = Body()):`
- 실제 요청 본문
  ```json
      {
        "item": {
            "name": "Foo",
            "description": "The pretender",
            "price": 42.0,
            "tax": 3.2
        },
        "user": {
            "username": "dave",
            "full_name": "Dave Grohl"
        },
        "importance": 5
    }
    ```
### embed 
- 단일 본문 매개변수 key, value로 받기
- 이 경우는 라우팅 함수가 Pydantic 모델 본문 매개변수로 오직 한개만 갖고있다고 가정했을 때 
  ```python
    @app.put("/items/{item_id}")
    async def update_item(item_id: int, item: Item = Body()): pass
  ```
  위의 상황에서 예상되는 요청 본문은
  ```json
  {
    "name": "Foo",
    "description": "The pretender",
    "price": 42.0,
    "tax": 3.2
    }
  ```
  이지만 이를 item키를 가진 JSON으로 예측하길 원한다면, Body의 속성을 embed=True로 설정하면 원하는 결과를 얻을 수 있다.
  ```python
    @app.put("/items/{item_id}")
    async def update_item(item_id: int, item: Item = Body(embed=True)): pass
  ```
  결과
  ```json
  {
    "item": {
        "name": "Foo",
        "description": "The pretender",
        "price": 42.0,
        "tax": 3.2
    }
  }
  ```

<h1 id = "10">문자열 검증</h1>

## max_length, min_length
- `def read_items(q: Union[str, None] = Query(default=None, min_length=2, max_length=50)):`
- `def read_items(q: Union[str, None] = Query(None, min_length=2, max_length=50)):`

## pattern
- 문자열 정규식 검사에 사용
```python
def read_items(q: Union[str, None] = Query(
        default=None, min_length=3, max_length=50, pattern="^fixedquery$"
    ),`
```

<h1 id = "11">숫자값 검증</h1>

- `ge`: `g`reater than or `e`qual | 보다 크거나 같음
- `le`: `l`ess than or `e`qual | 보다 작거나 같음
- `gt`: `g`reater `t`han | 보다 큼(초과)
- `lt`: `l`ess `t`han | 보다 작음(미만)
- 예시
  - `async def read_items(item_id: int = Path(ge=1)):`
  - `async def read_items(item_id: int = Path(gt=0, le=1000)):`
  - `async def read_items(size: float = Query(gt=0, lt=10.5)):`

<h1 id = "12">메타 데이터 관련 속성</h1>

## title, description
- OpenAPI 문서에 해당 쿼리 매개변수에 대한 title과 description을 추가하여 매개 변수에 대한 정보를 제공할 수 있다.

## alias
- 매개변수에 별칭을 매긴다.
- 예를 들면, `item-count`는 파이썬의 변수명 규칙에 부합하지 않는다. 그런데 이를 요청 시 쿼리 매개변수명으로 사용하고자 한다면,
  (http://.../items/?item-query=foobaritems) -> `async def read_items(q: Union[str, None] = Query(default=None, alias="item-query")):`
  처럼 선언하여, 해당 별칭은 매개변수 값을 찾는 데 사용할 수 있다.



<h1 id = "13">Pydantic의 Field를 사용하여 모델 내에서 검증 및 메타데이터 선언</h1>

- Query, Path, Body의 속성을 이용하여 검증 및 메타데이터를 선언했듯이, Pydantic의 Field 내에서 선언 가능
- 모듈: `pydantic.Field`
    ```python
    from pydantic import BaseModel, Field
    class Item(BaseModel):
        name: str
        description: str | None = Field(
            default=None, title="The description of the item", max_length=300
        )
        price: float = Field(gt=0, description="The price must be greater than zero")
        tax: float | None = None
    ``` 


<h1 id = "14">쿠키 매개변수</h1>

- 모듈: fastapi.Cookie
- 쿠키를 선언하기 위해서 Cookie를 사용해야 하며, 그렇지 않으면 해당 매개변수를 쿼리 매개변수로 해석.
```python
from typing import Annotated

from fastapi import Cookie
...
@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

<h1 id = "15">헤더 매개변수</h1>

- 모듈: fastapi.Header
- 헤더를 선언하기 위해서 Header를 사용해야 하며, 그렇지 않으면 해당 매개변수를 쿼리 매개변수로 해석.

<br>

## `convert_underscores` 속성
- 대부분의 표준 헤더는 "마이너스 기호" (-)라고도 하는 "하이픈" 문자로 구분되지만, 파이썬의 표준 변수명은 하이픈 사용이 안 됨.
- 따라서 Header는 기본적으로 매개변수 이름을 언더스코어(_)에서 하이픈(-)으로 변환하여 헤더를 추출하고 기록한다.
  - 만약 언더스코어를 하이픈으로 자동 변환을 비활성화해야 한다면, Header의 convert_underscores 매개변수를 False로 설정한다.
- HTTP 헤더는 대소문자를 구분하지 않으므로 "snake_case"로 알려진 표준 파이썬 스타일로 선언할 수 있다.

```python
from typing import Union
from fastapi import FastAPI, Header
...
@app.get("/items/")
async def read_items(user_agent: Union[str, None] = Header(default=None, convert_underscores=False)):
    return {"User-Agent": user_agent} 
```

<br>

## 중복 헤더
- 다음과 같은 두 개의 HTTP 헤더를 전송하여 해당 경로 와 통신할 경우 
    ```
    X-Token: foo
    X-Token: bar
    ```
- 타입 정의에서 리스트를 사용하여 이러한 케이스를 정의할 수 있다(중복 헤더의 모든 값을 파이썬 list로 수신).
    ```python
     from typing import List, Union
     from fastapi import FastAPI, Header

     @app.get("/items/")
     async def read_items(x_token: Union[List[str], None] = Header(default=None)):
        return {"X-Token values": x_token} 
    ```
- 그에 따른 응답
    ```json
     {
        "X-Token values": [
            "bar",
            "foo"
        ]
    }
    ```
  
<h1 id = "16">응답 모델(Response Model)</h1>

- 매개변수 `response_model`를 사용하여 응답을 위한 모델을 선언
- 예시: 
  - `@app.post("/items/", response_model=Item)`
  - `@app.get("/items/", response_model=List[Item])`

## response_model
- 출력 데이터를 타입 선언으로 변환.
- 데이터 검증.
- OpenAPI 경로 작동의 응답에 JSON 스키마 추가.
- 자동 생성 문서 시스템에 사용.

## 출력 모델 추가
```python
from typing import Any, Union

from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

# 입력 모델(create)
class UserIn(BaseModel):
    username: str
    password: str
    email: EmailStr
    full_name: Union[str, None] = None

# 출력 모델(read): 비밀번호가 빠짐(주요 정보이므로)
class UserOut(BaseModel):
    username: str
    email: EmailStr
    full_name: Union[str, None] = None

@app.post("/user/", response_model=UserOut)
async def create_user(user: UserIn) -> Any:
    return user
```
- `@app.post("/user/", response_model=UserOut)`이 아니라 `@app.post("/user/")`였다면 response data로 password가 포함된
   user가 반환되었겠지만, resopnse_model을 UserOut으로 선언해둠으로써, 민감한 정보인 password가 제외된 필드 값을 가진 user가 반환!


## 응답 모델에 기본값 설정
```python
...
class Item(BaseModel):
    name: str
    description: Union[str, None] = None
    price: float
    tax: float = 10.5
    tags: List[str] = []

items = {
    "foo": {"name": "Foo", "price": 50.2},
    "bar": {"name": "Bar", "description": "The bartenders", "price": 62, "tax": 20.2},
    "baz": {"name": "Baz", "description": None, "price": 50.2, "tax": 10.5, "tags": []},
}

@app.get("/items/{item_id}", response_model=Item)
async def read_item(item_id: str):
    return items[item_id]
```
- 만일 items['foo']라면, return값은 없는 description, tax, tags에 대해 각각 기본값을 채워 반환할 것
```json
{
  "foo": {
    "name": "Foo",
    'description': None,
    "price": 50.2
    'tax': 10.5,
    'tags': [],
  }
}
```

### `response_model_exclude_unset`
- 만일, 기본값을 제외하고 보내고 싶다면, 위 속성을 이용(명시적으로 설정된 값만 반환)
- `@app.get("/items/{item_id}", response_model=Item, response_model_exclude_unset=True)`
- True로 선언함으로써 기본값은 응답에 포함되지 않고 실제로 설정된 값만 포함된다(모델의 필드가 기본값이 있어도 ID가 bar인 항목(items)처럼 
  데이터가 값을 갖는다면 값 설정된 필드를 포함).
    ```json
    {
      "name": "Foo",
      "price": 50.2
    }   
    ```

### `response_model_include` 및 `response_model_exclude`
- Pydantic 모델이 하나만 있고 출력에서 일부 데이터를 제거하려는 경우, 포함(나머지 생략)하거나 제외(나머지 포함) 할 어트리뷰트의 이름과 str의
    set을 받아 효율적으로 처리한다.
```python
# == set(["name", "description"])
# == ["name", "description"]
@app.get("/items/{item_id}/name", response_model=Item, response_model_include={"name", "description"})
...

@app.get("/items/{item_id}/public", response_model=Item, response_model_exclude={"tax"})
...
```

<h1 id = "17">모델 간 상속을 통한 코드 간소화</h1>

- UserBase를 생성하고, 달라지는 password만 UserBase 상속 후 재 정의
    ```python
    class UserBase(BaseModel):
        username: str
        email: EmailStr
        full_name: str | None = None
        
    class UserIn(UserBase):
        password: str
    
    class UserOut(UserBase):
        pass
    
    class UserInDB(UserBase):
        hashed_password: str
    ```
- UserIn, UserInDB, UserOut 활용
    ```python
    def fake_password_hasher(raw_password: str):
        """
            암호화 함수
        """
        return "supersecret" + raw_password
    
    
    def fake_save_user(user_in: UserIn):
        """
            입력 스키마인(request body에 담겨온) UserIn을 인자로 받고,
            비밀번호 암호화 후, DB에 create하기 위한 스키마 UserInDB에 인자로 전달
  
            param user_in: UserIn
            return: UserInDB
        """
        hashed_password = fake_password_hasher(user_in.password)
        # user_in_db = UserInDB(**user_in.dict(), hashed_password=hashed_password)
        user_in_db = UserInDB(**user_in.model_dump(), hashed_password=hashed_password)
        return user_in_db
    
    @app.post("/user/", response_model=UserOut)
    async def create_user(user_in: UserIn):
        """
            입력 스키마인(request body에 담겨온) UserIn을 인자를 fake_save_user의 인자로 전달,
            password를 hash한 UserInDB 를 fake_save_user함수로 반환받고,
            그 중 UserOut에 해당하는 Field만 response 데이터로 반환
  
            param user_in: UserIn
            return: UserOut
        """
        user_saved = fake_save_user(user_in)
        return user_saved
    ```



<h1 id = "18">응답 상태코드(HTTP status code)</h1>

- `status_code` 매개변수를 사용하여 응답에 대한 HTTP 상태 코드를 선언할 수 있다.
- status_code는 직접 상태코드 int값을 받거나 다음과 같은 모듈의 IntEnum을 입력받을 수도 있다.
- 모듈 `http.HTTPStatus` 
- 모듈 `fastapi.status`
- 모듈 `starlette.status`
- 예시: 
  - `@app.post("/items/", status_code=201)`
  - `@app.post("/items/", status_code=HTTPStatus.CREATED)`
  - `@app.post("/items/", status_code=status.HTTP_201_CREATED)` 
  - `@app.post("/items/", status_code=status.HTTP_201_CREATED)` 

<h1 id = "19">Form Data</h1>

- 설치 `pip install python-multipart`
- 모듈 `fastapi.Form`
- JSON 대신 양식 필드를 받아야 하는 경우 사용한다.
- 예시 코드: <form></form>에 username과 password가 입력 양식으로 존재할 때
    ```python
    from fastapi import Form
  
    @app.post("/login/")
    async def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
        return {"username": username} 
    ```



<h1 id = "20">File Data</h1>

- 모듈 `fastapi.File`, `fastapi.UploadFile`: File 은 Form 으로부터 직접 상속된 클래스
- File의 본문을 선언할 때, 매개변수가 쿼리 매개변수 또는 본문(JSON) 매개변수로 해석되는 것을 방지하기 위해 File 을 사용해야 한다.

1. File 객체 이용
    ```python
    from fastapi import File
    
    @app.post("/files/")
    async def create_file(file: bytes = File()):
        return {"file_size": len(file)}
    ```
  - 파일들은 "폼 데이터"의 형태로 업로드
  - 경로 작동 함수의 매개변수를 `bytes` 로 선언하는 경우 FastAPI는 파일을 읽고 bytes 형태의 내용을 전달
  - 이는 작은 크기의 파일들에 적합
    
2. UploadFile 객체 이용
    ```python
    from fastapi import UploadFile
    
    @app.post("/uploadfile/")
    async def create_upload_file(file: UploadFile):
        return {"filename": file.filename} 
    ```
   - UploadFile 을 사용하는 것은 bytes 과 비교해 다음과 같은 장점
   - "spooled" 파일을 사용: 최대 크기 제한까지만 메모리에 저장되며, 이를 초과하는 경우 디스크에 저장
   - 따라서 이미지, 동영상, 큰 이진코드와 같은 대용량 파일들을 많은 메모리를 소모하지 않고 처리하기에 적합
   - 업로드 된 파일의 메타데이터를 얻을 수 있다.
   - file-like async 인터페이스를 갖고 있다.
   - file-like object를 필요로하는 다른 라이브러리에 직접적으로 전달할 수 있는 파이썬 SpooledTemporaryFile 객체를 반환

## UploadFile
### UploadFile의 어트리뷰트
- filename : str, 파일명 (예: myimage.jpg).
- content_type : str, 파일 형식(MIME type / media type) (예: image/jpeg).
- file : SpooledTemporaryFile (파일류 객체). "파일류" 객체를 필요로하는 다른 라이브러리에 직접적으로 전달할 수 있는 실질적인 파이썬 파일.

### UploadFile의 async 메소드들
- 내부적인 SpooledTemporaryFile(UploadFile.file를 통해)을 사용하여 아래 파일 메소드를 호출.
- 아래 모든 메소드들은 비동기 메소드이므로 호출 시 반드시 `await`키워드와 함께 사용
  - FastAPI는 스레드풀에서 파일 메소드들을 실행하고 기다림.
- write(data): data(str 또는 bytes)를 파일에 작성.
- read(size): 파일의 바이트 및 글자의 size(int)를 읽음.
- seek(offset): 파일 내 offset(int) 위치의 바이트로 이동
  - (예) await myfile.seek(0) 를 사용하면 파일의 시작부분으로 이동.
  - await myfile.read() 를 사용한 후 내용을 다시 읽을 때 유용. 
- close(): 파일을 닫음.

## 다중 File 받기
- List의 타입 매개변수로 bytes 또는 UploadFile 선언하여 for문으로 file들을 사용한다.
- form
    ```html
    <body>
    <form action="/files/" enctype="multipart/form-data" method="post">
    <input name="files" type="file" multiple>
    <input type="submit">
    </form>
    <form action="/uploadfiles/" enctype="multipart/form-data" method="post">
    <input name="files" type="file" multiple>
    <input type="submit">
    </form>
    </body> 
    ```
- python
    ```python
    @app.post("/files/")
    async def create_files(files: List[bytes] = File()):
        return {"file_sizes": [len(file) for file in files]}
    
    @app.post("/uploadfiles/")
    async def create_upload_files(files: List[UploadFile]):
        return {"filenames": [file.filename for file in files]}
    
    ```

<h1 id = "21">File 및 Form 업로드</h1>

- 하나의 요청으로 데이터와 파일들을 받아야 할 경우 File과 Form을 함께 사용
- 주의: 다수의 File과 Form 매개변수를 한 경로 작동에 선언하는 것이 가능하지만, 요청의 본문이 application/json가 아닌 multipart/form-data로 인코딩 되기 때문에 JSON으로 받아야하는 Body 필드를 함께 선언할 수는 없다.
- 예시 코드
    ```python
    from fastapi import File, Form, UploadFile
    
    @app.post("/files/")
    async def create_file(
        file: bytes = File(), fileb: UploadFile = File(), token: str = Form()
    ): pass
    ```


<h1 id = "22">오류 처리</h1>

## HTTPException
- 모듈 `fastapi.HTTPException`
- 오류가 있는 HTTP 응답을 클라이언트에 반환하기 위해 사용
- 이는, Python 예외이기 때문에 `raise`키워드와 함께 사용하며 return값이 없는 것이 특징.
  (해당 요청을 즉시 종료하고 HTTP 오류를 클라이언트로 보냄)
- 코드
    ```python
    from fastapi import HTTPException
    
    @app.get("/items/{item_id}")
    async def read_item(item_id: str):
        if item_id not in items:
            raise HTTPException(
                status_code=404,
                detail="Item not found",
                headers={"X-Error": "There goes my error"},
            )
        return {"item": items[item_id]} 
    ```
  응답
    ```json
    {
        "detail": "Item not found"
    }
    ```

## 사용자 정의 예외 처리기
- `exception_handler` 데코레이터 사용
- 형식: `@app.exception_handler()`, 인자로 사용자 정의 예외 처리를 전달
- 코드
    ```python
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    
    
    class UnicornException(Exception):
        def __init__(self, name: str):
            self.name = name
    
    
    app = FastAPI()
    
    
    @app.exception_handler(UnicornException)
    async def unicorn_exception_handler(request: Request, exc: UnicornException):
        return JSONResponse(
            status_code=418,
            content={"message": f"Oops! {exc.name} did something. There goes a rainbow..."},
        )
    
    
    @app.get("/unicorns/{name}")
    async def read_unicorn(name: str):
        if name == "yolo":
            raise UnicornException(name=name)
        return {"unicorn_name": name} 
    ``` 
  
## `RequestValidationError`: Override request validation exceptions
- 모듈 `fastapi.exceptions.RequestValidationError`
- 요청이 유효하지 않은 데이터를 포함하였을 때 FastAPI는 내부적으로 `RequestValidationError`를 발생시킨다.
- `RequestValidationError`를 오버라이드하기 위해선 `RequestValidationError`와 `@app.exception_handler(RequestValidationError)`를 이용해 핸들러를 작성한다. 
- 코드
    - 경로변수에서  
    ```python
    from fastapi.exceptions import RequestValidationError
    from fastapi.responses import PlainTextResponse
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc):
        return PlainTextResponse(str(exc), status_code=400)
    
    
    @app.get("/items/{item_id}")
    async def read_item(item_id: int): ...
    ```
  - 경로 변수 `item_id`가 int값이 아닌 타입이 들어왔을 경우(/itmes/foo처럼) FastAPI 내부적으로 RequestValidationError가 발생하고,
    validation_exception_handler가 호출되어 기본 JSON error가 반환된다.
  ```json
  {
    "detail": [
        {
            "loc": [
                "path",
                "item_id"
            ],
            "msg": "value is not a valid integer",
            "type": "type_error.integer"
          }
      ]
    }
  ```
  - request body에서 보낸 값이 Pydantic 모델의 유효성과 맞지 않을 때
    ```python
    from fastapi.encoders import jsonable_encoder
    from fastapi.exceptions import RequestValidationError
    from fastapi.responses import JSONResponse
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
        )
    
    class Item(BaseModel):
        title: str
        size: int
    
    @app.post("/items/")
    async def create_item(item: Item):
        return item 
    ```
    아래의 request body를 보냈을 때
    ```json
    {
      "title": "towel",
      // size가 int가 아닌 str값
      "size": "XL"
    } 
    ```
    아래의 오류 내용을 담은 JSON이 return
    ```json
    {
      "detail": [
        {
          "loc": [
            "body",
            "size"
          ],
          "msg": "value is not a valid integer",
          "type": "type_error.integer"
        }
      ],
      "body": {
        "title": "towel",
        "size": "XL"
      }
    } 
    ```

- 주의: FastAPI는 RequestValidationError를 이용하여 오류 로그를 볼 수 있지만, 클라이언트는 상태 코드 500(Internal Server Error)
        를 받아야할 것이다. 왜냐하면, 사실상 이것은 코드의 오류일 것이기 때문이고 클라이언트나 유저는 에러에 대한 내부 정보에 ㅔ접근할 수
        없게 하는 것이 내부적으로 안전하기 때문이다.


## `HTTPException`: Override HTTPException error handler
- 모듈 `starlette.exceptions.HTTPException`
- `fastapi.exceptions.HTTPException`와 `Starlette.exceptions.HTTPException`의 차이
  - FastAPI의 HTTPException은 세부 필드에 대해 JSON 가능 데이터를 허용하는 반면 Starlette의 HTTPException은 이에 대한 문자열만 허용한다는 것
    하지만 예외 처리기를 등록할 때 Starlette의 HTTPException에 등록하여, Starlette의 내부 코드, Starlette 확장 또는 플러그인의 일부가 
    Starlette HTTPException을 발생시키는 경우 처리기가 이를 포착하고 처리할 수 있다.
- 코드
```python
from fastapi.responses import PlainTextResponse
from starlette.exceptions import HTTPException 

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id == 3:
        # http_exception_handler가 인자(exc)로 받게 되는 예외
        raise HTTPException(status_code=418, detail="Nope! I don't like 3.")
    return {"item_id": item_id} 
```

## FastAPI's exception handlers
- 모듈: `fastapi.exception_handlers.http_exception_handler`, `fastapi.exception_handlers.request_validation_exception_handler`
- 코드
    ```python
    from fastapi import FastAPI, HTTPException
    from fastapi.exception_handlers import (
        http_exception_handler,
        request_validation_exception_handler,
    )
    from fastapi.exceptions import RequestValidationError
    from starlette.exceptions import HTTPException as StarletteHTTPException
    
    
    @app.exception_handler(StarletteHTTPException)
    async def custom_http_exception_handler(request, exc):
        print(f"OMG! An HTTP error!: {repr(exc)}")
        return await http_exception_handler(request, exc)
    
    
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc):
        print(f"OMG! The client sent invalid data!: {exc}")
        return await request_validation_exception_handler(request, exc)
    
    
    @app.get("/items/{item_id}")
    async def read_item(item_id: int):
        if item_id == 3:
            raise HTTPException(status_code=418, detail="Nope! I don't like 3.")
        return {"item_id": item_id}
    ```

<h1 id = "23">경로 작동 데코레이터의 속성들</h1>

- 경로 작동 데코레이터에 매개변수(들)를 전달함으로 경로 작동을 설정하고 메타데이터를 추가

## tag
- (보통 단일 str인) str로 구성된 list와 함께 매개변수 tags를 전달하여, 경로 작동에 태그를 추가
- 예시: `@app.post("/items/", response_model=Item, tags=["items"])`
- 결과: OpenAPI의 스키마에 추가되어 자동 문서 인터페이스에서 사용된다.
![tag](https://fastapi.tiangolo.com/img/tutorial/path-operation-configuration/image01.png)

## summary, description

- 예시
    ```python
    @app.post(
        "/items/",
        response_model=Item,
        summary="Create an item",
        description="Create an item with all the information, name, description, price, tax and a set of unique tags",
    ) 
    ```
- 역시 OpenAPI의 스키마에 추가됨.

## 독스트링으로 기술하기.
- 마크다운 문법으로 작성
- 예시
    ```python
    @app.post("/items/", response_model=Item, summary="Create an item")
    async def create_item(item: Item):
        """
        Create an item with all the information:
    
        - **name**: each item must have a name
        - **description**: a long description
        - **price**: required
        - **tax**: if the item doesn't have tax, you can omit this
        - **tags**: a set of unique tag strings for this item
        """
        return item
    ```
- 결과
    ![docstring](https://fastapi.tiangolo.com/img/tutorial/path-operation-configuration/image02.png)

## response_description
- 응답에 대한 설명을 기술할 수 있다.
- 예시
    ```python
    @app.post(
        "/items/",
        response_model=Item,
        summary="Create an item",
        response_description="The created item",
    ) 
    ```
  
## deprecated
- api를 없애진 않지만, 지원을 중단해야한다면 deprecated를 True로 설정
    ```python
    @app.get("/elements/", tags=["items"], deprecated=True) 
    ```
  
<h1 id = "24">jsonable_encoder</h1>

- 모듈: `fastapi.encoders.jsonable_encoder`
- Pydantic 모델을 JSON과 호환된 상태(예: dict, list)로 반환할 경우가 있음
  - ex: for 데이터 베이스에 저장, datetime과 같은 객체는 JSON이 지원하는 타입이 아니므로 str로 변환 필요
- ∴ FastAPI에서 jsonable_encoder함수 제공
  - Pydantic 모델은 dict형태로, datetime객체는 str로 변환해준다.
- 이렇게 호출한 결과는 JSON과 모두 호환되는 값과 하위 값이 있는 Python 표준 데이터 구조 (예: dict)로 반환된다. 
  따라서 파이썬 표준인 json.dumps()(Python 객체를 JSON 문자열로 변환)로 인코딩이 가능하다.
- 예시
    ```python
    from datetime import datetime
    ...
    from fastapi.encoders import jsonable_encoder
    
    class Item(BaseModel):
        title: str
        timestamp: datetime
        description: Union[str, None] = None
    ...
    app = FastAPI()
    ...
    @app.put("/items/{id}")
    def update_item(id: str, item: Item):
        json_compatible_item_data = jsonable_encoder(item)
        fake_db[id] = json_compatible_item_data 
    ```

<h1 id = "25">update와 exclude_unset, update parameter</h1>

## exclude_unset
- for: 부분 수정을 위해서
- 예시:
  - name이 "Bar"인 데이터베이스의 값을 update하려고 할 때
  - pydantic모델
    ```python
    class Item(BaseModel):
        name: str | None = None
        description: str | None = None
        price: float | None = None
        tax: float = 10.5
        tags: list[str] = [] 
    ```
  - 원래 db에 저장된 내용(예시)
     ```json
         "bar": {"name": "Bar", "description": "The bartenders", "price": 62, "tax": 20.2},
     ```
  - update를 위해 request body에 담은 내용
   ```json
   {
       "name": "Barz",
       "price": 3,
       "description": None,
   }
   ```
  - 본래 저장된 tax의 값은 20.2이지만, request body에 tax가 없고 Pydantic field 설정에 tax의 기본값으로 10.5가 설정되어 있기 때문에
    tax가 10.5로 업데이트 됨
  - ∴ exclude_unset=True로 하여 부분 업데이트를 진행한다. 그러면 기본값을 제외하고 항목 모델을 생성할 때 설정된 데이터만 사용하여 딕셔너리를 생성한다.

## model_copy함수
- .model_copy()를 사용하여 기존 모델의 복사본을 생성하고 업데이트할 데이터가 포함된 dictionary와 함께 update 매개변수를 전달하여 update진행

## 순서와 예시 정리
- 순서
  1. (선택) put대신 patch 사용
  2. 저장된 데이터 검색, Pydantic 모델에 넣기
  3. exclude_unset 속성을 이용하여 Item Pydantic 모델객체를 기본 값 없이 dictionary로 생성
  4. 저장된 모델의 복사본을 만들고 (model_copy함수) update의 매개변수로 3의 dictionary를 전달함으로써 속성을 업데이트
  5. 복사된 모델을 DB에 저장할 수 있는 것으로 변환(jsonalbe_encoder): 이는 모델의 .model_dump() 메서드를 다시 사용하는 것과 비슷하지만 
     값을 JSON으로 변환할 수 있는 데이터 유형(예: datetime을 str로 변환)으로 확인하고 변환
  6. db에 저장

- 예시
```python
from fastapi.encoders import jsonable_encoder
...
@app.patch("/items/{item_id}", response_model=Item)
async def update_item(item_id: str, item: Item):
    stored_item_data = items[item_id]
    stored_item_model = Item(**stored_item_data)
    
    # update_data = item.dict(exclude_unset=True)
    update_data = item.model_dump(exclude_unset=True)
    
    # updated_item = stored_item_model.copy(update=update_data)
    updated_item = stored_item_model.model_copy(update=update_data)
    
    items[item_id] = jsonable_encoder(updated_item)
    return updated_item
```
- 참고: app.patch()..를 사용하여 부분 업데이트도 가능하다.

<h1 id = "26">의존성(Dependency)</h1>

- 코드 반복을 최소화
- 의존성 주입 예시
  - 공용된 로직을 가졌을 경우 (같은 코드 로직이 계속 반복되는 경우).
  - 데이터베이스 연결을 공유하는 경우.
  - 보안, 인증, 역할 요구 사항 등을 강제하는 경우.

## Depends 함수
- 모듈: `fastapi.Depends`
- 의존성 주입으로 FastAPI에게 경로 작동 함수가 실행되기 전에 실행되어야 하는 무언가에 경로 작동 함수 
  가 "의존"하고 있음을 알릴 수 있으며, FastAPI는 이를 실행하고 결과를 "주입"할 것.
- 경로 함수에 `commons: Annotated[dict, Depends(common_parameters)]`와 같은 형식으로 작성
- 매개변수는 함수로, 직접 호출하지 않고 매개변수로 넘기기만 한다.(괄호를 치지 않는다)
  - 본래, common_parameter()를 직접 호출해야 했다면 유효성을 검사해야하는 모든 인자를 직접 입력하고 넘겨 의존성을 더해야했을 것
  - 하지만, Annotated를 이용하여 함수만 작성할 수 있다(나머지 인자들은 알아서 타입 정보가 보존).
- 동작
  1. 올바른 매개변수를 가진 Depends 함수를 호출
  2. 함수에서 결과를 받아온다
  3. 경로 함수에 잇는 매개변수(예시에서의 common)에 그 결과를 할당
- 예시
    ```python
    from typing import Annotated
    from fastapi import Depends, FastAPI
    
    async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
        return {"q": q, "skip": skip, "limit": limit}
    
    @app.get("/items/")
    async def read_items(commons: Annotated[dict, Depends(common_parameters)]):
        return commons
    
    @app.get("/users/")
    async def read_users(commons: Annotated[dict, Depends(common_parameters)]):
        return commons 
    ```
  - 이 의존성은 경로 데코레이터만 없을 뿐, 경로 함수와 같은 형태를 가지며 다음과 같은 유효성 검사를 한다:

    - 선택적인 쿼리 매개변수 q, str을 자료형으로 가진다.
    - 선택적인 쿼리 매개변수 skip, int를 자료형으로 가지며 기본 값은 0이다.
    - 선택적인 쿼리 매개변수 limit,int를 자료형으로 가지며 기본 값은 100이다.
    - 그 후 위의 값을 포함한 dict 자료형으로 반환한다.
  - 위와 같은 예시는 **많은 경로 작동에서 같은 의존성을 계속해서 사용**하는 거대 코드 기반안에서 사용하면 유용할 것

## 클래스 종속성
- 일반적으로 '함수'로 선언된 의존성을 사용하지만, 의존성은 '호출 가능'할 수 있는 모든 것은 의존성이 될 수 있다.
- 즉 클래스 역시 호출가능하므로(ex: something(some_argument)) 클래스를 의존성으로서 사용가능하다.
- 아래의 예시에서 Depends로 init함수가 작동하고, 그 인자들을 검사하게 될 것.
- 예시
    ```python
    class CommonQueryParams:
        def __init__(self, q: Union[str, None] = None, skip: int = 0, limit: int = 100):
            self.q = q
            self.skip = skip
            self.limit = limit
    
    @app.get("/items/")
    # async def read_items(commons: CommonQueryParams = Depends(CommonQueryParams)):
    async def read_items(commons: CommonQueryParams = Depends()):
        response = {}
        if commons.q:
            response.update({"q": commons.q})
        items = fake_items_db[commons.skip : commons.skip + commons.limit]
        response.update({"items": items})
        return response 
    ```
- `commons: CommonQueryParams = Depends(CommonQueryParams)`이 코드에서 `commons: CommonQueryParams` 힌팅에 어떤 의미를 부여하지 않기 때문에
    `commons = Depends(CommonQueryParams)`와 같이 작성해도 무관하다.
- 그러나 자료형을 선언하면 에디터가 매개변수 commons로 전달될 것이 무엇인지 알게 되고, 이를 통해 코드 완성, 자료형 확인 등에 도움이 될 수 있으므로 권장
- 하지만 CommonQueryParams을 두 번 반복하게 되므로 `commons: CommonQueryParams = Depends()`와 표현하여 중복을 줄여도 같은 코드다.

## 하위 의존성
- 의존성이 부여된 것을 다시 의존성으로 사용할 수 있다.
- 예시
    ```python
    # 의존성으로 주입되는 함수
    def query_extractor(q: str | None = None):
        return q
    
    # 의존성을 주입한 함수, 다른 곳에 의존성으로 활용되는 함수
    def query_or_cookie_extractor(
        q: Annotated[str, Depends(query_extractor)],
        last_query: Annotated[str | None, Cookie()] = None,
    ):
        if not q:
            return last_query
        return q
    
    @app.get("/items/")
    async def read_query(
        query_or_default: Annotated[str, Depends(query_or_cookie_extractor)]
    ):
        return {"q_or_cookie": query_or_default}
    ```
  - q에 대한 타입 힌트가 Annotated[str, Depends(query_extractor)]가 아니고 Depends를 사용하여 의존성을 주입하는 것(단순히 함수 호출로서 동작)
  - 위 read_query경로함수는 사용자가 쿼리 q를 제공하지 않은 경우 이전에 쿠키에 저장한 마지막 쿼리를 사용하도록 의존성이 주입되어 있다.

## 의존성의 캐싱
- 동일한 경로 작업에 대해 종속성 중 하나가 여러 번 선언된 경우(예: 여러 종속성이 공통 하위 종속성을 갖는 경우) FastAPI는 요청당 한 번만 
    해당 하위 종속성을 호출하는 것을 인식.
- 그리고 동일한 요청에 대해 종속성을 여러 번 호출하는 대신 반환된 값을 "캐시"에 저장하고 해당 특정 요청에 필요한 모든 "종속자"에게 전달.
- "캐시된" 값을 사용하는 대신 동일한 요청의 모든 단계(여러 번 가능)에서 종속성을 호출해야 할 때 use_cache=False 매개변수를 설정.
- 예시
    ```python
    async def needy_dependency(fresh_value: Annotated[str, Depends(get_value, use_cache=False)]):
        return {"fresh_value": fresh_value} 
    ```
  
## 여러 개 의존성 주입하기
- 경로 데코레이터에 dependencies 값으로 list를 주입한다(Depends()로 된 list).
- 형태: `@app.get("/items/", dependencies=[Depends(verify_token), Depends(verify_key)])`
- 의존성이 오류를 일으킨다면(raise) 오류를 발생시킨다.
- 주의: 의존성들이 반환값을 가진다고 해도 경로 함수에 전달되지 않는다.

## 전역 의존성
- 애플리케이션 전체에 어떤 의존성을 공통적으로 추가하고자 할 때 전역 의존성을 설정함으로써 앱에 있는 모든 경로 작동에 해당 의존성이 적용된다.
- 예시
    ```python
    from fastapi import FastAPI
    app = FastAPI(dependencies=[Depends(verify_token), Depends(verify_key)]) 
    ```
## `yield` 키워드와 의존성
### `yield` 키워드
- `yield`는 제너레이터를 만드는 데 사용하는 키워드. yield를 사용하여 제너레이터 함수를 정의하면 해당 함수는 호출될 때마다 값을 생성하고 호출자에게 반환.
- `yield` 키워드를 포함하는 제너레이터 함수는 일반 함수와는 다르게 동작하여 호출되면 제어 흐름은 해당 함수 내의 코드 블록으로 이동. 
- 그런 다음, yield 키워드를 만날 때까지 코드가 실행, 해당 제너레이터 함수가 호출될 때마다 이전에 중지된 지점부터 다시 시작하여 yield 키워드 다음에 오는 코드를 실행
- 이 과정은 제너레이터가 더 이상 생성할 값이 없을 때까지 반복
- 제너레이터 함수가 실행을 완료하거나 return 문을 만나면 제너레이터는 StopIteration 예외를 발생시키며 종료
- 예시
```python
def my_generator():
    yield 1
    yield 2
    yield 3

# 제너레이터를 생성합니다.
gen = my_generator()

# 제너레이터에서 값을 하나씩 가져옵니다.
print(next(gen))  # 1
print(next(gen))  # 2
print(next(gen))  # 3 
```

## 의존성과 yield
- 제너레이터 함수는 값을 반환한 후에도 실행 상태를 유지하며, 다시 호출될 때 이전에 반환한 지점부터 계속 실행
- 이런 특성을 이용해 `yield` 이전에 위치한 코드는 의존성이 호출되기 전에 실행되고, `yield` 이후의 코드는 모든 경로 연산이 완료된 후에 실행. 

### 데이터베이스와  `yield` 키워드, 의존성
- 예시: 데이터베이스 세션을 생성하고 그것이 끝난 후에 종료하는 의존성
    ```python
    async def get_db():
        db = DBSession()
        try:
            yield db
        finally:
            db.close()
    ```
    1. 응답을 작성하기 전에 `yield` 문장 앞에 포함된 코드만 실행(db = DBSession())
    2. `yield db` 값은 경로함수 및 기타 종속성에 주입되는 값 
    3. `db.close()`는 경로함수의 응답이 전달된 후 실행

## yield키워드, try-except문
- yield 키워드를 사용한 의존성의 주의점
    - `yield` 이전의 코드에서 예외가 발생하면, 'yield' 이후의 코드는 실행되지 않는다.
    - `yield`가 있는 제너레이터의 의존성을 사용하는 경로 연산에서 예외가 발생하면, 해당 의존성의 `yield` 이후의 코드가 실행되지 않는다.
- 따라서 try'/'except' 블록을 사용하여 'yield' 이후의 코드를 안전하게 실행해야 한다.
- yield와 try 구문을 함께 사용하는 경우, 해당 의존성이 호출될 때 발생한 예외(exception)를 받을 수 있다
    - 예: 다른 의존성이나 경로 연산에서 데이터베이스 트랜잭션을 롤백하거나 다른 오류를 발생시킨 경우, 해당 의존성에서 예외를 받을 수 있다
- 따라서, 의존성 내부에서 특정한 예외를 처리하기 위해 except SomeException 구문을 사용
- 마지막으로, finally 구문을 사용하여 예외 발생 여부와 관계없이 종료 단계가 실행되도록 한다.

## yield과 HTTPException
- 의존성 내부에서 발생한 예외를 처리하고, 필요한 경우 HTTP 응답으로 변환하여 클라이언트에게 알려줄 수 있음
- 예시
    ```python
    def get_username():
        try:
            yield "Rick"
        except OwnerError as e:
            raise HTTPException(status_code=400, detail=f"Owner error: {e}")
    
    
    @app.get("/items/{item_id}")
    def get_item(item_id: str, username: Annotated[str, Depends(get_username)]):
  
        # 경로 함수가 처리
        if item_id not in data:
            raise HTTPException(status_code=404, detail="Item not found")
        item = data[item_id]
  
        # get_username제너레이터 함수가 예외를 가져가 except문에서 처리하게 될 예외
        if item["owner"] != username:
            raise OwnerError(username)
        return item 
    ```
- get_item 함수 내에서 OwnerError 예외가 발생하면, 이는 get_username 함수의 `yield` 이후의 코드에서 처리

<h1 id = "27">Security - 세션 기반 인증과 토큰 기반 인증</h1>

- [참고](https://hudi.blog/session-based-auth-vs-token-based-auth/)

## 세션 인증 방식
- 일반적인 웹 애플리케이션의 보안 시스템에서는, 사용자가 자신의 이름과 비밀번호를 입력하여 로그인하면 사용자 인증 정보가 세션 저장소에 저장된다.
- 사용자는 저장된 세션 정보의 식별자인 세션ID를 발급받아 브라우저의 쿠키 형태로 저장한다. 
- 즉, 실제 인증 정보는 서버에 저장되어 있다.
- 따라서 HTTP Cookie 헤더에 Session ID를 요청 시에 보내면 서버는 요청을 전달받고 Seession ID에 해당되는 세션 정보를 찾고, 존재한다면 해당 사용자를
  인증된 사용자로 판단한다.

## 토큰 인증 방식
- 그러나 API는 세션이 존재하지 않기 때문에 사용자가 매번 요청을 보낼 때마다 이름과 비밀번호를 보내는 비보안적인 방식을 택해야한다. 
- 이를 피하기 위해서 API는 토큰 기반 인증을 따른다.
- 세션 기반 인증이 인증 정보를 서버에 저장하는 방식이라면, 토큰 기반 인증은 인증 정보를 클라이언트가 직접 들고 있는 인증 방식이다.
- 사용자가 한 번 로그인하면, 서버는 "토큰"을 반환하며 이 토큰은 사용자 이름과 비밀번호로 생성된 유니크한 문자열이다.
- 토큰의 형태로 인증 정보가 반환되면 브라우저의 로컬 스토리지(혹은 쿠키)에 저장된다.
- 토큰 기반 인증에서는 사용자가 가지고 있는 토큰을 HTTP 의 Authorization 헤더에 실어 보낸다. 이 헤더를 수신한 서버는 토큰이 위변조 되었거나, 
  만료 시각이 지나지 않은지 확인한 이후 토큰에 담겨있는 사용자 인증 정보를 확인해 사용자를 인가한다.

<h1 id = "28">Security - OAuth2PasswordBearer</h1>

## OAuth2
- [참고](https://lucky516.tistory.com/106)
- 인증 프로토콜(사용자에게 권한을 부여하고, 사용자를 인증하는 방법을 정의한 것)로, 사용자의 권한을 확인하고 부여하는 데에도 사용.
- 3rd party 인증시스템도 제공 -> 페이스북, 구글, 트위터, 깃허브로 로그인"하는 모든 시스템이 아래에 사용하는 것
- OAuth2의 security를 다루는걸 flow라고 하며, OAuth2는 password flow, 즉 비밀번호로 보안을 다루는 것도 지원한다.

## OAuth2PasswordBearer 클래스
- 모듈: `fastapi.security.OAuth2PasswordBearer`
- `OAuth2PasswordBearer`는 역시 호출 가능한 객체이므로 Depends()와 함께 사용하여 의존성이 될 수 있다.

### 기능
- "bearer" 토큰을 사용하는 OAuth2 스키마를 생성
- 사용자가 로그인 상태라면, 즉 유효한 액세스 토큰을 가지고 있다면, OAuth2PasswordBearer는 해당 토큰을 검증하여 인증을 수행
- 사용자가 로그인 상태가 아니라면, 클라이언트는 tokenUrl에 지정된 엔드포인트로 사용자의 자격 증명을 제공하여 새로운 액세스 토큰을 요청
- 요청에서 Authorization 헤더를 확인.
- 헤더의 값이 "Bearer" 토큰인지 확인. 토큰을 분석하여 만약 "Bearer" 토큰이 없다면, 오류를 반환
- "Bearer" 토큰이고 유효하다면 해당 토큰을 문자열 형태로 반환(토큰이 가진 사용자 정보를 반환), 유효하지 않으면 오류 반환.
- 만약 요청에 Authorization 헤더가 없거나, 값이 "Bearer" 토큰이 아니라면, 클래스는 직접적으로 401 상태 코드 오류(인증되지 않음)를 응답.
- 함수가 실행되면 토큰이 문자열 형태로 제공될 것이라는 것을 확신하므로 토큰의 존재 여부를 확인하여 오류를 반환할 필요가 없다.

현재 토큰의 유효성을 확인하고 있는 것은 아닙니다. 하지만 이것은 이미 출발점입니다.
### 작동
```python
...
from fastapi.security import OAuth2PasswordBearer
...
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
...
@app.get("/items/")
#                                           의존성으로 사용할 수 있음
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}
```
**인증**
- 사용자가 제공한 자격 증명(username과 password)을 사용하여 토큰을 발급받고, 이 토큰을 사용하여 API에 대한 인증을 수행
1. fe에서 username과 password로 이어진 폼 데이터를 FastAPI 백엔드의 특정 URL로 전송(tokenUrl에 설정된 기본 값)에 보낸다.
    - tokenUrl의 값: 클라이언트가 토큰을 얻기 위해 접근해야 하는 URL
    - 이때 tokenUrl의 값은 상대 url로, API가 https://example.com/, 에 있다면 https://example.com/token 를 참조
2. API에서 확인하고 토큰으로 응답
    - Depends(oauth2_scheme) 설정으로 oauth2_scheme는 경로함수의 파라미터인 token에 문자열을 할당한다. 
    - 토큰"은 단순히 사용자를 나타내는 문자열이며 나중에 이 사용자를 확인하는 데 사용
    - 일반적으로, 토큰은 일정 시간이 지난 후에 만료
3. fe는 이 토큰을 일시적으로 어딘가 저장
4. 사용자가 fe에 다른 섹션을 위해 클릭하고, 이에 해당하는 요청을 fe가 be에 요청을 할 때, 인증이 필요한 API라면 인증을 위해 헤더 Authorization에 Bearer와 토큰을 함께 전송


<h1 id = "29">Security - 현재 사용자 가져오기</h1>

1. 반환할 사용자 Model생성
    ```python
    class User(BaseModel):
        username: str
        email: Union[str, None] = None
        full_name: Union[str, None] = None
        disabled: Union[bool, None] = None 
    ```
2. get_current_user 의존성 생성
- 하위 의존성을 이용하여 또 다른 의존성을 생성한다(OAuth2PasswordBearer객체 의존하여 새 의존성 만들기).
```python
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def fake_decode_token(token): # 유저 조회

#                                       OAuth2PasswordBearer객체로 부터 str 토큰 발급-> token에 할당    
async def get_current_user(token: str = Depends(oauth2_scheme)):
    #       해당 token을 이용하여 user 조회
    user = fake_decode_token(token)
    return user

@app.get("/users/me")
#                       get_current_user 의존성을 주입하여 current_user에 UserModel객체 할당
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user 
```


<h1 id = "30">Security - 로그인 경로 함수 작성</h1>

- 클라이언트/사용자가 username과 password 필드를 form 데이터로 보내야 한다고 규정되어 있으므로, JSON형태는 허용되지 않는다.

## OAuth2PasswordRequestForm
- 모듈: fastapi.security.OAuth2PasswordRequestForm
- 클래스 디펜던시로, 아래와 같은 form body를 가진다.
  - username
  - password
  - scope(Optional)
  - grant_type(Optional)
  - client_id(Optional)
  - client_secret(Optional)
- OAuth2 spec은 사실 grant_type이 required이지만 OAuth2PasswordRequestForm 에선 아니다.
- grant_type을 required로 쓰고 싶으면 OAuth2PasswordRequestFormStrict 을 사용한다.

## scope
- [공식문서 참조](https://fastapi.tiangolo.com/ko/advanced/security/oauth2-scopes/)
- 
- password flow에는 scope라는 filed가 있으며 
- 클라이언트가 요청하는 특정한 권한의 범위를 지정하는 데 사용
- 필요한 권한만을 요청하여 보다 세밀한 권한 관리(read, write 등)

## tokenUrl에 설정된 상대 경로 함수 - 로그인 인증
- 코드
    ```python
    @app.post("/token")
    #                           출력 스키마인 OAuth2PasswordRequestForm를 통해 forrm_data 할당
    async def login(form_data: OAuth2PasswordRequestForm = Depends()):
        # 1. form에 입력된 username과 일치하는 row가 있는 지 db조회
        user_dict = fake_users_db.get(form_data.username)
        if not user_dict: 
            raise HTTPException(status_code=400, detail="Incorrect username or password")
        
        # 2. form에 입력된 password를 암호화한 후 db의 해시 암호와 비교
        user = UserInDB(**user_dict)
        hashed_password = fake_hash_password(form_data.password)
        if not hashed_password == user.hashed_password:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
    
        # 3. 모두 일치하면 토큰과 토큰 타입을 반환
        return {"access_token": user.username, "token_type": "bearer"}
    ```
- password 플로우에서 로그인에 성공하면 reponse로 token을 반환하고 이 token은 반드시 JSON object 이여야 한다.
- 또한 token은 반드시 access_token 과 token_type을  가져야 한다.


<h1 id = "31">Security - 인증 로직 상세</h1>


- 가정: read_users_me 경로 함수는 인증된 요청만 처리하고, 현재 'active'한 사용자 값을 가져오는 의존성을 활용한다.
- 코드
    ```python
    async def get_current_user(token: str = Depends(oauth2_scheme)):
        user = fake_decode_token(token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    
    
    async def get_current_active_user(current_user: User = Depends(get_current_user)):
        if current_user.disabled:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user
        
     ............
     
    @app.get("/users/me")
    async def read_users_me(current_user: User = Depends(get_current_active_user)):
        return current_user 
    ```
- 로직: fake_decode_token -> get_current_active_user -> read_users_me
  1. fake_decode_token
    - oauth2_scheme을 의존성으로 설정한 함수는 인자로 토큰 str을 받고 토큰을 decode하는 함수에 해당 토큰을 인자로 전달하여 user를 찾는다.
    - oauth2_scheme은 OAuth2PasswordBearer(tokenUrl="token") 객체
    - user가 있다면 반환, 없다면 raise HTTPException
  2. get_current_active_user
    - fake_decode_token을 의존성으로 주입하여 current_user에 User객체 할당.
    - `if current_user.disabled`이 True면 current_user 반환, 아니라면 raise HTTPException
  3. read_users_me
    - 위 의존성들을 최종적으로 주입하는 경로 함수로, 반환된 user를 current_user에 할당하여 return한다.

<h1 id = "32">Security - JWT를 통한 토큰 발급</h1>

- 전체 코드
    ```python
    from datetime import datetime, timedelta, timezone
    from typing import Annotated
    
    from fastapi import Depends, FastAPI, HTTPException, status
    from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
    from jose import JWTError, jwt
    from passlib.context import CryptContext
    from pydantic import BaseModel
    
    # to get a string like this run:
    # openssl rand -hex 32
    SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    
    fake_users_db = {
        "johndoe": {
            "username": "johndoe",
            "full_name": "John Doe",
            "email": "johndoe@example.com",
            "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
            "disabled": False,
        }
    }
    
    
    class Token(BaseModel):
        access_token: str
        token_type: str
    
    
    class TokenData(BaseModel):
        username: str | None = None
    
    
    class User(BaseModel):
        username: str
        email: str | None = None
        full_name: str | None = None
        disabled: bool | None = None
    
    
    class UserInDB(User):
        hashed_password: str
    
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
    
    app = FastAPI()
    
    
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)
    
    
    def get_password_hash(password):
        return pwd_context.hash(password)
    
    
    def get_user(db, username: str):
        if username in db:
            user_dict = db[username]
            return UserInDB(**user_dict)
    
    
    def authenticate_user(fake_db, username: str, password: str):
        user = get_user(fake_db, username)
        if not user:
            return False
        if not verify_password(password, user.hashed_password):
            return False
        return user
    
    
    def create_access_token(data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    
    async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
        except JWTError:
            raise credentials_exception
        user = get_user(fake_users_db, username=token_data.username)
        if user is None:
            raise credentials_exception
        return user
    
    
    async def get_current_active_user(
        current_user: Annotated[User, Depends(get_current_user)]
    ):
        if current_user.disabled:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user
    
    
    @app.post("/token")
    async def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
    ) -> Token:
        user = authenticate_user(fake_users_db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
    
    
    @app.get("/users/me/", response_model=User)
    async def read_users_me(
        current_user: Annotated[User, Depends(get_current_active_user)]
    ):
        return current_user
    
    
    @app.get("/users/me/items/")
    async def read_own_items(
        current_user: Annotated[User, Depends(get_current_active_user)]
    ):
        return [{"item_id": "Foo", "owner": current_user.username}] 
    ```
- 필요한 모듈
  ```console
  pip install "python-jose[cryptography]"
  pip install "passlib[bcrypt]"
  ```
  - `fastapi.security.OAuth2PasswordBearer`: for 토큰 유효 검사, 발급 
  - `fastapi.security.OAuth2PasswordRequestForm`: for 입력 스키마 받아옴
  - `jose.JWTError`: JWT를 다루는 데 사용되는 에러 클래스(JWT의 서명이 유효하지 않거나, JWT가 만료되었거나, JWT가 기대한 형식과 일치하지 않을 때 등)
  - `jose.jwt`: JWT 토큰을 인코드하거나 디코드하기 위한 모듈
  - `passlib.context.CryptContext`: 평문의 비밀번호와 해시 비밀번호 비교(verify함수), 평문을 암호 비밀번호로 반환(hash함수)
  
- jwt 발급 및 디코딩에 필요한 상수
  1. SECRET_KEY 
  2. ALGORITHM 
  3. ACCESS_TOKEN_EXPIRE_MINUTES 

- 필요한 객체
  1. CryptContext객체: 평문의 비밀번호와 해시 비밀번호 비교(verify함수), 평문을 암호 비밀번호로 반환(hash함수)
  2. OAuth2PasswordBearer객체: token 발급 또는 유효하지 않은 user일 시 rasie exception

- 필요한 출력 스키마: Token, TokenData, User
  1. Token: login으로 인증 성공 후 tokenUrl에 해당하는 경로 함수는 반환값으로 access_token과 token_type을 반환해야 한다.
  2. TokenData:
  3. User;
  4. UserInDB: hashed된 password를 필드로 가진 객체

- 동작
  > "/users/me/" 요청한 경로함수(read_users_me)는 get_current_active_user 의존성을 주입하여 current_user를 할당받을 것
  > read_users_me -> get_current_active_user -> get_current_user -> oauth2_scheme ->(유효하지 않은 토큰일 시) login_for_access_token -> OAuth2PasswordRequestForm 

- read_users_me
    ```python
    @app.get("/users/me/", response_model=User)
    async def read_users_me(current_user: User = Depends(get_current_active_user)):
        return current_user 
    ```
    - 최종적으로 받아온 user를 반환, get_current_active_user 의존성

<br>

- get_current_active_user
    ```python
    async def get_current_active_user(current_user: User = Depends(get_current_user)):
        if current_user.disabled:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user
    ```
    - 최종적으로 user를 반환
    - get_current_user 의존성으로 받아온 current_user의 어트리뷰트 `disabled`가 True일 시 raise HTTPException

<br>

- get_current_user
    ```python
    async def get_current_user(token: str = Depends(oauth2_scheme)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
        except JWTError:
            raise credentials_exception
        user = get_user(fake_users_db, username=token_data.username)
        if user is None:
            raise credentials_exception
        return user 
    ```
  - 최종적으로 user를 반환
  - oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")를 통해 str의 토큰을 반환받고, 토큰을 decode하여 username을 추출한다.
  - jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]).get("sub")은 디코딩된 토큰에서 "sub" 클레임 값을 가져온다. 
  - "sub" 클레임은 JWT 토큰에 포함될 수 있는 표준 클레임 중 하나로, 주로 서브젝트(Subject)를 나타내며 토큰에 포함된 정보의 소유자나 주체(username)를 식별하는 데 사용됩니다.
    - JWT 토큰이 만료되거나 서명이 유효하지 않을 경우에는 디코딩된 토큰에서 "sub" 클레임 값이 None으로 반환
  - 디코딩 후 얻어온 username으로 db 조회, 존재할 시 반환. 존재하지 않으면 raise Exceptiton

<br>

- oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token"), login_for_access_token
   - OAuth2PasswordBearer는 Header를 살펴 유효한 액세스 토큰을 가지고 있다면, 토큰을 반환. 로그인 상태가 아니라면 tokenUrl에 지정된 엔드포인트로 사용자의 자격 증명을 제공하여 새로운 액세스 토큰을 발급하도록 함 
    ```python
    @app.post("/token", response_model=Token)
    async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
        user = authenticate_user(fake_users_db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"} 
    ```
  - 최종적으로 token을 반환
  - OAuth2PasswordRequestForm 출력 스키마를 의존성으로 주입하여 form 데이터에 접근.
  - form 데이터의 username과 password를 통해 db를 조회
    - OAuth2PasswordBearer 객체를 이용하여 평문의 form password와 db에 저장된 암호화된 password 비교
  - 존재하지 않으면 예외처리, 존재하는 user일 경우 새 토큰 발급(함수 create_access_token 호출)


<h1 id = "33">Middleware</h1>

## 개념
- 서로 다른 애플리케이션이 서로 통신하는 데 사용되는 소프트웨어
- 애플리케이션, 데이터, 사용자를 연결하는 요소처럼 작동

## FastAPI와 미들웨어
- 미들웨어를 FastAPI 응용 프로그램에 추가
- 함수 상단에 `@app.middleware("http")` 데코레이터를 사용
- 미들웨어 함수는 `fastapi.Request`(또는 starlette.requests.Request)와 request를 매개로 받는`call_next`함수를 인자로 받는다.
  - 이 함수는 request를 해당하는 경로 작업으로 전달
  - 마지막으로 경로 작업에 의해 생성된 response 를 반환
- response를 반환하기 전에 추가로 response를 수정할 수 있다.

## 미들웨어 동작
- 응용 프로그램으로 오는 요청를 가져온다.
  - 특정 경로 작동에 의해 처리되기 전, 모든 요청에 대해서 동작하는 함수
- 요청 또는 다른 필요한 코드를 실행 시킬 수 있다.
- 요청을 응용 프로그램의 경로 작동으로 전달하여 처리.
- 애플리케이션의 경로 작업에서 생성한 응답를 받는다.
- 응답 또는 다른 필요한 코드를 실행시키는 동작을 할 수 있다.
- 응답를 반환한다.

## 세부적인 사항
- 만약 yield를 사용한 의존성을 가지고 있다면, 미들웨어가 실행되고 난 후에 exit이 실행
- 만약 백그라운드 작업이 있다면, 모든 미들웨어가 실행되고 난 후에 실행

## 코드
```python
from fastapi import FastAPI, Request
...
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    """
        사용자 정의 헤더는 'X-' 접두사를 사용하여 추가할 수 있다(custom proprietary 헤더를 의미).
        그러나 만약 클라이언트의 브라우저에서 볼 수 있는 사용자 정의 헤더를 가지고 있다면, 
        하지만 이 커스템 해더를 클라이언트에서 보게 하려면 CORS 설정(CORS (Cross-Origin Resource Sharing))에 
        Starlette CORS 문서에 명시된 expose_headers 매개변수를 이용하여 헤더들을 추가하여야한다.
    """
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

<h1 id = "34">CORS</h1>

## [CORS정책](https://docs.tosspayments.com/resources/glossary/cors)
- Cross-Origin Resource Sharing, 교차 출처 리소스 공유. 웹 애플리케이션에서 다른 출처(origin)로부터 리소스에 대한 접근을 제어하는 보안 메커니즘.
- 출처는 Origin을 의미하며 URL의 구성 요소 즉 도메인, 프로토콜, 포트까지 포함하는 개념이다. 
  - 프로토콜(http , https), 도메인(myapp.com, localhost, localhost.tiangolo.com ), 그리고 포트(80, 443, 8080 )의 조합
  - 따라서, 아래는 모두 localhost 에 있지만, 서로 다른 프로토콜과 포트를 사용하고 있으므로 모두 상이한 출처다.
    - http://localhost
    - https://localhost
    - http://localhost:8080
  - 출처를 구성하는 세 요소 중 하나라도 다르면 CORS 에러가 난다.
- Cross-Origin Resource Sharing를 직독직해한다면 출처가 교차한다는 것을 의미한다. 
  의미있게 다시 해석하자면 리소스를 주고받으려는 '두 출처가 서로 다를 때' 서로 다른 출처라도
  리소스 요청, 응답을 허용할 수 있도록 하는 정책이라는 의미다.
- 즉 CORS를 설정한다는 것은 '출처가 서로 다른 서버 간의 리소스를 허용'한다는 것이다.

## CORS 에러 대응하기
- 서버에서 Access-Control-Allow-Origin 헤더를 설정해서 요청을 수락할 출처를 명시적으로 지정한다. 이 헤더를 세팅하면 출처가 다르더라도 리소스 요청을 허용하게 된다.
- 프록시 서버를 사용한다.
  (Proxy server), 보통 Deric라고 부르며 클라이언트와 서버 사이에서 데이터를 전달해 주는 서버

## allowed origins(허용된 출처)
### 단계
- 아래의 단계를 거쳐 CORS 정책을 준수하며 다른 출처 간의 통신이 안전하게 이루어진다.

1. 프론트엔드 서버는 `http://localhost:8080`에서 동작하며, JavaScript가 백엔드 서버 `http://localhost:80`와 통신(서로 다른 출처)
2. 프론트엔드가 백엔드로 요청을 보낼 때, 브라우저는 먼저 백엔드에 대해 HTTP OPTIONS 요청을 보낸다. 
   - [HTTP OPTIONS 메서드](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/OPTIONS)는 주어진 URL 또는 서버에 대해 허용된 통신 옵션을 요청
   - 이 요청은 실제 요청을 보내기 전에 서버가 어떤 HTTP 메서드와 헤더를 허용하는지 확인하기 위한 것이다.
3. 백엔드는 OPTIONS 요청을 받으면, 다른 출처인 http://localhost:8080와의 통신을 허용하는 적절한 CORS 헤더를 응답에 포함하여 보낸다
4. 백엔드는 허용된 출처(allowed origins) 목록을 가지고 있으며 이 경우에는 http://localhost:8080을 허용 목록에 추가해야한다.
5. 브라우저는 백엔드로부터 받은 헤더를 확인하고, 프론트엔드의 JavaScript가 백엔드에 요청을 보낼 수 있도록 승인한다.

## 와일드 카드(*)
- 모든 출처를 허용하기 위해 목록을 "*" ("와일드카드")로 선언
- 하지만 이것은 특정한 유형의 통신만을 허용하며, 쿠키 및 액세스 토큰과 사용되는 인증 헤더(Authoriztion header) 등이 포함된 경우와 같이 
  자격 증명(credentials)이 포함된 통신은 허용되지 않으므로 모든 작업을 의도한대로 실행하기 위해, 허용되는 출처를 명시적으로 지정하는 것이 좋다.

## CORSMiddleware
- 모듈: `fastapi.middleware.cors.CORSMiddleware`(starlette.middleware.cors.CORSMiddleware 역시 사용 가능)
- FastAPI 응용 프로그램의 교차 출처 리소스 공유 환경을 설정

### 미들웨어로 적용
- 허용되는 출처(문자열 형식)의 리스트 생성하고 FastAPI 응용 프로그램에 "미들웨어(middleware)"로 추가.
- 코드
    ```python
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware 
    
    app = FastAPI()
    
    origins = [
        "http://localhost.tiangolo.com",
        "https://localhost.tiangolo.com",
        "http://localhost",
        "http://localhost:8080",
    ]
    
    app.add_middleware(
        CORSMiddleware,
  
        allow_origins=origins, # 교차-출처 요청을 보낼 수 있는 출처의 리스트. 모든 출처 허용은 ['*']
                               
        # allow_origin_regex: 교차-출처 요청을 보낼 수 있는 출처를 정규표현식 문자열. 예: 'https://.*\.example\.org'.
  
        allow_credentials=True,# 교차-출처 요청시 쿠키 지원 여부를 설정, 기본값은 False. 
                               # 해당 항목을 허용(True)할 경우 allow_origins 는 ['*'] 로 설정할 수 없으며, 출처를 반드시 특정해야 한다.
  
        allow_methods=["*"],   # 교차-출처 요청을 허용하는 HTTP 메소드의 리스트. 기본값은 ['GET']이며 모든 표준메소드 허용은 ['*']
  
        allow_headers=["*"],   # 교차-출처를 지원하는 HTTP 요청 헤더의 리스트로 기본값은 []. 모든 헤더들을 허용하기 위해 ['*'] 를 사용. 
                               # Accept, Accept-Language, Content-Language 그리고 Content-Type 헤더는 CORS 요청시 언제나 허용.
  
        # expose_headers: 브라우저에 접근할 수 있어야 하는 모든 응답 헤더. 기본값은 [].
  
        # max_age - 브라우저가 CORS 응답을 캐시에 저장하는 최대 시간을 초 단위로 설정. 기본값은 600.  
    )
    ```
  
## CORS preflight requests(사전요청)
- 실제 요청을 보내기 전에 브라우저가 서버에게 먼저 보내는 추가적인 요청으로, 본격적인 요청을 보내기 전에 서버가 요청을 수락할 수 있는지 확인하기 위해 사용
- CORS에서 사전요청은 HTTP OPTIONS 메서드를 사용하여 서버로 전송된다.
  - HTTP OPTIONS 요청은 Origin 및 Access-Control-Request-Method 헤더와 함께 전달된다.
  ```http
    OPTIONS /resources/post-here/ HTTP/1.1
    Host: bar.example
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
    Accept-Language: en-us,en;q=0.5
    Accept-Encoding: gzip,deflate
    Connection: keep-alive
    Origin: https://foo.example
    Access-Control-Request-Method: POST
    Access-Control-Request-Headers: X-PINGOTHER, Content-Type
  ```
- preflight 요청에 대한 적절한 응답을 제공하면, 브라우저는 실제 요청을 보낼 수 있다. (OPTIONS에 대한 요청 200반환)
- 그렇지 않은 경우, 브라우저는 실제 요청을 차단하고 오류를 반환(400 반환)

<h1 id = "35">SQL (Relational) Databases</h1>

## SQLite와 연동하기

### SQLite란,
- singe file로 관리되고 파이썬이 내부적으로 서포트 하고 있는 데이터베이스

## 연결 코드
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
```

### Import the SQLAlchemy parts
```python
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    #                                      sqlite에 필요한 설정 check_same_thread     
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
```
- engine은 create_engine() 함수로 생성된 객체며 SQLAlchemy에서 데이터베이스와의 연결을 설정하고 실제 연결을 관리하는 객체.
  - create_engine함수는 데이터베이스의 종류와 연결에 필요한 다양한 설정을 받아들이며, 위 코드에서 SQLite데이터베이스를 사용하며 
    SQLALCHEMY_DATABASE_URL로 데이터베이스의 위치가 지정되어 있다. check_same_thread설정은 SQLite 데이터베이스의 경우에만 필요한 것으로,
    False로 둠으로써 동일한 스레드에서 연결을 공유한다.

- engine객체의 역할
  - SQL 쿼리를 실행하고 데이터베이스와의 상호 작용을 처리
  - (효율적인 데이터베이스 작업을 위한)데이터베이스 연결 풀링 기능도 지원.

### Create a SessionLocal class
```python
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```
- SqlAlchemy에서 SessionLocal 객체는 세션 팩토리의 역할(모듈: `sqlalchemy.orm.sessionmaker`)
  - sessionmaker는 autocommit, autoflush, bind 등의 설정을 인자로 받아 세션 팩토리를 생성
  - 세션 팩토리란? SQLAlchemy에서 데이터베이스와의 상호작용을 관리하는 세션 객체를 생성하는 역할을 하는 생성자이다.
  - 팩토리는 세션 생성에 필요한 설정들을 저장하고 있으며, 이를 바탕으로 세션 객체를 생성한다.
- 세션 객체(모듈: `sqlalchemy.orm.Session`)
  - Session이란? 데이터베이스와의 모든 상호작용을 수행하는 인터페이스
  - 세션 객체는 생성될 때 세션 팩토리(SessionLocal 객체)를 호출하며 세션 팩토리는 sessionmaker에 전달된 설정들을 바탕으로 세션 객체를 생성한다.
  - 그러한 바탕으로 생성된 세션 객체는 engine 객체에 바인딩되어 데이터베이스와의 트랜잭션을 수행(데이터베이스와의 모든 상호작용을 수행)하는 데 사용된다.

### Create a Base class
```python
Base = declarative_base()
```
- 추후 해당 클래스를 상속하여 데이터베이스 모델이나 ORM 클래스를 생성하게 된다.

## 모델 코드

```python
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True) # index는 쿼리의 포퍼먼스를 올려주는 데 사용
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    items = relationship("Item", back_populates="owner")



class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")
```

## Pydantic 모델 만들기
```python
from typing import List, Optional
from pydantic import BaseModel


class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    id: int
    owner_id: int
    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str



class User(UserBase):
    id: int
    is_active: bool
    items: List[Item] = []

    class Config:
        orm_mode = True
```

### Pydantic Object
- Pydantic 객체는 ORM 모델과는 별도로 동작하는 데이터 처리 메커니즘을 담은 객체며, 데이터 유효성 검사, 직렬화(데이터를 JSON으로 변환), 그리고 문서화를 담당한다.
- Pydantic 객체는 기본적으로 입력데이터를 딕셔너리로 가정하고 처리한다. 
- 따라서 Pydantic Object를 생성하는 방식은 다음과 같다.
    ```python
    class User(BaseModel):
        name: str
        age: int
    
    # 인자 전달하여 모델 생성
    user_data = {
        "name": "John",
        "age": 30
    }
    user_instance = User(**user_data)
    ```
  - `**` 연산자를 사용하는 이유는 딕셔너리를 언팩하여 각 키-값 쌍을 키워드 인자로 전달하는 것을 의미(User(name="John", age=30))한다.

### orm_mode
```python
# ======== ORM Model ========
class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True)
    ...
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    ...
    items = relationship("Item", back_populates="owner")

    owner = relationship("User", back_populates="items")
    
# ======== ORM Model ========
class Item(BaseModel):
    id: int
    owner_id: int

    class Config:
        orm_mode = True
        
class User(BaseModel):
    id: int
    is_active: bool
    items: list[Item] = []

    class Config:
        orm_mode = True
```

> orm_mode = True를 설정하는 주된 이유는 Pydantic 모델이 ORM 객체(예를 들어 SQLAlchemy 모델)의 데이터를 올바르게 읽을 수 있도록 하기 위함이다.
> 일반적으로, Pydantic 모델은 입력 데이터를 딕셔너리로 가정하고 처리(즉, id = data["id"]와 같은 방식으로 데이터를 읽는다)한다.
> 따라서 ORM 객체는 딕셔너리가 아니므로, ORM 객체의 어트리뷰트를 직접 읽지 못한다.
> 
> 그래서 orm_mode = True를 설정하여, Pydantic 모델이 ORM 객체의 속성을 직접 읽을 수 있게 한다. 
> 설정을 통해 Pydantic모델이 데이터를 읽을 때 다음 두 가지 방식을 모두 사용할 수 있다.
> - 딕셔너리에서 값을 가져온다. (예: id = data["id"])
> - 객체의 속성에서 값을 가져온다. (예: id = data.id)

### orm_mode =True로 가능해진 것
```python
class User(UserBase):
id: int
is_active: bool
items: List[Item] = []

class Config:
    orm_mode = True
```
- User().items에 접근이 가능(이전에는 orm 속성을 직접 읽을 수 없어 불가능). 
  - orm_mode 없이 SQLAlchemy를 API에서 리턴해버리면 릴레이션 데이터를 로딩하지 않고 리턴하게 된다.
  - orm_mode=False인 Pydantic은 user와 item의 릴레이션 관계를 알지 못하기 때문이다.
  - orm_mode=True 설정 후 SQLAlchemy를 리턴하면, pydantic모델로 변환 과정에서 데이터를 액세스 하게 되고 릴레이션 데이터를 불러와서 같이 리턴해준다.
  - 같은 맥락에서 User().items[0].id도 접근이 가능하다.
- Pydnatic Model을 생성할 때 딕셔너리 또는 ORM 객체 모두를 입력으로 받을 수 있다.
  - pm = B(a=1, b=2, c=3)와 같이 딕셔너리를 전달하거나, pm = B(om)와 같이 ORM 객체를 전달하는 것 모두 가능
- ORM 객체를 반환하는 API 경로에서 Pydantic 모델을 사용할 수 있다.

## CRUD utils

```python
from sqlalchemy.orm import Session
from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()         # commit 함수를 이용해 데이터베이스에 반영
    db.refresh(db_user) # refresh 함수를 이용해 데이터베이스의 데이터를 최신으로 갱신
    return db_user


def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()


def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
    db_item = models.Item(**item.dict(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
```

## ROUTER
```python
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 아래의 router함수들은 crud로 ORM Model을 사용하지만 response_model이 Pydantic Model이기 때문에 Schema 내용대로 response data를 응답한다.
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/items/", response_model=schemas.Item)
def create_item_for_user(
    user_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)
):
    return crud.create_user_item(db=db, item=item, user_id=user_id)


@app.get("/items/", response_model=list[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items
```

## DB에 Middleware 추가하기
```python
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response


# Dependency
def get_db(request: Request):
    return request.state.db


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

...
```

### 미들웨어와 디펜던시 + yield 차이
- 미들웨어는 좀더 많은 코드와 복잡도를 요구한다
- 미들웨어는 async funtion이여야 한다.
- 만약 미들웨어에 wait가 있을경우 퍼포먼스에 문제가 생길수 있다.
- 미들웨어는 매 리퀘스트마다 실행되므로 매 리퀘스트마다 DB에 접속한다
- 마지막 이유로 미들웨어에 db를 쓰지말고 Dependency + yield 조합이 권장된다.


<h1 id = "36">파일 구조</h1>

## FastAPI 공식문서에서 권장하는 파일 구조
- FastAPI 인스턴스를 여러 개 생성하고, 이들을 주 애플리케이션에 마운트(mount)하여 어플리케이션의 구조를 나눈다(서브 어플리케이션).
```cmd
.
├── app
│   ├── __init__.py
│   ├── main.py
│   ├── dependencies.py
│   └── routers
│   │   ├── __init__.py
│   │   ├── items.py
│   │   └── users.py
│   └── internal
│       ├── __init__.py
│       └── admin.py
```

## router 쪼개기(in routers folder)
- APIRouter()를 선언하고 해당 router들이 공통적으로 적용되는 속성들을 설정한다.
```python
router = APIRouter(
    prefix="/items",
    tags=["items"],
    dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
) 

...
@router.put(
    "/{item_id}",
    tags=["custom"],
    responses={403: {"description": "Operation forbidden"}},
)
def item_id(...): ...
```
- global하게 tags와 response를 지정해줘도 또한번 추가로 tags와 reponse를 추가 가능하다.
- item_id 라우터 함수는 ["items", "custom"] 두 개의 태그를 가지며, reponse도 404와 403을 가지게 된다.

## dependencies.py
- 애플리케이션의 여러 위치(라우터들)에서 사용되는 종속성들을 정의해놓은 모듈
- 예시
```python
from typing import Annotated

from fastapi import Header, HTTPException


async def get_token_header(x_token: Annotated[str, Header()]):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def get_query_token(token: str):
    if token != "jessica":
        raise HTTPException(status_code=400, detail="No Jessica token provided")
```

## main.py에 router 모듈 합치기
```python
from fastapi import Depends, FastAPI
from .dependencies import get_query_token, get_token_header
from .internal import admin
from .routers import items, users


app = FastAPI(dependencies=[Depends(get_query_token)])


app.include_router(users.router)
app.include_router(items.router)

# routers.admin 모듈을 수정하지 않고, 커스텀 세팅하여 재세팅이 가능하다.
app.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_token_header)],
    responses={418: {"description": "I'm a teapot"}},
)


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
```

<h1 id = "37">백그라운드 작업</h1>

- 모듈: `fastapi.BackgroundTasks`
- 응답 반환 후 실행할 백그라운드 작업 정의
  - 작업을 수행한 후 전송되는 이메일 알림
  - 처리에 오랜 시간이 걸리는 데이터를 받았을 때 "Accepted" (HTTP 202)을 반환하고, 백그라운드에서 데이터를 처리
- 코드
    ```python
    from fastapi import BackgroundTasks
    ...
    def write_notification(email: str, message=""):
        with open("log.txt", mode="w") as email_file:
            content = f"notification for {email}: {message}"
            email_file.write(content)
    
    @app.post("/send-notification/{email}")
    async def send_notification(email: str, background_tasks: BackgroundTasks):
        background_tasks.add_task(write_notification, email, message="some notification")
        return {"message": "Notification sent in the background"} 
    ```
  - `add_task`함수를 통해 백그라운드 작업 개체에 전달

## 의존성 주입
- FastAPI에서는 BackgroundTasks를 종속성 주입 시스템과 함께 사용할 수 있음
- 코드
    ```python
    from typing import Union
    
    from fastapi import BackgroundTasks, Depends, FastAPI
    
    app = FastAPI()
    
    
    def write_log(message: str):
        with open("log.txt", mode="a") as log:
            log.write(message)
    
    
    def get_query(background_tasks: BackgroundTasks, q: Union[str, None] = None):
        if q:
            message = f"found query: {q}\n"
            background_tasks.add_task(write_log, message)
        return q
    
    
    @app.post("/send-notification/{email}")
    async def send_notification(
        email: str, background_tasks: BackgroundTasks, q: str = Depends(get_query)
    ):
        message = f"message to {email}\n"
        background_tasks.add_task(write_log, message)
        return {"message": "Message sent"}
    ```
  - send_notification 함수의 background_tasks와 get_query의 background_tasks는 동일한 객체를 참조하고 있다.
  - get_query에서 추가된 백그라운드 작업과 send_notification에서 추가된 백그라운드 작업은 모두 동일한 BackgroundTasks 객체를 공유
  - 따라서 이러한 백그라운드 작업은 모두 함께 처리되며, FastAPI는 모든 작업을 적절하게 관리하여 나중에 백그라운드에서 실행

<h1 id = "38">정적 파일</h1>

## 마운팅?

- "마운팅"은 특정 경로에 완전히 "독립적인" 애플리케이션을 추가하는 것을 의미하는데, 그 후 모든 하위 경로에 대해서도 적용

- 모듈: `fastapi.staticfiles.StaticFiles`
- 특정 경로에 StaticFiles() 인스턴스를 "마운트"
- 코드
    ```python
    from fastapi import FastAPI
    from fastapi.staticfiles import StaticFiles
    
    app = FastAPI()
    
    app.mount("/static", StaticFiles(directory="static"), name="static")
    ```
  - "/static"은 이 "하위 응용 프로그램"이 "마운트"될 하위 경로
  - 'directory="static"은 정적 파일이 들어 있는 디렉토리의 이름
  - name="static"은 FastAPI에서 내부적으로 사용할 수 있는 이름을 제공

<h1 id = "39">test code</h1>

- 모듈: `fastapi.testclient.TestClient` 또는 `from starlette.testclient.TestClient`
- `pip install httpx` 설치 필요
- 네이밍 컨벤션: `test_`로 시작
- 테스트 함수는 async나 await 키워드를 사용하지 않음
- 파일 구조 분리
    ```cmd
    .
    ├── app
    │    ├── __init__.py
    │    ├── main.py
    │    └── test_main.py
    ```
- 코드
    ```python 
    from fastapi.testclient import TestClient
    
    from .main import app # main.py 모듈
    
    client = TestClient(app)
    
    
    def test_read_main():
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"msg": "Hello World"}
    ```
## assert
```python
assert 조건, "예외 메시지"
``` 
- 디버깅과 테스트 목적으로 사용(일반적으로 오류 처리나 예외 처리의 대체로 사용되어서는 안 됨)
- 주어진 조건이 True(참)이면 아무런 작업을 하지 않고, False(거짓)이면 AssertionError 예외를 발생
- 주로 코드 내에서 특정 조건이 만족되는지를 확인하고, 그렇지 않으면 프로그램을 중단하고 오류를 보고하는 데 사용

## 또 다른 예시
- GET 경로 함수는 error를 반환할 것
- POST 경로 함수는 심각한 오류를 반환할 것
- 두 경로함수 모두 X-Token Header를 필요로 한다.

### main.py
```python
from typing import Annotated

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

fake_secret_token = "coneofsilence"

fake_db = {
    "foo": {"id": "foo", "title": "Foo", "description": "There goes my hero"},
    "bar": {"id": "bar", "title": "Bar", "description": "The bartenders"},
}

app = FastAPI()


class Item(BaseModel):
    id: str
    title: str
    description: str | None = None


@app.get("/items/{item_id}", response_model=Item)
async def read_main(item_id: str, x_token: Annotated[str, Header()]):
    if x_token != fake_secret_token:
        raise HTTPException(status_code=400, detail="Invalid X-Token header")
    if item_id not in fake_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return fake_db[item_id]


@app.post("/items/", response_model=Item)
async def create_item(item: Item, x_token: Annotated[str, Header()]):
    if x_token != fake_secret_token:
        raise HTTPException(status_code=400, detail="Invalid X-Token header")
    if item.id in fake_db:
        raise HTTPException(status_code=400, detail="Item already exists")
    fake_db[item.id] = item
    return item 
``` 

### test_main.py
```python
from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_read_item():
    response = client.get("/items/foo", headers={"X-Token": "coneofsilence"})
    assert response.status_code == 200
    assert response.json() == {
        "id": "foo",
        "title": "Foo",
        "description": "There goes my hero",
    }


def test_read_item_bad_token():
    response = client.get("/items/foo", headers={"X-Token": "hailhydra"})
    # 오류를 반환할 때
    assert response.status_code == 400
    
    # Header값이 일치 하지 않을 때
    assert response.json() == {"detail": "Invalid X-Token header"}


def test_read_inexistent_item():
    response = client.get("/items/baz", headers={"X-Token": "coneofsilence"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}


def test_create_item():
    response = client.post(
        "/items/",
        headers={"X-Token": "coneofsilence"},
        json={"id": "foobar", "title": "Foo Bar", "description": "The Foo Barters"},
    )
    assert response.status_code == 200
    assert response.json() == {
        "id": "foobar",
        "title": "Foo Bar",
        "description": "The Foo Barters",
    }


def test_create_item_bad_token():
    response = client.post(
        "/items/",
        headers={"X-Token": "hailhydra"},
        json={"id": "bazz", "title": "Bazz", "description": "Drop the bazz"},
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid X-Token header"}


def test_create_existing_item():
    response = client.post(
        "/items/",
        headers={"X-Token": "coneofsilence"},
        json={
            "id": "foo",
            "title": "The Foo ID Stealers",
            "description": "There goes my stealer",
        },
    )
    assert response.status_code == 409
    assert response.json() == {"detail": "Item already exists"}
```
값을 전달해야할 때
- 경로변수: URL에 추가한다.
- request body에 json데이터를 추가해야할 때: Python의 dict를 json파라미터로 전달한다.
- request body에 form데이터를 추가해야할 때: Python의 dict를 data파라미터로 전달한다.
- header를 추가해야할 때: Python의 dict를 headers 파라미터로 추가한다.
- cookie를 추가해야할 때: Python의 dict를 cookies 파라미터로 추가한다.
- 주의: Pydantic 모델은 전달 데이터가 될 수 없으니, 만약 사용학고 싶으면 jsonable_encoder를 사용하면 된다.

## Test file 실행하기
- pip install pytest
- console에 `pytest`입력하고 실행