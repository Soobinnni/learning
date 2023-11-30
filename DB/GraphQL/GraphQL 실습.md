# 실습해보기
- [실습 사이트](https://studio.apollographql.com/public/star-wars-swapi/variant/current/explorer)

- request
```graphql
{
  # over-fetching 극복  
  allFilms {
    totalCount
    films {
      title
    }
  }
  # under_fetching 극복 : ∵ 하나의 request로 allFilms와 allPeople에 대한 data를 모두 가져왔기 때문
  allPeople {
    people {
      name
      hairColor
      eyeColor
      birthYear
    }
  }
}
```

- response
```graphql
{
  "data": {
    "allFilms": {
      "totalCount": 6,
      "films": [
        {
          "title": "A New Hope"
        },
        {
          "title": "The Empire Strikes Back"
        },
        {
          "title": "Return of the Jedi"
        },
        {
          "title": "The Phantom Menace"
        },
        {
          "title": "Attack of the Clones"
        },
        {
          "title": "Revenge of the Sith"
        }
      ]
    },
    "allPeople": {
      "people": [
        {
          "name": "Luke Skywalker",
          "hairColor": "blond",
          "eyeColor": "blue",
          "birthYear": "19BBY"
        },
        {
          "name": "C-3PO",
          "hairColor": "n/a",
          "eyeColor": "yellow",
          "birthYear": "112BBY"
        },
        {
          "name": "R2-D2",
          "hairColor": "n/a",
          "eyeColor": "red",
          "birthYear": "33BBY"
        }
      ]
    }
  }
}
```