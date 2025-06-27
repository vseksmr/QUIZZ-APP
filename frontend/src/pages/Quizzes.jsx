import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Quizzes.css";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/quiz/all")
      .then((response) => {
        console.log("Received quizzes:", response);
        setQuizzes(response.data); 
      })
      .catch((err) => {
        console.error("Failed to fetch quizzes:", err);
      });
  }, []);

  return (
    <div className="quizzes-container">
      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div className="quiz-card" key={quiz.id}>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <button className="start-btn" onClick={() => navigate(`/solve/${quiz.id}`)}>
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;
