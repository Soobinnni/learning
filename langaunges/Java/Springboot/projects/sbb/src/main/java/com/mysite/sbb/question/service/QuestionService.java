package com.mysite.sbb.question.service;

import com.mysite.sbb.question.dto.QuestionDTO;
import com.mysite.sbb.question.entity.Question;

import java.util.List;

public interface QuestionService {
    public List<Question> getList() throws Exception;
    public QuestionDTO getQuestion(Long id) throws Exception;
    public void create(QuestionDTO questionDTO) throws Exception;
}
