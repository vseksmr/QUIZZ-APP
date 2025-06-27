import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user?.isAdmin) {
      alert("Not authorized");
      navigate("/dashboard");
      return;
    }

    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/users/", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));

    axios.get("http://localhost:8080/quiz/all", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setQuizzes(res.data));
  }, [user, loading, navigate]);

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:8080/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data); 
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("⚠️ Error deleting user:", error.response ? error.response.data : error.message);
      alert("An error occurred while deleting the user.");
    }
  };

  const deleteQuiz = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await axios.delete(`http://localhost:8080/quiz/delete/quiz/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  return (
    <div className="admin-dashboard">

      <div className="admin-section">
        <h3>👥 Users</h3>
        <div className="card-grid">
          {users.map(user => (
            <div key={user.id} className="card user-card">
              <p><strong>{user.username}</strong></p>
              <p>{user.email}</p>
              <button onClick={() => deleteUser(user.id)} className="delete-btn">Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h3>🧠 Quizzes</h3>
        <div className="card-grid">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="card quiz-card">
              <p><strong>{quiz.title}</strong></p>
              <button onClick={() => deleteQuiz(quiz.id)} className="delete-btn">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
