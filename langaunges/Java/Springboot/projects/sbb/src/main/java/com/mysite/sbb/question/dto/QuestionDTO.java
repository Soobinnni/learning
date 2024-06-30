package com.mysite.sbb.question.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.mysite.sbb.answer.dto.AnswerDTO;

import lombok.*;

@Getter @Setter @ToString

@AllArgsConstructor @NoArgsConstructor
public class QuestionDTO {
    private Long id;
    private String subject;
    private String content;
    private LocalDateTime createDate;
    private List<AnswerDTO> answerList;
}
