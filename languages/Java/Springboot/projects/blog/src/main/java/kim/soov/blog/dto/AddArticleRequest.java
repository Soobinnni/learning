package kim.soov.blog.dto;

import kim.soov.blog.domain.Article;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddArticleRequest {
    /*
        목적: 블로그에 글을 추가하는 서비스를 추가하기 위해
            서비스 계층에서 요청을 받을 객체인 AddArticle클래스 정의
    */
    private String title;
    private String content;

    public Article toEntity(){
        // DTO를 Entity로 전환(빌더 패턴).
        // 블로그 글을 저장할 엔티티로 변환하는 용도
        return Article.builder()
                .title(title)
                .content(content)
                .build();
    }
}
