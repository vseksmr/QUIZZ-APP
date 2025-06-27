package com.lic.licenta.service;

import com.lic.licenta.model.*;
import com.lic.licenta.repository.QuestionRepository;
import com.lic.licenta.repository.QuizAttemptRepository;
import com.lic.licenta.repository.QuizRepository;
import com.lic.licenta.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {
    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    QuizRepository quizRepository;

    @Autowired
    UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Transactional
    public ResponseEntity<String> createQuiz(String title, List<Question> userQuestions, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setCreatedBy(user);

        for (Question question : userQuestions) {
            question.setQuiz(quiz);
        }
        quiz.setQuestions(userQuestions);
        quizRepository.save(quiz);
        questionRepository.saveAll(userQuestions);


        return new ResponseEntity<>("Quiz created successfully!", HttpStatus.CREATED);
    }



    public ResponseEntity<List<QuestionWrapper>> getQuizQuestion(Integer id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        List<QuestionWrapper> questionForUser = quiz.getQuestions().stream()
                .map(q -> new QuestionWrapper(q.getId(), q.getQuestionTitle(), q.getOption1(), q.getOption2(), q.getOption3(), q.getOption4()))
                .toList();

        return ResponseEntity.ok(questionForUser);
    }


    public ResponseEntity<Integer> calculateQuizScore(Integer id, List<Response> responses) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
        List<Question> questions = quiz.getQuestions();

        int i = 0;
        int correct = 0;
        for (Response response : responses) {
            if (response.getResponse().equals(questions.get(i).getCorrectAnswer())) {
                correct += 1;
            }
            i++;
        }

        int score = correct;

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            QuizAttempt attempt = new QuizAttempt();
            attempt.setQuiz(quiz);
            attempt.setUser(user);
            attempt.setScore(score);
            attempt.setSubmittedAt(LocalDateTime.now());

            quizAttemptRepository.save(attempt);
        } catch (Exception e) {
            System.err.println(" Eroare la salvarea quizAttempt: " + e.getMessage());
        }

        return new ResponseEntity<>(score, HttpStatus.OK);
    }


    public ResponseEntity<List<Quiz>> getUserQuizzes(String username) {
        List<Quiz> quizzes = quizRepository.findQuizzesByUsername(username);
        return ResponseEntity.ok(quizzes);
    }


    public boolean deleteQuiz(Integer id) {
        Optional<Quiz> quizOptional = quizRepository.findById(id);
        if (quizOptional.isPresent()) {
            quizRepository.deleteById(id);
            return true;
        }
        return false;
    }


    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findAll();
        return ResponseEntity.ok(quizzes);
    }

}
