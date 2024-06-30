package com.mysite.sbb.answer.controller;

import com.mysite.sbb.answer.service.AnswerService;
import com.mysite.sbb.question.dto.QuestionDTO;
import com.mysite.sbb.question.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/answer")
@RequiredArgsConstructor
public class AnswerController {
    private final AnswerService answerService;
    private final QuestionService questionService;

    @PostMapping("/{questionId}")
    public String register( Model model,
                           @PathVariable("questionId")
                           Long questionId,
                           @RequestParam(value = "content") String content
                           ) throws Exception{
        // question 가져오기
        QuestionDTO questionDTO = this.questionService.getQuestion(questionId);
        // content 등록
        this.answerService.create(questionDTO, content);
        return String.format("redirect:/question/detail/%s", String.valueOf(questionId));
    }
}