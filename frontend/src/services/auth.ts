import api from "./api";

export const login = async (
  username: string,
  password: string
) => {
  const response = await api.post("/token/", {
    username,
    password,
  });

  return response.data;
};