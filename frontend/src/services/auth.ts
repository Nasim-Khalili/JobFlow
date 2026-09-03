import api from "./api";

export interface LoginResponse {
  access: string;
  refresh: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post("/token/", {
    username,
    password,
  });

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch {
    logout();
    return false;
  }
};