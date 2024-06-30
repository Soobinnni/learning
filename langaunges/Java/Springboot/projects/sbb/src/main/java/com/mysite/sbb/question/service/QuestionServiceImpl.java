package com.mysite.sbb.question.service;

import com.mysite.sbb.question.entity.Question;
import com.mysite.sbb.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class QuestionServiceImpl implements QuestionService{
    private final QuestionRepository questionRepository;


    @Override
    public List<Question> getList() {
        return this.questionRepository.findAll();
    }
}
