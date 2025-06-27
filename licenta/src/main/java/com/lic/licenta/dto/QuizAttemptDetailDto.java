package com.lic.licenta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptDetailDto {
    private String questionText;
    private String correctAnswer;
    private String userAnswer;
}
