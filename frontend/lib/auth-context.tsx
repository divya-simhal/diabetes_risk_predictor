"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api";

interface AuthContextValue {
  username: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Reading localStorage can only happen client-side after mount (SSR has
  // no access to it), so syncing it into state here is the correct place.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedUsername = window.localStorage.getItem("vitals_username");
    const storedToken = window.localStorage.getItem("vitals_token");
    setIsLoading(false);
    if (storedUsername && storedToken) {
      setUsername(storedUsername);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function login(usernameInput: string, password: string) {
    const token = await loginUser(usernameInput, password);
    window.localStorage.setItem("vitals_token", token);
    window.localStorage.setItem("vitals_username", usernameInput);
    setUsername(usernameInput);
    router.push("/predict");
  }

  async function register(
    usernameInput: string,
    email: string,
    password: string
  ) {
    await registerUser(usernameInput, email, password);
    await login(usernameInput, password);
  }

  function logout() {
    window.localStorage.removeItem("vitals_token");
    window.localStorage.removeItem("vitals_username");
    setUsername(null);
    router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{ username, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
