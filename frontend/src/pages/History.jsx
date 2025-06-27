import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css";

const History = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/quiz/history", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const sortedAttempts = res.data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        setAttempts(sortedAttempts);
      })
      .catch((err) => console.error("Error fetching quiz history:", err));
  }, []);

  return (
    <div className="history-container">
      <h2>Istoric Quiz-uri</h2>
      {attempts.length === 0 ? (
        <p>Nu ai rezolvat niciun quiz pana acum.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Scor</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt, index) => (
              <tr key={index}>
                <td>{attempt.quizTitle}</td>
                <td>{attempt.score}</td>
                <td>{new Date(attempt.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
