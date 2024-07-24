package kim.soov.blog.dto;

import java.time.LocalDateTime;
import kim.soov.blog.domain.Article;
import lombok.Getter;

@Getter
public class ArticleResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;

    public ArticleResponse(Article article){
        this.id=article.getId();
        this.title=article.getTitle();
        this.content=article.getContent();
        this.createdAt=article.getCreatedAt();
    }
}
