import axios from "axios";

const API_URL = "http://localhost:8080/quiz";

export const fetchQuizzes = async () => {
  return axios.get(`${API_URL}/all`);
};

export const deleteQuiz = async (id, token) => {
  return axios.delete(`${API_URL}/delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
