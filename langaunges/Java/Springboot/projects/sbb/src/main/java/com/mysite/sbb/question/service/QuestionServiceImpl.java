package com.mysite.sbb.question.service;

import com.mysite.sbb.exception.DataNotFoundException;
import com.mysite.sbb.question.dto.QuestionDTO;
import com.mysite.sbb.question.entity.Question;
import com.mysite.sbb.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class QuestionServiceImpl implements QuestionService{
    private final QuestionRepository questionRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<Question> getList() throws Exception {
        return this.questionRepository.findAll();
    }

    @Override
    public QuestionDTO getQuestion(Long id) throws Exception {
        Optional<Question> question=this.questionRepository.findById(id);
        if(question.isPresent()){
           QuestionDTO questionDTO=modelMapper.map(question.get(), QuestionDTO.class);
           return questionDTO;
        } else{
            throw new DataNotFoundException("question not found");
        }
    }
}
