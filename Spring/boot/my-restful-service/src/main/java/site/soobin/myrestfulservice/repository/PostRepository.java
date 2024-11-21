package site.soobin.myrestfulservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import site.soobin.myrestfulservice.entity.Post;

public interface PostRepository extends JpaRepository<Post, Integer> {}
