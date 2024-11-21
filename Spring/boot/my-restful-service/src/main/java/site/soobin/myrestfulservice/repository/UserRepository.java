package site.soobin.myrestfulservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import site.soobin.myrestfulservice.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {}
