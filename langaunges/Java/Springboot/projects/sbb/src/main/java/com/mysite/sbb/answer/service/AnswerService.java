package com.mysite.sbb.answer.service;

import com.mysite.sbb.question.dto.QuestionDTO;

public interface AnswerService {
    public void create(QuestionDTO questionDTO, String content) throws Exception;
}