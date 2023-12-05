# List
<a href="#1">typeDefs (타입 정의)와 resolvers (해석기)의 타입이 일치해야한다.</a>

<a href="#2">arguments가 있는 경우</a>

<a href="#3">Mutation resolvers 작성하기</a>

<a href="#4">dynamic field 만들기</a>

<a href="#5">root: first argument</a>

<a href="#6">Relationship</a>

<a href="#7">typeDefs (타입 정의)와 resolvers (해석기)의 타입이 일치해야한다.</a>

<a href="#8">typeDefs (타입 정의)와 resolvers (해석기)의 타입이 일치해야한다.</a>

## <span id = "1">typeDefs (타입 정의)와 resolvers (해석기)의 타입이 일치해야한다.<span>
스키마 정의에서 정의한 타입과 필드는 해석기 함수에서도 동일한 이름으로 정의되어야 GraphQL 서버가 요청된 쿼리의 필드를 해석할 때 해당 필드를 찾을 수 있다.

- 아래 예시는 query type의 tweet field를 요청하기 위해 resolvers를 작성한 자바스크립트 코드.

```javascript
// ---------------------typeDefs---------------------
const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String!
    }
    type Tweet {
        id:ID!
        text:String!
        author: User!
    }
    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
    }
    type Mutation {
        postTweet(text:String!, userId: ID!): Tweet!
        deleteTweet(userId: ID!): Boolean!
    }
`;
// ---------------------resolvers---------------------
const resolvers = {
    // type Query의 tweet과 이름 일치시킴
    Query: {
        tweet(){
            console.log("I'm called");
            return null;
        }
    }
}
```
- apollo server는 resolvers의 query type의 tweet function으로 가서 tweet을 가져오는 로직을 가진 resolvers의 함수를 호출하게 될 것.


## <span id = "2">arguments가 있는 경우<span>
- arguments가 있는 경우, resolvers 함수에 첫 번째 인자는 default로 root고, 우리가 전달해줄 arguments는 파라미터명을 args로 한다. 이것은 GraphQL의 명세.
- 즉 root는 resolver function의 항상 첫 번째 인자며, 두 번째 인자는 query나 mutation에서 유저가 보낸 argument가 된다.
- args는 전달 인자를 object타입으로 리턴
    ```javascript
    const resolvers = {
        Query : {
            tweet(root, args) {
                console.log(args) // { id : '1' }
                return null;
            }
        }
    }
    ```
- 중괄호로 리턴 값을 특정할 수 있음
    ```javascript
    const resolvers = {
        Query : {
            tweet(root, {id}) {
                console.log(id) // '1'
                // 아래 문장은 실제 데이터베이스에 접근하는 어떤 SQL 코드로 대체될 것
                return tweets.find((tweet) => tweet.id === id);
            }
        }
    }
    ```
## <span id = "3">Mutation resolvers 작성하기<span>
- 참고) typeDefs
```javascript
    const typeDefs = gql`
        ...
        type Mutation {
            postTweet(text:String!, userId: ID!): Tweet!
            deleteTweet(userId: ID!): Boolean!
        }
    `;
```
```javascript
    const resolvers = {
        Query: {
            ...
        },
        Mutation: {
            postTweet(root ,{text, userId}) {
                const newTweet = {
                    id:tweets.length +1,
                    text
                }
                tweets.push(newTweet) // 역시 이건 임시 코드일 뿐, 나중에 sql문으로 변경될 것
                return newTweet //typeDefs에서 postTweet의 return은 non-nullable의 Tweet
            },
            deleteTweet(root, {userId}){
                const tweet = tweets.find(tweet => tweet.id === userId)
                if (!tweet) return false;
                tweets = tweets.filter(tweet => tweet.id !== id)
                return true;
            }
        }
    }
