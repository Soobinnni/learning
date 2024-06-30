package com.mysite.sbb.answer.dto;

import java.time.LocalDateTime;

import com.mysite.sbb.question.entity.Question;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class AnswerDTO {
	private Long id;
    private String content;
    private LocalDateTime createDate; 
    private Question question;
}
