package com.mysite.sbb.question.controller;

import com.mysite.sbb.answer.dto.AnswerForm;
import com.mysite.sbb.question.dto.QuestionDTO;
import com.mysite.sbb.question.dto.QuestionForm;
import com.mysite.sbb.question.entity.Question;
import com.mysite.sbb.question.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor // final, @NonNull 필드 생성자 생성, 자동 주입
@Controller
@RequestMapping("/question")
public class QuestionController {
    private final QuestionService questionService;
    @GetMapping("/list")
    public String list(Model model) throws Exception{
        /*
        *  Model 객체는 자바 클래스(Java class)와 템플릿(template) 간의 연결 고리 역할
        * */
        List<Question> questionList = this.questionService.getList();
        model.addAttribute("questionList", questionList);
        return "question/list";
    }

    @GetMapping("/detail/{id}")
    public String detail(
            Model model,
            @PathVariable("id") Long id,
            AnswerForm answerForm
            ) throws Exception{
        QuestionDTO questionDTO=questionService.getQuestion(Long.valueOf(id));
        model.addAttribute("question", questionDTO);
        return "question/detail";
    }

    @GetMapping("/register")
    public String registerForm(QuestionForm questionForm) {
        return "question/register";
    }

    @PostMapping("/register")
    public String register(
            @Valid QuestionForm questionForm,
            BindingResult bindingResult
    ) throws Exception{
        if (bindingResult.hasErrors()) {
            return "question/register";
        }
        this.questionService.create(questionForm);
        return "redirect:/question/list";
    }
}
