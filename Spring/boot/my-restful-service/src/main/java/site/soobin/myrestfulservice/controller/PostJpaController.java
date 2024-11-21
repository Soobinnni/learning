package site.soobin.myrestfulservice.controller;

import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import site.soobin.myrestfulservice.entity.Post;
import site.soobin.myrestfulservice.entity.User;
import site.soobin.myrestfulservice.exception.BaseResponseException;
import site.soobin.myrestfulservice.exception.enums.UserErrorCode;
import site.soobin.myrestfulservice.repository.PostRepository;
import site.soobin.myrestfulservice.repository.UserRepository;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jpa")
public class PostJpaController {
  private final PostRepository postRepository;
  private final UserRepository userRepository;

  @GetMapping("/posts")
  public List<Post> retreiveAllPosts() {
    return postRepository.findAll();
  }

  // user의 posts 목록 가져오기
  @GetMapping("/user/{id}/posts")
  public List<Post> retreiveAllPostsByUser(@PathVariable int id) {
    User targetUser =
        userRepository
            .findById(id)
            .orElseThrow(() -> new BaseResponseException(UserErrorCode.USER_NOT_FOUND));
    return targetUser.getPosts();
  }

  @PostMapping("/user/{id}/posts")
  public ResponseEntity<Post> createPost(@PathVariable int id, @RequestBody Post post) {
    User targetUser =
        userRepository
            .findById(id)
            .orElseThrow(() -> new BaseResponseException(UserErrorCode.USER_NOT_FOUND));
    Post createdPost = Post.builder(targetUser, post.getDescription()).build();
    postRepository.save(createdPost);

    URI location =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/user/{id}/posts")
            .buildAndExpand(post.getId())
            .toUri();
    return ResponseEntity.created(location).body(createdPost);
  }
}
