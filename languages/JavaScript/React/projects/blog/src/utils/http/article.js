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

export async function getArticleById({ signal, id }) {
    const url = SERVER_ARTICLE + `/${id}`;

    const response = await fetch(url, { signal });

    if (!response.ok) {
        const error = new Error();
        error.code = response.status;
        error.info = await response.json();

        throw error;
    }

    /*
        {
            "id": 12,
            "title": "MY FIRST BLOG POST",
            "content": "FIRST CONTENT!",
            "createdAt": "2024-07-24T17:54:28.772739"
        }
     */

    const article = await response.json();

    return article;
}

export async function deleteArticle({ id }) {
    const url = SERVER_ARTICLE + `/${id}`;

    const response = await fetch(url, {
        method: 'DELETE'
    })

    if (!response.ok) {
        const error = new Error();
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }
}