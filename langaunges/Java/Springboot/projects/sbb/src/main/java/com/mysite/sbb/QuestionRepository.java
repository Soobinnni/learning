package com.mysite.sbb;

import org.springframework.data.jpa.repository.JpaRepository;

//  JpaRepository는 Spring Data JPA에서 제공하는 인터페이스로, 스프링 부트 애플리케이션에서 자동으로 빈으로 등록.
// 따라서 개발자가 별도로 @Repository 어노테이션을 명시적으로 추가할 필요가 없다.
public interface QuestionRepository extends JpaRepository<Question, Long>{

}
