package com.mysite.sbb.question.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.mysite.sbb.answer.dto.AnswerDTO;

import com.mysite.sbb.answer.entity.Answer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.modelmapper.ModelMapper;

@Getter @Setter 
@AllArgsConstructor @NoArgsConstructor
public class QuestionDTO {
    private Long id;
    private String subject;
    private String content;
    private LocalDateTime createDate;
    private List<AnswerDTO> answerList;
}
