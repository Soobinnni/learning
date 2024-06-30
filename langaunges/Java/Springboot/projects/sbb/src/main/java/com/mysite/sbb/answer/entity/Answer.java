package com.mysite.sbb.answer.entity;

import java.time.LocalDateTime;

import com.mysite.sbb.question.entity.Question;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@AllArgsConstructor @NoArgsConstructor @RequiredArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "answer")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(columnDefinition = "TEXT")
    private String content;

    @CreatedDate
    private LocalDateTime createDate;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;  // 질문 엔티티를 참조하기 위해 question 속성을 추가
}