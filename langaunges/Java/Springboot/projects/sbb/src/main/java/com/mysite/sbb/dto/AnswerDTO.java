package com.mysite.sbb.dto;

import java.time.LocalDateTime;

import com.mysite.sbb.entity.Question;

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
