package com.lic.licenta.repository;

import com.lic.licenta.model.QuizAttempt;
import com.lic.licenta.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUser(User user);
}
