import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const teamAPI = {
  getTeam: () => api.get("/team"),
  getPlayers: () => api.get("/team/players"),
};

export const transferAPI = {
  getMarket: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/transfer?${params.toString()}`);
  },
  addToTransferList: (playerId, askingPrice) =>
    api.post(`/transfer/list/${playerId}`, { askingPrice }),
  removeFromTransferList: (playerId) =>
    api.delete(`/transfer/list/${playerId}`),
  buyPlayer: (playerId) => api.post(`/transfer/buy/${playerId}`),
};

export default api;
