package com.mysite.sbb;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SbbApplicationTests {
    @Autowired
    private QuestionRepository questionRepository;

    @Test
    void testJpa() {        
    	String subject1 = "sbb가 무엇인가요?";
    	String content1 = "sbb에 대해서 알고 싶습니다.";
    
        Question q1 = new Question(subject1, content1);
        this.questionRepository.save(q1);  // 첫번째 질문 저장

    	String subject2 = "스프링부트 모델 질문입니다.";
    	String content2 = "id는 자동으로 생성되나요?";
        Question q2 = new Question(subject2, content2);
        this.questionRepository.save(q2);  // 두번째 질문 저장
    }

}
