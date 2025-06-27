import React, { useState } from 'react';
import axios from 'axios';
import './CreateQuiz.css';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(
    Array.from({ length: 10 }, () => ({
      text: '',
      options: ['', '', '', ''],
      correctOption: 0
    }))
  );

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'text') {
      updatedQuestions[index].text = value;
    } else {
      updatedQuestions[index].options[field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctOption = parseInt(value);
    setQuestions(updatedQuestions);
  };

  const transformedQuestions = questions.map((q) => ({
    questionTitle: q.text,
    option1: q.options[0],
    option2: q.options[1],
    option3: q.options[2],
    option4: q.options[3],
    correctAnswer: q.options[q.correctOption]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/quiz/create", {
        title,
        userQuestions: transformedQuestions
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      alert('Quiz created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create quiz.');
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>Create a Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="question-input"
          required
        />

        {questions.map((q, idx) => (
          <div key={idx} className="quiz-question-card">
            <h3>{`Question ${idx + 1}`}</h3>
            <input
              type="text"
              placeholder="Enter question text"
              value={q.text}
              onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
              className="question-input"
              required
            />
            {q.options.map((opt, optIdx) => (
              <input
                key={optIdx}
                type="text"
                placeholder={`Option ${optIdx + 1}`}
                value={opt}
                onChange={(e) => handleQuestionChange(idx, optIdx, e.target.value)}
                className="option-input"
                required
              />
            ))}
            <select
              value={q.correctOption}
              onChange={(e) => handleCorrectOptionChange(idx, e.target.value)}
              className="correct-select"
            >
              <option value={0}>Correct: Option 1</option>
              <option value={1}>Correct: Option 2</option>
              <option value={2}>Correct: Option 3</option>
              <option value={3}>Correct: Option 4</option>
            </select>
          </div>
        ))}
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
