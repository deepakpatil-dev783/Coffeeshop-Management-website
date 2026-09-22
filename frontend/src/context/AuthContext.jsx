import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const DEFAULT_ACCOUNTS = {
  customer: {
    email: "customer@brewbean.com",
    password: "customer123",
    role: "customer",
  },
  staff: {
    email: "staff@brewbean.com",
    password: "staff123",
    role: "staff",
  },
  owner: {
    email: "admin@brewbean.com",
    password: "admin123",
    role: "owner",
  },
};

const MOCK_USERS = {
  customer: {
    id: "u_customer",
    name: "Sophia Reynolds",
    email: "customer@brewbean.com",
    role: "customer",
    phone: "+91 9876543210",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  staff: {
    id: "u_staff",
    name: "Marcus Vance (Barista Supervisor)",
    email: "staff@brewbean.com",
    role: "staff",
    phone: "+91 9876543211",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  owner: {
    id: "u_owner",
    name: "Eleanor Vance (General Manager / Owner)",
    email: "admin@brewbean.com",
    role: "owner",
    phone: "+91 9876543212",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  },
};

export const sanitizeIndianPhone = (value = "") => {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
  if (!digitsOnly) return "";
  return `+91 ${digitsOnly}`;
};

export const isValidIndianPhone = (value = "") => {
  if (!value) return false;
  const normalized = value.replace(/\s+/g, "").replace(/^\+91/, "");
  return /^\d{10}$/.test(normalized);
};

const getRoleFromEmail = (email = "") => {
  const normalized = String(email).trim().toLowerCase();
  if (normalized.includes("staff")) return "staff";
  if (normalized.includes("admin") || normalized.includes("owner"))
    return "owner";
  return "customer";
};

const validateCredentials = (email, password) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const allowedAccount = Object.values(DEFAULT_ACCOUNTS).find(
    (account) => account.email === normalizedEmail,
  );

  if (!allowedAccount) return null;
  if (allowedAccount.password !== String(password || "")) return null;

  return allowedAccount.role;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("brew_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("brew_token") || null,
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem("brew_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("brew_user");
    }
  }, [user]);

  const login = async (email, password) => {
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const role = validateCredentials(normalizedEmail, password);

    if (!role) {
      return {
        success: false,
        message: "Invalid email or password for this account role.",
      };
    }

    try {
      const res = await axios.post("/api/auth/login", {
        email: normalizedEmail,
        password,
      });
      if (res.data.success) {
        const userData = { ...res.data.user, role: res.data.user.role || role };
        setUser(userData);
        setToken(res.data.token);
        localStorage.setItem("brew_token", res.data.token);
        return { success: true, user: userData };
      }
    } catch (e) {
      const mockUser = { ...MOCK_USERS[role], email: normalizedEmail };
      setUser(mockUser);
      setToken("demo_token");
      return { success: true, user: mockUser };
    }

    return { success: false, message: "Authentication failed." };
  };

  const signup = async (userData) => {
    const role = "customer";
    const email = String(userData.email || "")
      .trim()
      .toLowerCase();
    const phone = userData.phone || "";

    if (!email || !userData.password || !userData.name) {
      return {
        success: false,
        message: "Name, email, and password are required.",
      };
    }

    if (!isValidIndianPhone(phone)) {
      return {
        success: false,
        message: "Mobile number must be 10 digits. Example: +91 9876543210",
      };
    }

    try {
      const res = await axios.post("/api/auth/register", {
        ...userData,
        email,
        role,
        phone: sanitizeIndianPhone(phone),
      });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem("brew_token", res.data.token);
        return { success: true, user: res.data.user };
      }
    } catch (e) {
      const newU = {
        id: `u_${Date.now()}`,
        name: userData.name,
        email,
        role,
        phone: sanitizeIndianPhone(phone),
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      };
      setUser(newU);
      return { success: true, user: newU };
    }

    return { success: false, message: "Signup failed." };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("brew_user");
    localStorage.removeItem("brew_token");
  };

  // Switch role seamlessly for testing demo portals
  const switchRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) {
      setUser(MOCK_USERS[roleKey]);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, switchRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
