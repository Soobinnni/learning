package com.mysite.sbb.answer.controller;

import com.mysite.sbb.answer.dto.AnswerForm;
import com.mysite.sbb.answer.service.AnswerService;
import com.mysite.sbb.question.dto.QuestionDTO;
import com.mysite.sbb.question.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/answer")
@RequiredArgsConstructor
public class AnswerController {
    private final AnswerService answerService;
    private final QuestionService questionService;

    @PostMapping("/{questionId}")
    public String register(Model model,
                           @PathVariable("questionId")
                           Long questionId,
                           @Valid AnswerForm answerForm, BindingResult bindingResult
                           ) throws Exception{
        // question 가져오기
        QuestionDTO questionDTO = this.questionService.getQuestion(questionId);
        // 유효성 검사
        if(bindingResult.hasErrors()){
            model.addAttribute("question", questionDTO);
            return "question/detail";
        }
        // content 등록
        this.answerService.create(questionDTO, answerForm.getContent());
        return String.format("redirect:/question/detail/%s", String.valueOf(questionId));
    }
}