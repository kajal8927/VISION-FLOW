import api from "./api.js";

const TOKEN_KEY = "visionflow_token";
const USER_KEY = "visionflow_user";

const demoUsers = [
  {
    id: "admin-001",
    name: "VisionFlow Admin",
    email: "admin@visionflow.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "user-001",
    name: "Demo User",
    email: "user@visionflow.com",
    password: "user123",
    role: "user",
  },
];

export const saveAuthData = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    clearAuthData();
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    const token = response.data?.token;
    const user = response.data?.user;

    if (!token || !user) {
      throw new Error("Invalid backend response");
    }

    saveAuthData(token, user);

    return {
      success: true,
      token,
      user,
    };
  } catch {
    const matchedUser = demoUsers.find(
      (item) => item.email === email && item.password === password
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const { password: _password, ...safeUser } = matchedUser;
    const fakeToken = `mock-token-${safeUser.role}-${Date.now()}`;

    saveAuthData(fakeToken, safeUser);

    return {
      success: true,
      token: fakeToken,
      user: safeUser,
    };
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await api.post("/auth/register", formData);

    const token = response.data?.token;
    const user = response.data?.user;

    if (!token || !user) {
      throw new Error("Invalid backend response");
    }

    saveAuthData(token, user);

    return {
      success: true,
      token,
      user,
    };
  } catch {
    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: "user",
    };

    const fakeToken = `mock-token-user-${Date.now()}`;

    saveAuthData(fakeToken, newUser);

    return {
      success: true,
      token: fakeToken,
      user: newUser,
    };
  }
};

export const logoutUser = () => {
  clearAuthData();

  return {
    success: true,
  };
};