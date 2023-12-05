# Apollo Server
- [공식문서](https://www.apollographql.com/docs/)
- Apollo Server는 GraphQL을 위한 오픈 소스 JavaScript GraphQL 서버 라이브러리
- Apollo 서버는 Apollo 클라이언트를 포함한 모든 GraphQL 클라이언트와 호환되는 사양 준수(spec-compliant)의 오픈 소스 GraphQL 서버
- Apollo Server는 GraphQL 쿼리를 받아들이고 처리하여 클라이언트에게 요청된 데이터를 응답하는 역할
- 사용할 수 있는 자체 문서화 가능한 production-ready GraphQL API를 구축하는 가장 좋은 방법


# 실습
## 설치
```javascript
// console
npm init -y
npm install apollo-server graphql
npm i nodemon -D
```
## 오류가 발생하는 이유
> `Apollo Server requires either an existing schema, modules or typeDefs`
- rest api가 많은 url의 집합이라면, graphql은 `많은 type`들의 집합! 
  - graphql server에게 서버에 있는 data의 type을 설명해줘야 한다(즉, data shape을 server에 알려줘야 함).
  - return 하려는 data, 사용자가 보낼 수 있는 request, 사용자가 쓸 수 있는 query 등

# typeDefs와 resolvers
GraphQL의 `typeDefs`와 `resolvers`는 각각 스키마 정의와 해당 스키마에 대한 동작을 제어(각각의 필드에 대한 실제 데이터 로직을 제공)하는 데 사용된다. 이 둘을 함께 사용하여 GraphQL 서비스를 완성한다.

1. **typeDefs (타입 정의):**
   - `typeDefs`는 GraphQL 스키마를 정의하는데 사용
   - 스키마는 어떤 데이터가 요청될 수 있는지, 그 데이터가 어떤 형식으로 반환되는지를 명시
   - GraphQL 스키마에는 객체 유형, 쿼리, 뮤테이션 및 기타 필수적인 구조를 정의하는데 사용되는 여러 유형의 타입이 포함.

2. **resolvers (해석기):**
   - `resolvers`는 `typeDefs`에 정의된 각각의 필드에 대한 실제 로직을 제공.
   - 각 필드에 대한 해석기 함수를 제공하여 해당 필드에서 어떤 동작을 수행할지 정의.
   - `resolvers`는 일반적으로 데이터베이스에서 데이터를 가져오거나 외부 서비스와 상호 작용하는 등의 작업을 수행.

     ```javascript
     const resolvers = {
       Query: {
         getUser: (parent, { id }, context, info) => {
           // id를 사용하여 데이터를 가져오는 로직
         },
         getAllUsers: (parent, args, context, info) => {
           // 모든 사용자 데이터를 가져오는 로직
         },
       },
       User: {
         // User 객체 타입의 각 필드에 대한 해석기 함수 정의
         // 예를 들어, email 필드를 해석하는 로직
         email: (parent, args, context, info) => {
           // 어떻게 email을 가져올 것인지에 대한 로직
         },
       },
     };
     ```
<br>

# typeDefs정의
- 모든 것은 ``안에 정의되어야 한다.
- `` 안에 정의되는 것은 `schema definition language(SDL)` 즉 data의 shape(SDL은 graphql에게 data의 shape을 알려주기 위한 언어)
```javascript
    const typeDefs = gql``

```

- SDL cf. graphql query language: 아래 문장은 graphql의 `query language`
```graphql
{
  allFilms {
    totalCount
    films {
      title
    }
  }
}
```


# Query
- const typeDefs에 필수적으로 정의해야할 것 : Query
- custom type이나 scalar type의 get할 query들을 작성
- 아래 문장은 rest api에서 /text url을 만드는 것과 같음. 그리고 반환을 string타입으로 한다는 것까지 알 수 있다.
- Query type에 무엇을 넣든, rest API에서 GET request url을 노출시키는 것과 같다.
    ```javascript
        const typeDefs = gql`
            type Query {
            text : String  
            }
        `
    ```

# Scalar type
- graphql에 built-in 즉 내장되어 있는 type
    - String, Int, Boolean, ID

# Custom Type
- 예를 들어, allTweet처럼 모든 tweet정보를 response data로 하고 싶을 때, 사용자 정의 type을 정의한다.(Object처럼 )
    ```javascript
    type Tweet {
        id:ID
        text:String
    }
    type Query {
        ...
        # 사용자가 allTweets을 request하면, Tweet타입을 요소로 담은 list를 response data로 반환
        
        allTweets: [Tweet]
    }
    ```
- type끼리 의존성 만들기
  - Tweet타입이 User 타입에 의해서 만들어졌다고 가정했을 때
    ```javascript
    type User {
        id: ID
        username: String
    }
    type Tweet {
        id:ID
        text:String
        author: User
    }
    ```
    - 위 코드로서, database에서의 관계가 설정된다.

- 원하는 조건의 데이터 request하기
  - cf. 도메인/tweets/:id ()처럼 id가 n인 tweet을 return 받고 싶을 때
  - =>argument를 이용한다(tweet(id: ID)).
  ```javascript
    type Query {
        allTweets: [Tweet]
        tweet(id: ID): Tweet
    }
  ```
  - argument를 이용한 request
  ```javascript
  {
    allTweets {
      text
    }
    tweet(id:"1") {
      author{
        username
      }
    }
  }
  ```

# Mutation type
  - cf. Rest API에서의 POST 요청
  - user가 보낸 datat로 mutate하는 동작들을 모두 서술한다. 즉 database를 mutate하게 된다면 mutation 안에 작성한다.
  - 아래 문장은 'tweet' 타입을 post하는 동작을 서술하며, user는 post할 데이터로 text와 userId를 보낸다. 그리고 postTweet은 response데이터로 user가 보낸 데이터를 기반으로 생성된 Tweet을 보낸다.
    ```javascript
    `
      type Mutation {
        postTweet(text:String, userId: ID): Tweet
        deleteTweet(userId: ID): Boolean
      }
    `
    ```
  - 이처럼, user가 data를 단지 받고만 싶다면 type Query에, user가 데이터를 등록, 수정, 삭제하고 싶다면 type Mutation에 작성한다.
  - 즉 C는 query에, RUD는 모두 mutation에 작성하며, Rest API처럼 하나의 URL로 CRUD가 이루어지지 않기 때문에 post, delete, update mutation은 각각 작성해주어야 한다.



- query와 mutation 호출하기
  - 보통 query language를 작성할 때 default는 query
    ```javascript
      {
      allTweets {
        id
        text
        author {
          username
        }
      }
      tweet(id:1) {
        id
        text
        author {
          id
          username
        }
      }
    }

    // 같음
      query {
              allTweets {
                id
                text
                author {
                  username
                }
              }
              tweet(id:1) {
                id
                text
                author {
                  id
                  username
                }
              }
        }
    ```
- 하지만 mutation을 호출하기 위해선, mutation이라고 명시가 필요
  ```javascript
  mutation {
    postTweet(text:"Hello", userId:"1") {
      text
    }
  }
  ```

# !와 nullable field, nullable return
  - 모든 field는 기본적으로 nullable 즉, 
    ```javascript
      type Tweet {
          id:ID
          text:String
          author: User
      }
    ```
    에서 id는 null 또는 ID타입이, text는 null 또는 String타입이, author는 null 또는 User타입이 올 수 있음
  - 즉 database에서 nullable하지 않은 것에 graphql 역시 ! 를 붙이면 됨
  - 하지만, ! 를 타입 옆에 명시함으로써 required한 field임을 정해줄 수 있음
---
  - type Query의 경우 !를 표시할 경우 return이 null이 될 수 없음
    ```javascript
        const typeDefs = gql`
            type Query {
                // 1
                allTweets: [Tweet!]!
                // 2
                tweet(id: ID!): Tweet
            }
            type Mutation {
                // 3
                postTweet(text:String!, userId: ID!): Tweet!
                // 4
                deleteTweet(userId: ID!): Boolean!
            }
        `;
    ```
    1 allTweets를 요청하면 리스트를 반환해야하고 그 원소는 반드시 Tweet이어야 한다. [Tweet]!이라면, null이 원소로 올 수 있음.
    
    2 tweet을 query하기 위해선 id를 반드시 제공해야하지만 해당 id를 가진 Tweet을 가지고 있지 않을 수 있기 때문에 Tweet은 nullable
    
    3 tweet을 post하기 위해선 text와 userId를 반드시 제공해야하고 return 값으로 반드시 Tweet을 반환해야한다.

    4 tweet을 delete하기 위해선 userId를 반드시 제공해야하고 return 값으로 반드시 Boolean을 반환해야한다.
  - 관련 에러
    >     "message" : "Cannot return null for non-nullable field Query.allTweets."