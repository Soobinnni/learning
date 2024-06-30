package com.mysite.sbb;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.mysite.sbb.entity.Question;
import com.mysite.sbb.repository.QuestionRepository;

@SpringBootTest
class SbbApplicationTests {
	@Autowired
	private QuestionRepository questionRepository;

//	@Test
	void testJpa() {
		String subject1 = "sbb가 무엇인가요?";
		String content1 = "sbb에 대해서 알고 싶습니다.";

		Question q1 = new Question(subject1, content1);
		this.questionRepository.save(q1); // 첫번째 질문 저장

		String subject2 = "스프링부트 모델 질문입니다.";
		String content2 = "id는 자동으로 생성되나요?";
		Question q2 = new Question(subject2, content2);
		this.questionRepository.save(q2); // 두번째 질문 저장
	}

//	@Test
	void testJpaSize() {
		List<Question> all = this.questionRepository.findAll();
		assertEquals(6, all.size());

		Question q = all.get(0);
		assertEquals("sbb가 무엇인가요?", q.getSubject());
	}
	
//	@Test
	void testJpaSelectById() {
		Optional<Question> oq = this.questionRepository.findById(1L);
		if(oq.isPresent()) {
			Question q=oq.get();
			assertEquals("sbb가 무엇인가요?", q.getSubject());
		}
	}
	
//	@Test
	void testJpaSelectByProperty() {
		Question q1 = this.questionRepository.findBySubject("sbb가 무엇인가요?");
		assertEquals(1, q1.getId());
		
		Question q2 = this.questionRepository.findBySubjectAndContent("sbb가 무엇인가요?", "sbb에 대해서 알고 싶습니다.");
		assertEquals(1, q2.getId());
		
		List<Question> qList = this.questionRepository.findBySubjectLike("sbb%");
        Question q = qList.get(0);
        assertEquals("sbb가 무엇인가요?", q.getSubject());
	}
	
	@Test
	void testJpaUpdateQuestion() {
		Optional<Question> oq = this.questionRepository.findById(1L);
		assertTrue(oq.isPresent());
		Question q=  oq.get();
		
		q.updateSubject("수정된 제목");
		this.questionRepository.save(q);
	}
	
}
