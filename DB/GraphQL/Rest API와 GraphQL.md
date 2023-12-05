# Rest API의 단점
- 먼저 장점은, METHOD에 따라 URL요청을 처리하는 방식이 간단

# GraphQL
- [공식 사이트](https://graphql.org)
- [specification](https://github.com/graphql/graphql-spec)
- Rest API의 단점을 보완하기 위해 등장한 기술
  
  -  **`over-fetching` 문제점을 해결**
    
        rest api -> 필요로 하는 데이터 이상의 데이터가 보내짐
        데이터 반환 속도가 느려질 수 있음

    ![image](https://github.com/graphql/graphql-spec/assets/111328823/4c56a5ac-10da-487a-b700-eca3918805ae)
    > graphql로는 url로 data를 즉시 받지 않는다.\
    대신 필요한 데이터를 요청한다.\
    (graphql query를 API에 보내면 정확히 요청한 것만 받을 수 있다.)
    
    <br>

    
     - **`over-fetching` 문제점을 해결**
       
           rest api -> 필요로 하는 데이터보다 적게 fetch할 가능성이 있음

           예를 들면, 영화의 장르를 알고 싶다면 a url로 get요청을 하여 영화
           id를 get한 후 id를 토대로 장르 url에 get요청을 해야함

       ![image](https://github.com/graphql/graphql-spec/assets/111328823/ddd407e5-b039-45dd-9aad-95c430804ca3)
       > 전형적인 rest API는 여러 개의 url에서 로딩이 필요하지만 graphql은 single request로 필요한 모든 data를 받을 수 있다.

# Rest API와 GraphQL
- GraphQL에서 query는 Rest API에서 GET request를 만드는 것과 같다고 볼 수 있음
- Rest API에 URL variable이 있다면(경로변수), GraphQL에선 argument로 표현