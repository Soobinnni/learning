package com.mysite.sbb.question.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mysite.sbb.question.entity.Question;

import java.util.List;

//  JpaRepository는 Spring Data JPA에서 제공하는 인터페이스로, 스프링 부트 애플리케이션에서 자동으로 빈으로 등록.
// 따라서 개발자가 별도로 @Repository 어노테이션을 명시적으로 추가할 필요가 없다.
public interface QuestionRepository extends JpaRepository<Question, Long>{
	// 특정 property를 where절로 검색하기 위해서 interface에 등록한다.
	Question findBySubject(String subject);
	
	// and조건 등록은 And연산자를 사용한다.
	Question findBySubjectAndContent(String subject, String content);
	
	// Like문
    List<Question> findBySubjectLike(String subject);
}
