package com.mysite.sbb.answer.service;

import com.mysite.sbb.answer.dto.AnswerDTO;
import com.mysite.sbb.answer.entity.Answer;
import com.mysite.sbb.answer.repository.AnswerRepository;
import com.mysite.sbb.question.dto.QuestionDTO;
import com.mysite.sbb.question.entity.Question;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AnswerServiceImpl implements AnswerService{
    private final AnswerRepository answerRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public void create(QuestionDTO questionDTO, String content){
        /*
        * TODO: modelMapper로 변경하기
        * */
        Question questionEntity = new Question(
                questionDTO.getId(),
                questionDTO.getSubject(),
                questionDTO.getContent(),
                questionDTO.getCreateDate(),
                questionDTO.getAnswerList().stream().map(this::converToAnswerDTO).collect(Collectors.toList())
        );
        Answer answer=new Answer(content, questionEntity);
        this.answerRepository.save(answer);
    }
    private Answer converToAnswerDTO(AnswerDTO answer){
        return modelMapper.map(answer, Answer.class);
    }
}