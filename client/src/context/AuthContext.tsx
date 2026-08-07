import { createContext, useState } from "react";

import type { ReactNode } from "react";

import type { AuthUser } from "../api/authApi";

const AUTH_STORAGE_KEY = "summitops.auth";

interface StoredAuthSession {
  user: AuthUser;
  token: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<StoredAuthSession | null>(() => {
    const serializedSession = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!serializedSession) {
      return null;
    }

    try {
      const parsedSession = JSON.parse(serializedSession) as StoredAuthSession;

      if (!parsedSession.user || !parsedSession.token) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

      return parsedSession;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });

  function login(user: AuthUser, token: string) {
    const nextSession = {
      user,
      token,
    };

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(nextSession)
    );

    setSession(nextSession);
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
