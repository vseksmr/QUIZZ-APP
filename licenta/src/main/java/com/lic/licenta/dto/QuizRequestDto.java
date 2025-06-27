package com.lic.licenta.dto;

import com.lic.licenta.model.Question;

import java.util.List;

public class QuizRequestDto {
    public String title;
    public List<Question> userQuestions;
}
