import { api } from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    return api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (
    name: string,
    gender: string,
    email: string,
    password: string,
  ) => {
    return api("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        gender,
        email,
        password,
        role: "user",
      }),
    });
  },

  forgotPassword: async (email: string) => {
    return api("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return api("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        new_password: newPassword,
      }),
    });
  },
};
