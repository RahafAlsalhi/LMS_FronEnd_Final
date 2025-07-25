import httpClient from "../../services/httpClient";

const authApi = {
  login: async (email, password) => {
    return await httpClient.post("/auth/login", { email, password });
  },

  register: async (userData) => {
    return await httpClient.post("/auth/register", userData);
  },

  getCurrentUser: async () => {
    return await httpClient.get("/auth/me");
  },

  // Add this new method for token refresh
  refreshToken: async (refreshToken) => {
    return await httpClient.post("/auth/refresh", {
      refreshToken,
    });
  },

  logout: async () => {
    return await httpClient.post("/auth/logout");
  },
};

export { authApi };
