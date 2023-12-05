import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id : "1",
        text: "first one",
        userId: "2"
    },
    {
        id : "2",
        text: "second one",
        userId: "1"
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
    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        allUsers: [User!]!
        allMovies:[Movie!]!
        movie(id:String!): Movie
    }
    type Mutation {
        postTweet(text:String!, userId: ID!): Tweet!
        """Deletes a Tweet if found, else returns false"""
        deleteTweet(userId: ID!): Boolean!
    }
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
`;

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
            console.log('allUsers is called!')
            return users;
        },
        allMovies(){
            return fetch("https://yts.mx/api/v2/list_movies.json")
            .then((r) => r.json())
            .then(json => json.data.movies)
        },
        movie(root, {id}){
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
            .then((r) => r.json())
            .then(json => json.data.movie);
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
        fullName({firstName, lastName}){
            return firstName + ' ' + lastName;
        }
    },
    Tweet: {
        author({userId}){
            return users.find(user => user.id === userId)
        }
    }
}
const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({url}) =>{
    console.log(`Running on ${url}`)
})