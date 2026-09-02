import api from "./api";

interface LoginResponse {
  access: string;
  refresh: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/token/", {
    username,
    password,
  });

  return response.data;
};