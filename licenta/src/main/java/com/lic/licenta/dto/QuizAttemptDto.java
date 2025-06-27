package com.lic.licenta.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class QuizAttemptDto {
    private Long id;
    private String quizTitle;
    private int score;
    private LocalDateTime submittedAt;

    public QuizAttemptDto(Long id, String quizTitle, int score, LocalDateTime submittedAt) {
        this.id = id;
        this.quizTitle = quizTitle;
        this.score = score;
        this.submittedAt = submittedAt;
    }
}
