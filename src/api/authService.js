
import api from "./axiosConfig";

export const registerUser = (data) =>
  api.post("/api/auth/register", data);

export const loginUser = (data) =>
  api.post("/api/auth/login", data);

export const setupAdmin = (data) =>
  api.post("/api/auth/setup-admin", data);

export const createManager = (data) =>
  api.post("/api/auth/create-manager", data);
