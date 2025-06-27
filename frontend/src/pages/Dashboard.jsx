import "./Dashboard.css";
import { useNavigate} from "react-router-dom";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [quizCount, setQuizCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    fetch("http://localhost:8080/quiz/count", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setQuizCount(data))
      .catch(err => console.error("Failed to fetch quiz count:", err));
  
    fetch("http://localhost:8080/users/count", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUserCount(data))
      .catch(err => console.error("Failed to fetch user count:", err));
  }, []);

  return (
    <div className="dashboard-page">
      <div className="card-grid">
        <div className="card quizzes">
          <div className="card-number">{quizCount}</div>
          <div className="card-title">Quizzes</div>
          <button className="info-btn" onClick={() => navigate("/quizzes")}>
            More info
          </button>
        </div>

        <div className="card users">
          <div className="card-number">{userCount}</div>
          <div className="card-title">Users</div>
          <button className="info-btn" onClick={() => navigate("/users")}>
            More info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;