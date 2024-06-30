package com.mysite.sbb.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@AllArgsConstructor @NoArgsConstructor @RequiredArgsConstructor
@Entity
@Table(name = "answer")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createDate;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;  // 질문 엔티티를 참조하기 위해 question 속성을 추가
}