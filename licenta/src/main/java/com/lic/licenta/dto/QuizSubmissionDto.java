package com.lic.licenta.dto;

import com.lic.licenta.model.Response;
import java.util.List;

public class QuizSubmissionDto {
    private Integer quizId;
    private List<Response> responses;

    public Integer getQuizId() {
        return quizId;
    }

    public void setQuizId(Integer quizId) {
        this.quizId = quizId;
    }

    public List<Response> getResponses() {
        return responses;
    }

    public void setResponses(List<Response> responses) {
        this.responses = responses;
    }
}
