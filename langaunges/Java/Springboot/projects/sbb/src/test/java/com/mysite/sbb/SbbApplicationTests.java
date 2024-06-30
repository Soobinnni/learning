package com.mysite.sbb;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import com.mysite.sbb.answer.entity.Answer;
import com.mysite.sbb.answer.repository.AnswerRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.mysite.sbb.question.entity.Question;
import com.mysite.sbb.question.repository.QuestionRepository;

@SpringBootTest
class SbbApplicationTests {
	@Autowired
	private QuestionRepository questionRepository;
	@Autowired
	private AnswerRepository answerRepository;

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
	
//	@Test
	void testJpaUpdateQuestion() {
		Optional<Question> oq = this.questionRepository.findById(1L);
		assertTrue(oq.isPresent());
		Question q=  oq.get();
		
		q.updateSubject("수정된 제목");
		this.questionRepository.save(q);
	}
	@Test
	void testJapDeleteQuestion(){
		assertEquals(2, this.questionRepository.count());
		Optional<Question> oq = this.questionRepository.findById(1L);
		assertTrue(oq.isPresent());
		Question q = oq.get();
		this.questionRepository.delete(q);
		assertEquals(1, this.questionRepository.count());
	}

	@Test
	void testCreateAnswer(){
		Optional<Question> oq = this.questionRepository.findById(2l);
		assertTrue(oq.isPresent());
		Question q = oq.get();

		Answer a = new Answer("네 자동으로 생성됩니다.", q);

		this.answerRepository.save(a);
	}

	@Test
	@Transactional // 설정 이유 -> https://www.notion.so/soovinn/Entity-41c0bdd48f9e437d9647c6e642cd476f?pvs=4#4ed3f9fbae834acd8817ef684c7e5fd2
	void testAnswerFindById() {
		Optional<Answer> oa = this.answerRepository.findById(1l);
		assertTrue(oa.isPresent());
		Answer a = oa.get();

		Question q = a.getQuestion();
		// 답변 Entity를 통해 Question Entity 조회
		assertEquals(2, q.getId());
		// Question Entity Entity를 통해 답변 Entity 조회
		List<Answer> al = q.getAnswerList();
		assertEquals(1, al.size());
		assertEquals("네 자동으로 생성됩니다.", al.get(0).getContent());
	}
}
