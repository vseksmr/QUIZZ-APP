import React, { useState } from 'react';
import './QuizResultPopup.css';

const QuizResultPopup = ({ correctAnswers, totalQuestions, answers, correctAnswersList, onClose }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  const handleShowAnswers = () => {
    setShowAnswers(true);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Ai raspuns corect la {correctAnswers} din {totalQuestions} intrebari!</h3>
        <button onClick={handleShowAnswers}>Next</button>
        {showAnswers && (
          <div className="answers-list">
            {answers.map((answer, index) => (
              <div key={index} className={`answer ${answer === correctAnswersList[index] ? 'correct' : 'incorrect'}`}>
                <p>Intrebarea {index + 1}:</p>
                <p>
                  <span className={answer === correctAnswersList[index] ? 'green' : 'red'}>
                    Tau: {answer}
                  </span>
                  <span className={answer === correctAnswersList[index] ? 'green' : 'green-correct'}>
                    Corect: {correctAnswersList[index]}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default QuizResultPopup;
