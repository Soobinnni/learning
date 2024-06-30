package com.mysite.sbb.question.service;

import com.mysite.sbb.exception.DataNotFoundException;
import com.mysite.sbb.question.dto.QuestionDTO;
import com.mysite.sbb.question.dto.QuestionForm;
import com.mysite.sbb.question.entity.Question;
import com.mysite.sbb.question.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    @Transactional
    public QuestionDTO getQuestion(Long id) throws Exception {
        Optional<Question> question=this.questionRepository.findById(id);
        if(question.isPresent()){
            Question questionEntity = question.get();

           QuestionDTO questionDTO=modelMapper.map(questionEntity, QuestionDTO.class);
            return questionDTO;
        } else{
            throw new DataNotFoundException("question not found");
        }
    }

    @Override
    public void create(QuestionForm questionForm) throws Exception {
        this.questionRepository.save(new Question(
                questionForm.getSubject(),
                questionForm.getContent()
        ));
    }
}
