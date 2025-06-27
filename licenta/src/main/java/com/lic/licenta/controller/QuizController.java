package com.lic.licenta.controller;

import com.lic.licenta.dto.QuizAttemptDetailDto;
import com.lic.licenta.dto.QuizAttemptDto;
import com.lic.licenta.dto.QuizRequestDto;
import com.lic.licenta.dto.QuizSubmissionDto;
import com.lic.licenta.model.*;
import com.lic.licenta.repository.QuizAttemptRepository;
import com.lic.licenta.repository.QuizRepository;
import com.lic.licenta.repository.UserRepository;
import com.lic.licenta.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/quiz")
public class QuizController {
    @Autowired
    QuizService quizService;
    @Autowired
    QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<String> createQuiz(@RequestBody QuizRequestDto request,
                                             Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("User is not authenticated!");
        }

        String username = authentication.getName();

        return quizService.createQuiz(request.title, request.userQuestions, username);
    }



    @GetMapping("/get/{id}")
    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(@PathVariable Integer id){
        return quizService.getQuizQuestion(id);
    }

    @PostMapping("/submit")
    public ResponseEntity<Integer> submitQuiz(@RequestBody QuizSubmissionDto submission) {
        return quizService.calculateQuizScore(submission.getQuizId(), submission.getResponses());
    }


    @GetMapping("/my-quizzes")
    public ResponseEntity<List<Quiz>> getMyQuizzes(Authentication authentication) {
        String username = authentication.getName();
        return quizService.getUserQuizzes(username);
    }

    @DeleteMapping("/delete/quiz/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteQuiz(@PathVariable Integer id) {
        boolean deleted = quizService.deleteQuiz(id);
        if (deleted) {
            return ResponseEntity.ok("Quiz deleted successfully!");
        } else {
            return ResponseEntity.badRequest().body("Quiz not found or could not be deleted.");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countQuizzes() {
        long count = quizRepository.count();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/{id}/answers")
    public ResponseEntity<List<Map<String, String>>> getQuizAnswers(@PathVariable Integer id) {
        Quiz quiz = quizRepository.findById(id).get();
        List<Map<String, String>> answers = quiz.getQuestions().stream()
                .map(question -> {
                    Map<String, String> answer = new HashMap<>();
                    answer.put("questionId", question.getId().toString());
                    answer.put("correctAnswer", question.getCorrectAnswer());
                    return answer;
                })
                .collect(Collectors.toList());
        return new ResponseEntity<>(answers, HttpStatus.OK);
    }

    @GetMapping(value = "/history", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<QuizAttemptDto>> getUserQuizHistory(Authentication authentication) {
        String username = authentication.getName();
        System.out.println(" Cerere istoric pentru utilizatorul: " + username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<QuizAttempt> attempts = quizAttemptRepository.findByUser(user);
        System.out.println("QuizAttempts gasite: " + attempts.size());

        List<QuizAttemptDto> history = attempts.stream()
                .map(attempt -> new QuizAttemptDto(
                        attempt.getId(),attempt.getQuiz().getTitle(),
                        attempt.getScore(),
                        attempt.getSubmittedAt()
                ))
                .toList();

        return ResponseEntity.ok(history);
    }


    @GetMapping("/attempt/{attemptId}/details")
    public ResponseEntity<List<QuizAttemptDetailDto>> getAttemptDetails(@PathVariable Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        Quiz quiz = attempt.getQuiz();
        User user = attempt.getUser();


        List<QuizAttemptDetailDto> details = quiz.getQuestions().stream().map(question -> {

            String userAnswer = "[nedisponibil]";

            return new QuizAttemptDetailDto(
                    question.getQuestionTitle(),
                    question.getCorrectAnswer(),
                    userAnswer
            );
        }).toList();

        return ResponseEntity.ok(details);
    }




}
