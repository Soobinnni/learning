package com.mysite.sbb.question.controller;

import com.mysite.sbb.question.entity.Question;
import com.mysite.sbb.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequiredArgsConstructor // final, @NonNull 필드 생성자 생성, 자동 주입
@Controller
@RequestMapping("/question")
public class QuestionController {
    private final QuestionRepository questionRepository;
    @GetMapping("/list")
    public String list(Model model){
        /*
        *  Model 객체는 자바 클래스(Java class)와 템플릿(template) 간의 연결 고리 역할
        * */
        List<Question> questionList = this.questionRepository.findAll();
        model.addAttribute("questionList", questionList);
        System.out.println(questionList.get(0).getCreateDate());
        return "question/list";
    }
}
