package com.mysite.sbb.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.mysite.sbb.entity.Answer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter 
@AllArgsConstructor @NoArgsConstructor
public class QuestionDTO {
	private Long id;
    private String subject;
    private String content;
    private LocalDateTime createDate;
    private List<Answer> answerList; 
}
