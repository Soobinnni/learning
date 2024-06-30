package com.mysite.sbb.question.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.mysite.sbb.answer.entity.Answer;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
//import lombok.Setter;

@Getter //@Setter
@AllArgsConstructor @NoArgsConstructor @RequiredArgsConstructor
@Entity // Entity 클래스 선언
@EntityListeners(AuditingEntityListener.class)
@Table(name = "question")
public class Question {
	/* 일반적으로 엔티티를 만들 때에는 Setter 메서드를 사용하지 않고, 
	 * 생성자에 의해서만 엔티티의 값을 저장할 수 있게 하는 것을 권장한다.
	 * 만일 데이터를 변경해야 할 경우에는 메서드를 추가로 작성한다.
	 * Entity가 lombok 애너테이션 밑에 있어야 함.
	 * -----------------------------------------------------------------------------------------
	 * @Id: id 속성을 기본키로 지정.
	 * @GeneratedValue: 데이터를 저장할 때 해당 속성에 값을 일일이 입력하지 않아도 자동으로 1씩 증가(Index)
	 					(strategy 옵션을 생략한다면 @GeneratedValue 애너테이션이 
	 					지정된 모든 속성에 번호를 차례로 생성하므로 순서가 일정한 고유 번호를 가질 수 없게 된다.)
	 * @Column: 테이블의 열 이름과 일치하는데 열의 세부 설정을 위해.
	 			columnDefinition은 열 데이터 유형 지정.
	 			엔티티의 속성은 @Column 애너테이션을 사용하지 않더라도 테이블의 열로 인식한다. 
	 			테이블의 열로 인식하고 싶지 않다면 @Transient 애너테이션을 사용
	 			---
	 			java의 카멜케이스 작성은 실제 데이터베이스에서의 스네이크케이스로 변환된다(createDate -> create_date)
	 			
	 * @Transient: 엔티티의 속성을 테이블의 열로 만들지 않고 클래스의 속성 기능으로만 사용하고자 할 때 
	 * 
	 * @OneToMany: Answer 객체들로 구성된 answerList를 Question 엔티티의 속성으로 추가하여 일대다 관계를 표시
	 				mappedBy는 양방향 연관관계에서 관계의 주인을 정의하는 속성. 
	 				관계의 주체가 되는 쪽을 지정하며 관계의 주인은 mappedBy 속성에 명시된 필드가 있는 엔티티다. 
	 				즉 관계의 주인(Owner)과 종속된 쪽(Inverse Side)을 구분하는 데 사용
	 * @ManyToOne: 연관관계에서 종속을 정의하는 속성. 
	 * */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 200)
    @NonNull
    private String subject;

    @Column(columnDefinition = "TEXT")
    @NonNull
    private String content;

    @CreatedDate
    private LocalDateTime createDate;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.REMOVE) 
    private List<Answer> answerList;
    
    

    public void updateSubject(String newSubject) {
        if (newSubject == null || newSubject.trim().isEmpty()) {
            throw new IllegalArgumentException("Subject cannot be null or empty");
        }
        if (newSubject.equals(this.subject)) {
            throw new IllegalArgumentException("New subject must be different from the current subject");
        }
        this.subject = newSubject;
    }
}
