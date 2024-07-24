const SERVER_ARTICLE = process.env.REACT_APP_SERVER + 'api/articles';

export async function getArticleList({ signal }) {
    const url = SERVER_ARTICLE;

    const response = await fetch(url, { signal });

    if (!response.ok) {
        const error = new Error();
        error.code = response.status;
        error.info = await response.json();

        throw error;
    }

    /*
    [
        {
            "title": "제목1",
            "content": "내용1"
        },
        {
            "title": "제목2",
            "content": "내용2"
        },
        {
            "title": "제목3",
            "content": "내용3"
        }
    ]
    */
    const articles = await response.json();


    return articles;
}