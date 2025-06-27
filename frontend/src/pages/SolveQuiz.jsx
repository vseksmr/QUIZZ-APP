import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './SolveQuiz.css';

const SolveQuiz = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(null);
  const [maxScore, setMaxScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/quiz/get/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        console.log('Full API Response Data:', JSON.stringify(res.data, null, 2));

        const randomized = res.data.map(q => {
          const options = [q.option1, q.option2, q.option3, q.option4];
          const shuffledOptions = options
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        
          return {
            ...q,
            shuffledOptions: shuffledOptions
          };
        });
        
        setQuestions(randomized);
        const answers = {};
        res.data.forEach(question => {
          console.log('Full Question Object:', JSON.stringify(question, null, 2));
          console.log('Question:', question);
          console.log('Correct Answer:', question.correctAnswer);
          answers[question.id] = question.correctAnswer;
        });
        console.log('Stored Correct Answers:', answers);
        setCorrectAnswers(answers);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (questionId, answer) => {
    if (!submitted) {
      setResponses(prev => ({ ...prev, [questionId]: answer }));
    }
  };

  const handleSubmit = () => {
    const responseArray = Object.entries(responses).map(([questionId, response]) => ({
      questionId: Number(questionId),
      response
    }));

    const body = {
      quizId: Number(id),
      responses: responseArray
    };

    setMaxScore(questions.length);

    axios.post(`http://localhost:8080/quiz/submit`, body, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then(res => {
      console.log('Score received:', res.data);
      console.log('Score received:', res.data); 
      setScore(res.data);
      setSubmitted(true);
      
      return axios.get(`http://localhost:8080/quiz/${id}/answers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    })
    .then(res => {
      console.log('Correct answers response:', res.data);
      const answers = {};
      res.data.forEach(answer => {
        answers[answer.questionId] = answer.correctAnswer;
      });
      setCorrectAnswers(answers);
      setSubmitted(true);
    })
    .catch(err => {
      console.error("Error:", err);
    });
  };

  const getOptionClassName = (question, option) => {
    if (!submitted) {
      return `option-box ${responses[question.id] === option ? "selected" : ""}`;
    }
    
    console.log('Checking option:', option);
    console.log('Question ID:', question.id);
    console.log('Correct answer for this question:', correctAnswers[question.id]);
    
   
    if (option === correctAnswers[question.id]) {
      console.log('This is the correct answer!');
      return "option-box correct";
    }
    
    
    if (responses[question.id] === option && option !== correctAnswers[question.id]) {
      console.log('This is an incorrect answer!');
      return "option-box incorrect";
    }
    
    
    return "option-box";
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const areAllQuestionsAnswered = () => {
    return questions.every(question => responses[question.id]);
  };

  const handleSubmitClick = () => {
    if (areAllQuestionsAnswered()) {
      setShowConfirmDialog(true);
      setShowWarning(false);
    } else {
      setShowWarning(true);
      
      const firstUnansweredIndex = questions.findIndex(q => !responses[q.id]);
      if (firstUnansweredIndex !== -1) {
        setCurrentQuestion(firstUnansweredIndex);
      }
    }
  };

  const getQuestionStatus = (questionId) => {
    return responses[questionId] ? "answered" : "unanswered";
  };

  const confirmSubmit = () => {
    setShowConfirmDialog(false);
    handleSubmit();
  };

  const cancelSubmit = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="main-container">
      <h2>Quiz #{id}</h2>
      
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(currentQuestion + 1) / questions.length * 100}%` }}
        ></div>
        <div className="question-indicators">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={`question-dot ${getQuestionStatus(q.id)} ${index === currentQuestion ? 'current' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            />
          ))}
        </div>
        <span className="progress-text">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

     
      {showWarning && (
        <div className="warning-message">
          Please answer all questions before submitting. Unanswered questions are marked in red above.
        </div>
      )}

      {submitted && score !== null && (
  <div className="score-display">
    {console.log("Scor salvat in state:", score)}
    <h3>Your Score: {typeof score === "number" ? score : "-"} out of {maxScore}</h3>
    <p className="review-message">
      Quiz submitted successfully! Green boxes show correct answers, red boxes show incorrect answers.
    </p>
  </div>
)}

      
      {questions.length > 0 && (
        <div className="question-card">
          <p className="question-title">
            <strong>{currentQuestion + 1}. {questions[currentQuestion].questionTitle}</strong>
          </p>

          <div className="options-grid">
            {questions[currentQuestion].shuffledOptions.map((opt, i) => (
              <label
                key={i}
                className={getOptionClassName(questions[currentQuestion], opt)}
                onClick={() => handleChange(questions[currentQuestion].id, opt)}
              >
                <input
                  type="radio"
                  name={`q-${questions[currentQuestion].id}`}
                  value={opt}
                  checked={responses[questions[currentQuestion].id] === opt}
                  onChange={() => handleChange(questions[currentQuestion].id, opt)}
                  style={{ display: "none" }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}

   
      <div className="navigation-buttons">
        <button 
          onClick={goToPreviousQuestion} 
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        <button 
          onClick={goToNextQuestion} 
          disabled={currentQuestion === questions.length - 1}
        >
          Next
        </button>
        {!submitted && currentQuestion === questions.length - 1 && (
          <button onClick={handleSubmitClick}>Submit Quiz</button>
        )}
      </div>

     
      {showConfirmDialog && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>Submit Quiz?</h3>
            <p>Are you sure you want to submit your answers? You will still be able to review your answers after submission.</p>
            <div className="confirmation-buttons">
              <button onClick={confirmSubmit}>Yes, Submit</button>
              <button onClick={cancelSubmit}>No, Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolveQuiz;
