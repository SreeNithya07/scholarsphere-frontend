import axios from "axios";

// Dedicated Axios instance for Content Service on port 8002
const contentApi = axios.create({
  baseURL: "http://localhost:8002",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization Bearer token dynamically to every request
contentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllContent = () =>
  contentApi.get("/content");

export const getContentByCategory = (category) =>
  contentApi.get(`/content/category/${category}`);

export const searchContent = (title) =>
  contentApi.get("/content/search", {
    params: { title },
  });

export const addContent = (data) =>
  contentApi.post("/content", data);

export const updateContent = (id, data) =>
  contentApi.put(`/content/${id}`, data);

export const deleteContent = (id) =>
  contentApi.delete(`/content/${id}`);