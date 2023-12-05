# REST API를 GraphQL API로 변환하기
- graphql은 data를 어디서 가져올 지 resolvers의 함수들에 return으로 로직을 구성하면 그것이 typeDefs와 일치하다면 return해줌
```javascript
  // ----------------typeDefs----------------
    const typeDefs = gql`
        type Movie {
            id: Int!
            url: String!
            imdb_code: String!
            title: String!
            title_english: String!
            title_long: String!
            slug: String!
            year: Int!
            rating: Float!
            runtime: Float!
            genres: [String]!
            summary: String
            description_full: String!
            synopsis: String
            yt_trailer_code: String!
            language: String!
            background_image: String!
            background_image_original: String!
            small_cover_image: String!
            medium_cover_image: String!
            large_cover_image: String!
        }
        type Query {
            allMovies: [Movie!]!
        }
    `;
  // ----------------resolvers----------------
  const resolvers = {
    Query {
        allMovies(){
            return fetch("https://yts.mx/api/v2/list_movies.json")
            .then((r) => r.json())
            .then(json => json.data.movies)
        }
    }
  }
  // ----------------query----------------
  query{
    allMovies{
        genres
        id
        title
        rating
        summary
    }
    }
  // ----------------response----------------
    {
    "data": {
        "allMovies": [
        {
            "genres": [
            "Documentary"
            ],
            "id": 58094,
            "title": "Once Upon a Time in Uganda",
            "rating": 7.4,
            "summary": ""
        },
        {
            "genres": [
            "Comedy"
            ],
            "id": 58092,
            "title": "How the Gringo Stole Christmas",
            "rating": 0,
            "summary": ""
        }
        }
    }
```

## id로 단일 movie 정보 get하기
```javascript
  // ----------------typeDefs----------------
    const typeDefs = gql`
        ...
        type Query {
            movie(id:String!): Movie
        }
    `;
  // ----------------resolvers----------------
  const resolvers = {
    Query {
        movie(root, {id}){
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
            .then((r) => r.json())
            .then(json => json.data.movie);
        }
    }
  }
  // ----------------query----------------
  query{
    movie(id: "41438") {
        id
        title
        genres
    }
    }
  //또는
  query($movieId: String!){
    movie(id: $movieId) {
        id
        title
        genres
    }
    }
  // ----------------response----------------
    {
    "data": {
        "movie": {
        "id": 41438,
        "title": "Kazn",
        "genres": [
            "Action",
            "Crime",
            "Mystery",
            "Thriller"
        ]
        }
    }
    }
```