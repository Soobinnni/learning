package kim.soov.blog.service;

import jakarta.transaction.Transactional;
import java.util.List;
import kim.soov.blog.domain.Article;
import kim.soov.blog.dto.AddArticleRequest;
import kim.soov.blog.dto.UpdateArticleRequest;
import kim.soov.blog.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class BlogService {
    private final BlogRepository blogRepository;

    // article create
    public Article save(AddArticleRequest request){
        return blogRepository.save(request.toEntity());
    }

    // article list read
    public List<Article> findAll(){
        return blogRepository.findAll();
    }

    // article read
    public Article findById(Long id){
        return blogRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("not found: "+ id));
    }

    // delete article
    public void delete(Long id){
        blogRepository.deleteById(id);
    }

    // update article
    @Transactional
    public Article update(Long id, UpdateArticleRequest request){
        Article article = blogRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("not found: "+id));

        article.update(request.getTitle(), request.getContent());

        return article;
    }
}
