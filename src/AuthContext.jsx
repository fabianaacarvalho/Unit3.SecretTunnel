import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  async function signup() {
    try {
      const response = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Fabi",
          password: "password",
        }),
      });
      const result = await response.json();
      // console.log(result);

      if (result.token) {
        setToken(result.token);
        setLocation("TABLET");
      } else {
        console.error("Signup failed:", result.message || result);
      }
    } catch (e) {
      console.error("Signup error:", e);
    }
  }

  // TODO: authenticate
  async function authenticate() {
    if (!token) {
      throw new Error("No token available. Please sign up first.");
    }

    try {
      const response = await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed.");
      }

      const result = await response.json();
      setLocation("TUNNEL");
    } catch (e) {
      console.error("Authentication error:", e);
      throw e;
    }
  }

  const value = { token, location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
