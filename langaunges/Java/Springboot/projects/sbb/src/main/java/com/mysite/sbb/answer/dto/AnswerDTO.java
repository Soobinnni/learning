package com.mysite.sbb.answer.dto;

import java.time.LocalDateTime;

import com.mysite.sbb.question.dto.QuestionDTO;
import com.mysite.sbb.question.entity.Question;

import lombok.*;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class AnswerDTO {
	private Long id;
    private String content;
    private LocalDateTime createDate; 
    private QuestionDTO question;
    @Override
    public String toString() {
        return "AnswerDTO{" +
                "id=" + id +
                ", content='" + content +
                '}';
    }
}