```
---
- mutation query작성하기
```javascript
mutation {
    postTweet(text:"I'm new!", userId:"1"){ //1은 임의
        id
        text
    },
    deleteTweet(userId: "2")
}
```

<br>

## <span id = "4">dynamic field 만들기<span>
### 모든 typeDefs에 정의내려진 type들에 대해서 resolvers의 함수로 정의할 수 있다.
- 예를 들어, firstName과 lastName을 합쳐서 만들어지는 fullName field가 있다고 가정했을 때,
  ```javascript
  // ----------------database----------------
    let users = [
        {
            id : "1",
            firstName: "nico",
            lastName: "las"
        },
    ]
    ...
  // ----------------typeDefs----------------
    const typeDefs = gpl`{
        type User = {
            id:String!
            fullName:String!
            firstName:String!
            lastName:String!
        }
        type Query = {
            allUsers:[User!]!
        }        
    }`

  // ----------------resolvers----------------
    const resolvers = {
    Query: {
        allUsers(){
            return users;
        }
    },
    }
  // ----------------query----------------
  query {
    allUsers {
        id
        fullName
        firstName
        lastName
    }
  }
  ```
  오류 발생 ∵ database에 fullName이 없기 때문에
  >      "message": "Cannot return null for non-nullable field User.fullName.",

- 따라서, type User를 resolvers의 함수로 정의내려서 dynamic하게 만든다!
  ```javascript
    const resolvers = {
        Query: {
            allTweets(){
                return tweets;
            },
            tweet(root, {id}) {
                console.log(id) // '1'
                // 아래 문장은 실제 데이터베이스에 접근하는 어떤 SQL 코드로 대체될 것
                return tweets.find((tweet) => tweet.id === id);
            },
            allUsers(){
                return users;
            }
        },
        Mutation: {
            postTweet(root ,{text, userId}) {
                const newTweet = {
                    id:tweets.length +1,
                    text,
                }
                tweets.push(newTweet) // 역시 이건 임시 코드일 뿐, 나중에 sql문으로 변경될 것
                return newTweet //typeDefs에서 postTweet의 return은 non-nullable의 Tweet
            },
            deleteTweet(root, {userId}){
                const tweet = tweets.find(tweet => tweet.id === userId)
                if (!tweet) return false;
                tweets = tweets.filter(tweet => tweet.id !== id)
                return true;
            }
        },
        User: {
            fullName(){
                return "KIM SOOBIN"
            }
        }
    }
  ```

  - 결과
  ```javascript
    // operation
    query {
    allUsers {
        id
        firstName
        lastName
        fullName
    }
    }
    // response
    {
    "data": {
        "allUsers": [
        {
            "id": "1",
            "firstName": "nico",
            "lastName": "las",
            "fullName": "KIM SOOBIN"
        }
        ]
    }
    }
  ```
  - 원리 : database에 fullName가 발견되지 않았을 때 graphql이 resolvers를 살펴봤을 때 fullName이라는 함수가 발견되어 그 return값을 field 내용으로 채워 반환
    - graphql이 allUsers resolvers를 호출 > 이후 fullName resolvers를 호출


## <span id = "5">root: first argument<span>
- fullName은 반환되는 Users에 fullName이란 field가 없는 것이 확인되고 호출됨. 
- 이때 fullName의 첫 번째 인자 root는 fullName을 호출하는 User
- 즉 fullName을 호출하는 object의 data를 root를 통해 얻을 수 있다
  ```javascript
  // ----------------database----------------
    let users = [
        {
            id : "1",
            firstName: "nico",
            lastName: "las"
        },
        {
            id : "2",
            firstName: "soob",
            lastName: "kim"
        },
    ]
    ...
  // ----------------typeDefs----------------
    const typeDefs = gpl`{
        type User = {
            id:String!
            fullName:String!
            firstName:String!
            lastName:String!
        }
        type Query = {
            allUsers:[User!]!
        }        
    }`

  // ----------------resolvers----------------
    const resolvers = {
    Query: {
        allUsers(){
            console.log('allUsers is called!')
            return users;
        }
    },
    User: {
        fullName(root){
            console.log('fullName is called!')
            console.log(root)
            return "KIM SOOBIN";
        }
    },
    }
  // ----------------query----------------
  query {
    allUsers {
        id
        firstName
        lastName
        fullName
    }
    }
  // ----------------console----------------
    allUsers is called!
    fullName is called!
    { id: '1', firstName: 'nico', lastName: 'las' }
    fullName is called!
    { id: '2', firstName: 'soob', lastName: 'kim' }
  ```

- 따라서 아래와 같이 firstName과 lastName을 합칠 수 있다
```javascript

  // ----------------resolvers----------------
    const resolvers = {
    User: {
        fullName({firstName, lastName}){
            return firstName + ' ' + lastName;
        }
    },
    }
```


## <span id = "6">Relationship<span>
- root를 활용하여 데이터 간 relationship 설정
- type Tweet은 author를 가지고 있는데 이는 type User. 둘의 관계 설정은 userId로 매개.
- author resolver함수의 첫 번째 인자 root는 해당 함수를 호출한 tweet object > tweet object는 userId를 가지고 있으므로 userId를 통해 author의 정보 추출
  ```javascript
  // ----------------database----------------
    let tweets = [
        {
            id : "1",
            text: "first one",
            userId: "2"
        },
        {
            id : "2",
            text: "second one"
        }
    ]
    let users = [
        {
            id : "1",
            firstName: "nico",
            lastName: "las"
        },
        {
            id : "2",
            firstName: "soob",
            lastName: "kim"
        },
    ]
    ...
  // ----------------typeDefs----------------
    const typeDefs = gpl`{
        type Tweet = {
            id:String!
            text:String!
            author:User
        }
        type Query = {
            allTweets:[Tweet!]!
        }        
    }`

  // ----------------resolvers----------------
    const resolvers = {
    Query: {
        allTweets(){
            return tweets;
        }
    },
    Tweet: {
        author({userId}){
            return users.find(user => user.id === userId)
        }
    },
    }
  // ----------------query----------------
  query {
    allTweets  {
        id
        text
        author {
        fullName
        }
    }
    }
  // ----------------response----------------
    {
    "data": {
        "allTweets": [
        {
            "id": "1",
            "text": "first one",
            "author": {
            "fullName": "soob kim"
            }
        },
        {
            "id": "2",
            "text": "second one",
            "author": {
            "fullName": "nico las"
            }
        }
        ]
    }
    }
  ```

## Documentation
- typeDefs에 type들을 정의내릴 때, type 앞에 """type의 설명을 적어주면""" document화할 수 있음
  ```javascript
    const typeDefs = gql`
        type User {
            id: ID!
            """Is the sum of firstName + lastName as a string"""
            fullName: String!
            firstName: String!
            lastName: String!
        }
        """Tweet에 대한 설명"""
        type Tweet {
            id:ID!
            text:String!
            author: User
        }
        ...
        type Mutation {
            postTweet(text:String!, userId: ID!): Tweet!
            """Deletes a Tweet if found, else returns false"""
            deleteTweet(userId: ID!): Boolean!
        }
    `;
  ```
- [document를 확인할 수 있는 사이트](https://altair.sirmuel.design/)